const express = require("express");

const db = require("../database/db");
const { generateAccessToken } = require("../auth/generateToken");
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkUser = require("../middleware/checkUser");
const { hashPassword, comparePassword } = require("../auth/hash");
const logActivity = require("../utils/logActivity");
const { generateSetupToken, hashToken } = require("../utils/setupToken");
const { denyToken } = require("../auth/tokenDenylist");
const { sendProjectEmail } = require("../utils/sendEmail");
const { isEmailValid } = require("../utils/validators");
const router = express.Router();

// lock in-memory: senza, due richieste bootstrap concorrenti su DB vuoto
// passerebbero entrambe il check "count === 0" prima che la prima INSERT
// completi, creando due superadmin. Sufficiente per un'istanza singola
// (stesso presupposto della denylist token, vedi auth/tokenDenylist.js).
let bootstrapInProgress = false;

// pubblica, ma si autodisabilita da sola non appena esiste almeno un utente:
// crea il primissimo account (sempre superadmin) su un deploy/DB vuoto, dove
// /register non è ancora raggiungibile perché richiede già un token superadmin.
// Password scelta direttamente (non il flusso email/setup-token): a questo punto
// non esiste ancora nessun admin che possa inviarla, e SMTP potrebbe non essere configurato.
router.post("/bootstrap", async (req, res) => {
  const { name, surname, email, password } = req.body;

  const trimmedName = name ? name.trim() : "";
  const trimmedSurname = surname ? surname.trim() : "";
  const trimmedEmail = email ? email.trim() : "";
  const trimmedPassword = password ? password.trim() : "";

  if (!trimmedName || !trimmedSurname || !trimmedEmail || !trimmedPassword) {
    return res.status(400).json({ message: "Nome, cognome, email e password sono obbligatori." });
  }

  if (!isEmailValid(trimmedEmail)) {
    return res.status(400).json({ message: "Formato email non valido." });
  }

  if (trimmedPassword.length < 8) {
    return res.status(400).json({ message: "La password deve contenere almeno 8 caratteri." });
  }

  if (bootstrapInProgress) {
    return res.status(403).json({ message: "Bootstrap non disponibile: un'altra richiesta è già in corso." });
  }
  bootstrapInProgress = true;

  try {
    const [countRows] = await db.execute("SELECT COUNT(*) AS count FROM user");
    if (countRows[0].count > 0) {
      return res.status(403).json({ message: "Bootstrap non disponibile: esiste già almeno un utente nel sistema." });
    }

    const [existing] = await db.execute("SELECT id FROM user WHERE email = ?", [trimmedEmail]);
    if (existing.length > 0) {
      return res.status(400).json({
        error: "Richiesta non valida",
        message: `L'utenza con la mail ${trimmedEmail} esiste già.`,
      });
    }

    const passwordHash = await hashPassword(trimmedPassword);

    const [result] = await db.execute(
      "INSERT INTO user (nome, cognome, email, role, password_hash, first_login) VALUES (?, ?, ?, 'superadmin', ?, 0)",
      [trimmedName, trimmedSurname, trimmedEmail, passwordHash],
    );
    const userId = result.insertId;

    await logActivity(userId, null, "auth.bootstrap", { email: trimmedEmail });

    return res.status(201).json({
      message: "Account superadmin creato con successo.",
      user: { id: userId, nome: trimmedName, cognome: trimmedSurname, email: trimmedEmail, role: "superadmin" },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore del server" });
  } finally {
    bootstrapInProgress = false;
  }
});

// solo il superadmin può creare nuovi utenti; la password non è richiesta —
// l'utente la imposterà tramite il link di setup inviato via email
router.post("/register", checkSuperadmin, async (req, res) => {
  const { name, surname, email, role } = req.body;

  const trimmedName = name ? name.trim() : "";
  const trimmedSurname = surname ? surname.trim() : "";
  const trimmedEmail = email ? email.trim() : "";
  const trimmedRole = role ? role.trim().toLowerCase() : "";

  if (!trimmedName || !trimmedSurname || !trimmedEmail || !trimmedRole) {
    return res.status(400).json({ message: "Nome, cognome, email e ruolo sono obbligatori." });
  }

  if (!isEmailValid(trimmedEmail)) {
    return res.status(400).json({ message: "Formato email non valido." });
  }

  if (!["user", "admin", "superadmin"].includes(trimmedRole)) {
    return res.status(400).json({ message: "Ruolo non valido" });
  }

  try {
    const [existing] = await db.execute("SELECT id FROM user WHERE email = ?", [trimmedEmail]);
    if (existing.length > 0) {
      return res.status(400).json({
        error: "Richiesta non valida",
        message: `L'utenza con la mail ${trimmedEmail} esiste già.`,
      });
    }

    const [result] = await db.execute(
      "INSERT INTO user (nome, cognome, email, role) VALUES (?, ?, ?, ?)",
      [trimmedName, trimmedSurname, trimmedEmail, trimmedRole],
    );
    const userId = result.insertId;

    const { token, tokenHash, expiresAt } = generateSetupToken();
    await db.execute(
      "INSERT INTO password_setup_token (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [userId, tokenHash, expiresAt],
    );

    // fire-and-forget: l'utente è già stato creato, un SMTP giù non deve far
    // rispondere 500 al client (stesso pattern di checklists.js/testSessions.js)
    sendProjectEmail(
      { nome: trimmedName, email: trimmedEmail, role: trimmedRole },
      "setupPassword",
      { token },
    ).catch((err) => console.error("Errore invio email di setup:", err.message));
    await logActivity(req.user.id, null, "user.registered", { userId, email: trimmedEmail, role: trimmedRole });

    return res.status(201).json({ message: "Utente creato. Email di configurazione inviata." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore del server" });
  }
});

// verifica il token di setup, imposta la password e segna il token come usato
router.post("/setup", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password || !password.trim()) {
    return res.status(400).json({ message: "Token e password sono obbligatori." });
  }

  if (password.trim().length < 8) {
    return res.status(400).json({ message: "La password deve contenere almeno 8 caratteri." });
  }

  const tokenHash = hashToken(token);

  try {
    const [rows] = await db.execute(
      `SELECT * FROM password_setup_token
       WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()`,
      [tokenHash],
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Link non valido o scaduto." });
    }

    const setupToken = rows[0];
    const passwordHash = await hashPassword(password.trim());

    await db.execute(
      "UPDATE user SET password_hash = ?, first_login = 0, password_changed_at = NOW() WHERE id = ?",
      [passwordHash, setupToken.user_id],
    );

    await db.execute(
      "UPDATE password_setup_token SET used_at = NOW() WHERE id = ?",
      [setupToken.id],
    );

    return res.status(200).json({ message: "Password impostata con successo. Puoi ora effettuare il login." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore del server" });
  }
});

// pubblica: non rivela se l'email esiste, risposta identica in ogni caso.
// se l'utente esiste, invalida gli eventuali token di setup/reset ancora
// validi e ne genera uno nuovo, poi invia l'email (setup se non ha mai
// impostato una password, reset altrimenti).
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const trimmedEmail = email ? email.trim() : "";

  const genericResponse = {
    message: "Se l'email è registrata, riceverai a breve un'email con le istruzioni.",
  };

  if (!trimmedEmail) {
    return res.status(400).json({ message: "L'email è obbligatoria." });
  }

  if (!isEmailValid(trimmedEmail)) {
    return res.status(400).json({ message: "Formato email non valido." });
  }

  try {
    const [rows] = await db.execute("SELECT id, nome, email, password_hash FROM user WHERE email = ?", [trimmedEmail]);

    if (rows.length === 0) {
      return res.status(200).json(genericResponse);
    }

    const user = rows[0];

    // un solo link valido per utente: i token precedenti non ancora usati vengono invalidati
    await db.execute(
      "UPDATE password_setup_token SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL",
      [user.id],
    );

    const { token, tokenHash, expiresAt } = generateSetupToken();
    await db.execute(
      "INSERT INTO password_setup_token (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [user.id, tokenHash, expiresAt],
    );

    const emailType = user.password_hash ? "resetPassword" : "setupPassword";
     sendProjectEmail({ nome: user.nome, email: user.email }, emailType, { token })
     .catch((err) => console.error("Errore invio email di setup/reset:", err.message))

    
    
    
    await logActivity(user.id, null, "auth.password_reset_requested", { email: user.email });

    return res.status(200).json(genericResponse);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore del server" });
  }
});

// pubblica: verifica se un token di setup/reset è ancora utilizzabile, senza
// consumarlo. Usata dal FE per mostrare un link "non valido" invece del form
// quando l'utente torna indietro dopo aver già impostato la password.
router.get("/verify-setup-token", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(404).json({ valid: false, message: "Link non valido." });
  }

  try {
    const tokenHash = hashToken(token);
    const [rows] = await db.execute(
      "SELECT id FROM password_setup_token WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()",
      [tokenHash],
    );

    if (rows.length === 0) {
      return res.status(404).json({ valid: false, message: "Link non valido o già utilizzato." });
    }

    return res.status(200).json({ valid: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore del server" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e password sono obbligatorie" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM user WHERE email = ?", [email]);

    // risposta identica per email inesistente, account non configurato e
    // password errata: evita di rivelare quali email sono registrate
    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const user = rows[0];

    if (!user.password_hash) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const userWithoutPassword = {
      id: user.id,
      name: user.nome,
      surname: user.cognome,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    const token = generateAccessToken(userWithoutPassword);
    await logActivity(user.id, null, "auth.login", { email });

    res.status(200).json({
      message: "Login effettuato con successo",
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore del server" });
  }
});

router.post("/logout", checkUser, async (req, res) => {
  denyToken(req.token, req.user.exp);
  await logActivity(req.user.id, null, "auth.logout", { email: req.user.email });
  return res.status(200).json({ message: "Logout effettuato con successo" });
});

module.exports = router;

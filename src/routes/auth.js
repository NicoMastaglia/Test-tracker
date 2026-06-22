const express = require("express");
const db = require("../database/db");
const { generateAccessToken } = require("../auth/generateToken");
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkUser = require("../middleware/checkUser");
const { hashPassword, comparePassword } = require("../auth/hash");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, surname, email, password, role } = req.body;

  const trimmedName = name ? name.trim() : "";
  const trimmedSurname = surname ? surname.trim() : "";
  const trimmedEmail = email ? email.trim() : "";
  const trimmedPassword = password ? password.trim() : "";
  const trimmedRole = role ? role.trim() : "";

  if (!trimmedName || !trimmedSurname || !trimmedEmail || !trimmedPassword || !trimmedRole) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori e non possono essere vuoti." });
  }

  if (
    trimmedRole.toLowerCase() !== "user" &&
    trimmedRole.toLowerCase() !== "admin" &&
    trimmedRole.toLowerCase() !== "superadmin"
  ) {
    return res.status(400).json({ message: "Ruolo non valido" });
  }

  try {
    const [existingUser] = await db.execute(
      "SELECT id FROM user WHERE email = ?",
      [trimmedEmail]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ 
        error: "Richiesta non valida",
        message: `L'utenza con la mail ${trimmedEmail} esiste già.` 
      });
    }
    const passwordHash = await hashPassword(trimmedPassword);

    await db.execute(
      "INSERT INTO user (nome, cognome, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [trimmedName, trimmedSurname, trimmedEmail, passwordHash, trimmedRole.toLowerCase()],
    );
    
    return res.status(201).json({ message: "Utente registrato con successo" });
  } catch (err) {
    return res.status(500).json({ message: "Errore del server", specific: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e password sono obbligatorie" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM user WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const user = rows[0];

    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Password non valida" });
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

    res.status(200).json({
      message: "Login effettuato con successo",
      user: userWithoutPassword,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Errore del server",
      specific: err.message,
    });
  }
});

router.post("/logout", checkUser, (req, res) => {
  return res.status(200).json({ message: "Logout effettuato con successo" });
});

module.exports = router;
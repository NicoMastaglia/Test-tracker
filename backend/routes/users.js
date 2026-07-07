const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkAdmin = require("../middleware/checkAdmin");
const checkUser = require("../middleware/checkUser");
const { hashPassword, comparePassword } = require("../auth/hash");
const db = require("../database/db");
const logActivity = require("../utils/logActivity");

router.get("/", checkAdmin, async (req, res) => {
  if (req.user.role == "admin") {
    return db
      .execute(
        "SELECT id, nome, cognome, email, role FROM user WHERE role = 'user'",
      )
      .then(([rows]) => {
        res.status(200).json(rows);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Errore del server" });
      });
  } else if (req.user.role == "superadmin") {
    db.execute("SELECT id, nome, cognome, email, role FROM user")
      .then(([rows]) => {
        res.status(200).json(rows);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Errore del server" });
      });
  } else {
    res.status(403).json({ message: "Accesso negato" });
  }
});

router.get("/me", checkUser, async (req, res) => {
  const userId = req.user.id;
  db.execute("SELECT id, nome, cognome, email, role FROM user WHERE id = ?", [
    userId,
  ])
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
      res.status(200).json(rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Errore del server" });
    });
});

router.put("/me", checkUser, async (req, res) => {
  const userId = req.user.id;
  const { nome, cognome, email } = req.body;

  const trimmedNome = nome ? nome.trim() : "";
  const trimmedCognome = cognome ? cognome.trim() : "";
  const trimmedEmail = email ? email.trim() : "";

  if (!trimmedNome || !trimmedCognome || !trimmedEmail) {
    return res.status(400).json({ message: "Nome, cognome ed email non possono essere vuoti o contenere solo spazi." });
  }

  try {
    const [existingUser] = await db.execute(
      "SELECT id FROM user WHERE email = ? AND id != ?",
      [trimmedEmail, userId]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({
        error: "Richiesta non valida",
        message: `L'utenza con la mail ${trimmedEmail} esiste già.`
      });
    }
    const [result] = await db.execute(
      "UPDATE user SET nome = ?, cognome = ?, email = ? WHERE id = ?",
      [trimmedNome,
        trimmedCognome,
        trimmedEmail,
        userId,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    return res.status(200).json({
      message: "Dati aggiornati con successo",
      data: {
        nome: trimmedNome,
        cognome: trimmedCognome,
        email: trimmedEmail,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore del server" });
  }
});

router.patch("/me/password", checkUser, async (req, res) => {
  const userId = req.user.id;
  const { Oldpassword, Newpassword } = req.body;

  const trimmedOld = Oldpassword ? Oldpassword.trim() : "";
  const trimmedNew = Newpassword ? Newpassword.trim() : "";

  if (!trimmedOld || !trimmedNew) {
    return res.status(400).json({ message: "La vecchia e la nuova password non possono essere vuote." });
  }

  if (trimmedNew.length < 8) {
    return res.status(400).json({ message: "La nuova password deve contenere almeno 8 caratteri." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT password_hash FROM user WHERE id = ?",
      [userId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const user = rows[0];
    const isMatch = await comparePassword(trimmedOld, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "La password attuale non è corretta" });
    }

    const [result] = await db.execute(
      "UPDATE user SET password_hash = ? WHERE id = ?",
      [await hashPassword(trimmedNew), userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json({ message: "Password aggiornata con successo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore del server" });
  }
});

router.get("/:id", checkSuperadmin, async (req, res) => {
  const userId = req.params.id;
  db.execute("SELECT id, nome, cognome, email, role FROM user WHERE id = ?", [
    userId,
  ])
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
      res.status(200).json(rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Errore del server" });
    });
});

// progetti (come tester assegnato o responsabile) e sessioni dell'utente,
// per la pagina di dettaglio utente lato superadmin/admin
router.get("/:id/relations", checkSuperadmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const [userRows] = await db.execute(
      "SELECT id, nome, cognome, email, role FROM user WHERE id = ?",
      [userId],
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const [projects] = await db.execute(
      `SELECT DISTINCT p.id, p.name, p.status,
              CASE WHEN p.manager_id = ? THEN 'Responsabile' ELSE 'Tester' END AS relation
       FROM project p
       LEFT JOIN project_assignment pa ON pa.project_id = p.id AND pa.user_id = ?
       WHERE pa.user_id = ? OR p.manager_id = ?`,
      [userId, userId, userId, userId],
    );

    const [sessions] = await db.execute(
      `SELECT ts.id, ts.project_id, ts.status, ts.started_at, ts.completed_at, p.name AS project_name
       FROM test_session ts
       JOIN project p ON ts.project_id = p.id
       WHERE ts.user_id = ?
       ORDER BY ts.started_at DESC`,
      [userId],
    );

    return res.status(200).json({ user: userRows[0], projects, sessions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore del server" });
  }
});

router.put("/:id", checkSuperadmin, async (req, res) => {
  const userId = req.params.id;
  const { name, surname, email } = req.body;

  const trimmedName = name ? name.trim() : "";
  const trimmedSurname = surname ? surname.trim() : "";
  const trimmedEmail = email ? email.trim() : "";

  if (!trimmedName || !trimmedSurname || !trimmedEmail) {
    return res.status(400).json({ message: "I campi modificati non possono essere vuoti." });
  }

  try {
    const [existingUser] = await db.execute(
      "SELECT id FROM user WHERE email = ? AND id != ?",
      [trimmedEmail, userId]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({
        error: "Richiesta non valida",
        message: `L'utenza con la mail ${trimmedEmail} esiste già.`
      });
    }
    const [result] = await db.execute(
      "UPDATE user SET nome = ?, cognome = ?, email = ? WHERE id = ?",
      [trimmedName,
        trimmedSurname,
        trimmedEmail,
        userId,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    return res.status(200).json({
      message: "Dati aggiornati con successo",
      data: {
        name: trimmedName,
        surname: trimmedSurname,
        email: trimmedEmail,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore del server" });
  }
});

router.delete("/:id", checkSuperadmin, async (req, res) => {
  const userId = req.params.id;

  // un superadmin non può eliminare se stesso: rischio di rimanere senza accesso
  if (Number(userId) === req.user.id) {
    return res.status(400).json({ message: "Non puoi eliminare il tuo stesso account." });
  }

  let connection;

  try {
    const [targetRows] = await db.execute("SELECT role, nome, cognome, email FROM user WHERE id = ?", [userId]);
    if (targetRows.length === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    if (targetRows[0].role === "superadmin") {
      const [count] = await db.execute("SELECT COUNT(*) AS total FROM user WHERE role = 'superadmin'");
      if (Number(count[0].total) <= 1) {
        return res.status(400).json({ message: "Non puoi eliminare l'ultimo superadmin del sistema." });
      }
    }

    // il creatore di un progetto non è mai riassegnabile, e il responsabile lo è
    // solo modificando il progetto: eliminare l'utente lascerebbe un riferimento
    // orfano, quindi va riassegnato/gestito prima di poter procedere
    const [ownedProjects] = await db.execute(
      "SELECT COUNT(*) AS total FROM project WHERE created_by = ? OR manager_id = ?",
      [userId, userId],
    );
    if (Number(ownedProjects[0].total) > 0) {
      return res.status(400).json({
        message: "Non puoi eliminare questo utente: è creatore o responsabile di uno o più progetti. Riassegna prima il responsabile di quei progetti.",
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // le task ancora "in lavorazione" tornano disponibili per essere riassegnate;
    // gli stati finali (Completata/Archiviata/Bloccata) restano storicamente coerenti
    await connection.execute(
      "UPDATE checklist_item SET status = 'TODO' WHERE assigned_to = ? AND status = 'In corso'",
      [userId],
    );
    // rimuove ogni riferimento all'utente eliminato dalle task, qualunque fosse lo stato
    await connection.execute(
      "UPDATE checklist_item SET assigned_to = NULL WHERE assigned_to = ?",
      [userId],
    );
    // l'utente sparisce del tutto: nessuno potrà mai più valutare le sue task ancora
    // aperte in queste sessioni, quindi le chiudiamo a prescindere da cosa resta in sospeso
    await connection.execute(
      "UPDATE test_session SET status = 'Completata', completed_at = NOW() WHERE user_id = ? AND status = 'In corso'",
      [userId],
    );
    await connection.execute("DELETE FROM project_assignment WHERE user_id = ?", [userId]);

    const [result] = await connection.execute("DELETE FROM user WHERE id = ?", [userId]);
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Utente non trovato" });
    }

    await connection.commit();

    await logActivity(req.user.id, null, "user.deleted", {
      userId,
      email: targetRows[0].email,
      nome: targetRows[0].nome,
      cognome: targetRows[0].cognome,
    });

    res.status(200).json({ message: "Utente eliminato con successo" });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error(err);
    res.status(500).json({ message: "Errore del server" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.patch("/:id/role", checkSuperadmin, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!["user", "admin", "superadmin"].includes(role)) {
    return res.status(400).json({ message: "Ruolo non valido" });
  }

  // un superadmin non può declassare se stesso: rischio di rimanere senza accesso
  if (Number(userId) === req.user.id && role !== "superadmin") {
    return res.status(400).json({ message: "Non puoi modificare il ruolo del tuo stesso account." });
  }

  try {
    const [targetRows] = await db.execute("SELECT role FROM user WHERE id = ?", [userId]);
    if (targetRows.length === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    if (targetRows[0].role === "superadmin" && role !== "superadmin") {
      const [count] = await db.execute("SELECT COUNT(*) AS total FROM user WHERE role = 'superadmin'");
      if (Number(count[0].total) <= 1) {
        return res.status(400).json({ message: "Non puoi declassare l'ultimo superadmin del sistema." });
      }
    }

    const [result] = await db.execute("UPDATE user SET role = ? WHERE id = ?", [role, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.status(200).json({ message: "Ruolo aggiornato con successo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore del server" });
  }
});

module.exports = router;
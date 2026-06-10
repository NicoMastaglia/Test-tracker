const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkAdmin = require("../middleware/checkAdmin");
const checkUser = require("../middleware/checkUser");
const { hashPassword, comparePassword } = require("../auth/hash");
const db = require("../database/db");

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
        res
          .status(500)
          .json({ message: "Errore del server", specific: err.message });
      });
  } else if (req.user.role == "superadmin") {
    db.execute("SELECT id, nome, cognome, email, role FROM user")
      .then(([rows]) => {
        res.status(200).json(rows);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Errore del server", specific: err.message });
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
      res.status(500).json({ message: "Errore del server", specific: err.message });
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
        name: trimmedNome,
        surname: trimmedCognome,
        email: trimmedEmail,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Errore del server", specific: err.message });
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
    res.status(500).json({ message: "Errore del server", specific: err.message });
  }
});

router.get("/:id", checkAdmin, async (req, res) => {
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
      res.status(500).json({ message: "Errore del server", specific: err.message });
    });
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
    return res.status(500).json({ message: "Errore del server", specific: err.message });
  }
});

router.delete("/:id", checkSuperadmin, async (req, res) => {
  const userId = req.params.id;

  db.execute("DELETE FROM user WHERE id = ?", [userId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
      res.status(200).json({ message: "Utente eliminato con successo" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Errore del server", specific: err.message });
    });
});

router.patch("/:id/role", checkSuperadmin, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!["user", "admin", "superadmin"].includes(role)) {
    return res.status(400).json({ message: "Ruolo non valido" });
  }

  db.execute("UPDATE user SET role = ? WHERE id = ?", [role, userId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
      res.status(200).json({ message: "Ruolo aggiornato con successo" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Errore del server", specific: err.message });
    });
});

router.patch("/:id/password", checkSuperadmin, async (req, res) => {
  const userId = req.params.id;
  const { Newpassword } = req.body;
  try {
    const [rows] = await db.execute("SELECT id FROM user WHERE id = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
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
    res.status(500).json({
      message: "Errore del server",
      specific: err.message,
    });
  }
});

module.exports = router;
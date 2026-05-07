const express = require("express");
const db = require("../database/db");
const { generateAccessToken } = require("../auth/generateToken");

const router = express.Router();

router.post("/register", (req, res) => {
  const { name, surname, email, password, role } = req.body;

  if (!name || !surname || !email || !password || !role) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
  }
  if (
    role.toLowerCase() !== "user" &&
    role.toLowerCase() !== "admin" &&
    role.toLowerCase() !== "superadmin"
  ) {
    return res.status(400).json({ message: "Il ruolo non valido" });
  }

  db.execute(
    "INSERT INTO user (nome, cognome, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
    [name, surname, email, password, role],
  )
    .then(() => {
      res.status(201).json({ message: "Utente registrato con successo" });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Errore del server", specific: err.message });
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email e password sono obbligatori" });
  }

  db.execute("SELECT * FROM user WHERE email = ?", [email])
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

      const user = rows[0];

      if (user.password_hash !== password) {
        return res.status(401).json({ message: "Password non valida" });
      }

      const userWithoutPassword = {
        id: user.id,
        name: user.nome,
        surname: user.cognome,
        email: user.email,
        role: user.role,
      };

      const token = generateAccessToken(userWithoutPassword);
      res.status(200).json({
        message: "Login utente",
        user: userWithoutPassword,
        token: token,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Errore del server", specific: err.message });
    });
});

router.post("/logout", (req, res) => {
  return res.status(200).json({ message: "Logout effettuato con successo" });
});

module.exports = router;

const express = require("express");
const db = require("../database/db");
const { generateAccessToken } = require("../auth/generateToken");
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkUser = require("../middleware/checkUser");
const { hashPassword, comparePassword } = require("../auth/hash");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, surname, email, password, role } = req.body;

  if (!name || !surname || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (
    role.toLowerCase() !== "user" &&
    role.toLowerCase() !== "admin" &&
    role.toLowerCase() !== "superadmin"
  ) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const passwordHash = await hashPassword(password);

  db.execute(
    "INSERT INTO user (nome, cognome, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
    [name, surname, email, passwordHash, role],
  )
    .then(() => {
      res.status(201).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error", specific: err.message });
    });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM user WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
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
      message: "Login successful",
      user: userWithoutPassword,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      specific: err.message,
    });
  }
});

router.post("/logout", checkUser, (req, res) => {
  return res.status(200).json({ message: "Logout successful" });
});

module.exports = router;

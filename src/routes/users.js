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
          .json({ message: "Server error", specific: err.message });
      });
  } else if (req.user.role == "superadmin") {
    db.execute("SELECT id, nome, cognome, email, role FROM user")
      .then(([rows]) => {
        res.status(200).json(rows);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Server error", specific: err.message });
      });
  } else {
    res.status(403).json({ message: "Access denied" });
  }
});

router.get("/me", checkUser, async (req, res) => {
  const userId = req.user.id;
  db.execute("SELECT id, nome, cognome, email, role FROM user WHERE id = ?", [
    userId,
  ])
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(rows[0]);
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error", specific: err.message });
    });
});

router.put("/me", checkUser, async (req, res) => {
  const userId = req.user.id;
  const { nome, cognome, email } = req.body;

  db.execute("UPDATE user SET nome = ?, cognome = ?, email = ? WHERE id = ?", [
    nome,
    cognome,
    email,
    userId,
  ])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "Data updated successfully",
        data: {
          name: nome,
          surname: cognome,
          email: email,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error", specific: err.message });
    });
});

router.patch("/me/password", checkUser, async (req, res) => {
  const userId = req.user.id;
  const { Oldpassword, Newpassword } = req.body;
  try {
    const [rows] = await db.execute(
      "SELECT password_hash FROM user WHERE id = ?",
      [userId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await comparePassword(Oldpassword, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const [result] = await db.execute(
      "UPDATE user SET password_hash = ? WHERE id = ?",
      [await hashPassword(Newpassword), userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      specific: err.message,
    });
  }
});

router.get("/:id", checkAdmin, async (req, res) => {
  const userId = req.params.id;
  db.execute("SELECT id, nome, cognome, email, role FROM user WHERE id = ?", [
    userId,
  ])
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(rows[0]);
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error", specific: err.message });
    });
});

router.put("/:id", checkSuperadmin, async (req, res) => {
  const userId = req.params.id;
  const { name, surname, email } = req.body;

  db.execute("UPDATE user SET nome = ?, cognome = ?, email = ? WHERE id = ?", [
    name,
    surname,
    email,
    userId,
  ])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "Data updated successfully",
        data: {
          name: name,
          surname: surname,
          email: email,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error", specific: err.message });
    });
});

router.delete("/:id", checkSuperadmin, async (req, res) => {
  const userId = req.params.id;

  db.execute("DELETE FROM user WHERE id = ?", [userId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error", specific: err.message });
    });
});

router.patch("/:id/role", checkSuperadmin, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!["user", "admin", "superadmin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  db.execute("UPDATE user SET role = ? WHERE id = ?", [role, userId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "Role updated successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error", specific: err.message });
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
      return res.status(404).json({ message: "User not found" });
    }

    const [result] = await db.execute(
      "UPDATE user SET password_hash = ? WHERE id = ?",
      [await hashPassword(Newpassword), userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      specific: err.message,
    });
  }
});

module.exports = router;

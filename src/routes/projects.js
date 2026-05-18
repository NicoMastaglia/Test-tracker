const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkAdmin = require("../middleware/checkAdmin");
const checkUser = require("../middleware/checkUser");
const db = require("../database/db");

router.get("/", checkUser, (req, res) => {
  if (req.user.role === "superadmin") {
    return db
      .execute("SELECT id, name, description, status, created_by FROM project")
      .then(([results]) => {
        return res.status(200).json(results);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Internal server error", specific: err.message });
      });
  } else if (req.user.role === "admin") {
    return db
      .execute(
        "SELECT id, name, description, status, created_by FROM project WHERE created_by = ?;",
        [req.user.id],
      )
      .then(([results]) => {
        return res.status(200).json(results);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Internal server error", specific: err.message });
      });
  } else if (req.user.role === "user") {
    return db
      .execute(
        "SELECT p.id, p.name, p.description, p.status, p.created_by FROM project p JOIN project_assignment pa ON p.id = pa.project_id WHERE pa.user_id = ?;",
        [req.user.id],
      )
      .then(([results]) => {
        return res.status(200).json(results);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Internal server error", specific: err.message });
      });
  }

  return res.status(403).json({ error: "Forbidden" });
});

router.post("/", checkAdmin, (req, res) => {
  const { name, description } = req.body;
  const createdBy = req.user.id;
  if (!name) {
    return res.status(400).json({ error: "Project name is required" });
  }
  if (!description) {
    return res.status(400).json({ error: "Project description is required" });
  }

  db.execute(
    "INSERT INTO project (name, description, created_by) VALUES (?, ?, ?)",
    [name, description, createdBy],
  )
    .then(([result]) => {
      return res.status(201).json({
        id: result.id,
        name: name,
        description: description,
        status: result.status,
        created_by: createdBy,
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Internal server error", specific: err.message });
    });
});

module.exports = router;

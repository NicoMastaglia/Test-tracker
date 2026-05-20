const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkAdmin = require("../middleware/checkAdmin");
const checkUser = require("../middleware/checkUser");
const db = require("../database/db");
const { route } = require("express/lib/application");

router.post("/", checkAdmin, async (req, res) => {
  const { title, project_id } = req.body;
  const createdBy = req.user.id;

  if (!title) {
    return res.status(400).json({ error: "Titolo obbligatorio" });
  }
  if (!project_id) {
    return res
      .status(400)
      .json({ error: "Progetto di riferimento obbligatorio" });
  }

  try {
    if (req.user.role === "admin") {
      const [results] = await db.execute(
        "SELECT id FROM project WHERE id = ? AND created_by = ?",
        [project_id, createdBy],
      );

      if (results.length === 0) {
        return res
          .status(403)
          .json({ error: "Accesso negato o progetto non trovato" });
      }
    } else if (req.user.role === "superadmin") {
      const [results] = await db.execute(
        "SELECT id FROM project WHERE id = ?",
        [project_id],
      );

      if (results.length === 0) {
        return res.status(404).json({ error: "Progetto non trovato" });
      }
    }

    const [result] = await db.execute(
      "INSERT INTO checklist_template (title, project_id) VALUES (?, ?)",
      [title, project_id],
    );

    if (result.affectedRows === 1) {
      return res.status(201).json({
        message: "Checklist creata con successo",
        checklistId: result.insertId,
      });
    } else {
      return res
        .status(500)
        .json({ error: "Errore durante la creazione della checklist" });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Errore interno del server",
      specific: err.message,
    });
  }
});

router.put("/:id", checkAdmin, async (req, res) => {
  const checklistId = req.params.id;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Titolo obbligatorio" });
  }

  try {
    if (req.user.role === "admin") {
      const [results] = await db.execute(
        "SELECT ct.id FROM checklist_template ct JOIN project p ON ct.project_id = p.id WHERE ct.id = ? AND p.created_by = ?",
        [checklistId, req.user.id],
      );

      if (results.length === 0) {
        return res
          .status(403)
          .json({ error: "Accesso negato o checklist non trovata" });
      }
    }

    const [result] = await db.execute(
      "UPDATE checklist_template SET title = ? WHERE id = ?",
      [title, checklistId],
    );

    if (result.affectedRows === 1) {
      return res
        .status(200)
        .json({ message: "Checklist aggiornata con successo" });
    } else {
      return res.status(404).json({ error: "Checklist non trovata" });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Errore interno del server",
      specific: err.message,
    });
  }
});

router.delete("/:id", checkAdmin, async (req, res) => {
  const checklistId = req.params.id;

  try {
    if (req.user.role === "admin") {
      const [results] = await db.execute(
        "SELECT ct.id FROM checklist_template ct JOIN project p ON ct.project_id = p.id WHERE ct.id = ? AND p.created_by = ?",
        [checklistId, req.user.id],
      );

      if (results.length === 0) {
        return res
          .status(403)
          .json({ error: "Accesso negato o checklist non trovata" });
      }
    }

    const [result] = await db.execute(
      "DELETE FROM checklist_template WHERE id = ?",
      [checklistId],
    );

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Checklist eliminata con successo" });
    } else {
      return res.status(404).json({ error: "Checklist non trovata" });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Errore interno del server",
      specific: err.message,
    });
  }
});

router.get("/:projectId", checkUser, (req, res) => {
  const projectId = req.params.projectId;

  if (req.user.role === "superadmin") {
    return db
      .execute(
        "SELECT * FROM checklist_template ct LEFT JOIN checklist_item ci ON ct.id = ci.template_id WHERE ct.project_id = ?",
        [projectId],
      )
      .then(([results]) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        res.status(500).json({
          error: "Errore interno del server",
          specific: err.message,
        });
      });
  } else if (req.user.role === "admin") {
    return db
      .execute(
        "SELECT * FROM checklist_template ct LEFT JOIN checklist_item ci ON ct.id = ci.template_id JOIN project p ON ct.project_id = p.id WHERE ct.project_id = ? AND p.created_by = ?",
        [projectId, req.user.id],
      )
      .then(([results]) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        res.status(500).json({
          error: "Errore interno del server",
          specific: err.message,
        });
      });
  } else if (req.user.role === "user") {
    return db
      .execute(
        "SELECT * FROM checklist_template ct LEFT JOIN checklist_item ci ON ct.id = ci.template_id JOIN project p ON ct.project_id = p.id JOIN project_assignment pa ON p.id = pa.project_id WHERE ct.project_id = ? AND pa.user_id = ?",
        [projectId, req.user.id],
      )
      .then(([results]) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        res.status(500).json({
          error: "Errore interno del server",
          specific: err.message,
        });
      });
  }

  return res.status(403).json({ error: "Accesso negato" });
});

module.exports = router;

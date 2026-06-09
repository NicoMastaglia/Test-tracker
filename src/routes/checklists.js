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

  const trimmedTitle = title ? title.trim() : "";

  if (!trimmedTitle) {
    return res.status(400).json({ error: "Richiesta non valida", message: "Il titolo della checklist non può essere vuoto." });
  }
  if (!project_id) {
    return res.status(400).json({ error: "Richiesta non valida", message: "Il progetto di riferimento è obbligatorio." });
  }

  try {
    if (req.user.role === "admin") {
      const [results] = await db.execute(
        "SELECT id FROM project WHERE id = ? AND created_by = ?",
        [project_id, createdBy],
      );
      if (results.length === 0) {
        return res.status(403).json({ error: "Accesso negato o progetto non trovato" });
      }
    }

    const [result] = await db.execute(
      "INSERT INTO checklist_template (title, project_id) VALUES (?, ?)",
      [trimmedTitle, project_id],
    );

    res.status(201).json({
      id: result.insertId,
      title: trimmedTitle,
      project_id,
    });
  } catch (err) {
    res.status(500).json({ error: "Errore del server", specific: err.message });
  }
});

router.put("/:id", checkAdmin, async (req, res) => {
  const checklistId = req.params.id;
  const { title } = req.body;

  const trimmedTitle = title ? title.trim() : "";
  if (!trimmedTitle) {
    return res.status(400).json({ error: "Richiesta non valida", message: "Il titolo è obbligatorio e non può essere vuoto." });
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
      [trimmedTitle, checklistId],
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
      error: "Errore del server",
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
      error: "Errore del server",
      specific: err.message,
    });
  }
});

router.get("/:projectId", checkUser, (req, res) => {
  const projectId = req.params.projectId;

  if (req.user.role === "superadmin") {
    return db
      .execute(
        "SELECT ct.id AS checklist_id, ct.title, ct.project_id, ci.id AS item_id, ci.description, ci.position FROM checklist_template ct LEFT JOIN checklist_item ci ON ct.id = ci.template_id WHERE ct.project_id = ? ",
        [projectId],
      )
      .then(([results]) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        res.status(500).json({
          error: "Errore del server",
          specific: err.message,
        });
      });
  } else if (req.user.role === "admin") {
    return db
      .execute(
        "SELECT ct.id AS checklist_id, ct.title, ct.project_id, ci.id AS item_id, ci.description, ci.position FROM checklist_template ct LEFT JOIN checklist_item ci ON ct.id = ci.template_id JOIN project p ON ct.project_id = p.id WHERE ct.project_id = ? AND p.created_by = ?",
        [projectId, req.user.id],
      )
      .then(([results]) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        res.status(500).json({
          error: "Errore del server",
          specific: err.message,
        });
      });
  } else if (req.user.role === "user") {
    return db
      .execute(
        "SELECT ct.id AS checklist_id, ct.title, ct.project_id, ci.id AS item_id, ci.description, ci.position FROM checklist_template ct LEFT JOIN checklist_item ci ON ct.id = ci.template_id JOIN project p ON ct.project_id = p.id JOIN project_assignment pa ON p.id = pa.project_id WHERE ct.project_id = ? AND pa.user_id = ?",
        [projectId, req.user.id],
      )
      .then(([results]) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        res.status(500).json({
          error: "Errore del server",
          specific: err.message,
        });
      });
  }

  return res.status(403).json({ error: "Accesso negato" });
});

router.post("/:templateId/item", checkAdmin, async (req, res) => {
  const templateId = req.params.templateId;
  const { description } = req.body;
    const trimmedDescription = description ? description.trim() : "";

  if (!trimmedDescription) {
    return res.status(400).json({ error: "Richiesta non valida", message: "La descrizione è obbligatoria e non può essere vuota." });
  }

  const [templateResults] = await db.execute(
    "SELECT ct.id FROM checklist_template ct JOIN project p ON ct.project_id = p.id WHERE ct.id = ? AND (p.created_by = ? OR ?)",
    [templateId, req.user.id, req.user.role === "superadmin"],
  );

  if (templateResults.length === 0) {
    return res
      .status(403)
      .json({ error: "Accesso negato o template non trovato" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO checklist_item (template_id, description) VALUES (?, ?)",
      [templateId, trimmedDescription],
    );

    return res.status(201).json({
      message: "Elemento della checklist aggiunto con successo",
      id: result.insertId,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Errore del server",
      specific: err.message,
    });
  }
});

router.put("/item/:id", checkAdmin, async (req, res) => {
  const itemId = req.params.id;
  const { description } = req.body;

  const trimmedDescription = description ? description.trim() : "";

  if (!trimmedDescription) {
    return res.status(400).json({ error: "Richiesta non valida", message: "La nuova descrizione non può essere vuota." });
  }

  try {
    const [result] = await db.execute(
      "UPDATE checklist_item SET description = ? WHERE id = ?",
      [trimmedDescription, itemId],
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Elemento della checklist aggiornato con successo", description: trimmedDescription });
    } else {
      return res.status(404).json({ error: "Elemento della checklist non trovato" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Errore del server", specific: err.message });
  }
});

router.delete("/item/:id", checkAdmin, async (req, res) => {
  const itemId = req.params.id;

  const [itemResults] = await db.execute(
    "SELECT ci.id FROM checklist_item ci JOIN checklist_template ct ON ci.template_id = ct.id JOIN project p ON ct.project_id = p.id WHERE ci.id = ? AND (p.created_by = ? OR ?)",
    [itemId, req.user.id, req.user.role === "superadmin"],
  );

  if (itemResults.length === 0) {
    return res
      .status(403)
      .json({ error: "Accesso negato o elemento della checklist non trovato" });
  }

  try {
    const [result] = await db.execute(
      "DELETE FROM checklist_item WHERE id = ?",
      [itemId],
    );

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Elemento della checklist eliminato con successo" });
    } else {
      return res.status(404).json({ error: "Elemento della checklist non trovato" });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Errore del server",
      specific: err.message,
    });
  }
});

module.exports = router;

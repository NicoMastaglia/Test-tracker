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
    return res.status(400).json({ error: "Title is required" });
  }
  if (!project_id) {
    return res.status(400).json({ error: "Reference project is required" });
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
          .json({ error: "Access denied or project not found" });
      }
    } else if (req.user.role === "superadmin") {
      const [results] = await db.execute(
        "SELECT id FROM project WHERE id = ?",
        [project_id],
      );

      if (results.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }
    }

    const [result] = await db.execute(
      "INSERT INTO checklist_template (title, project_id) VALUES (?, ?)",
      [title, project_id],
    );

    if (result.affectedRows === 1) {
      return res.status(201).json({
        message: "Checklist created successfully",
        checklistId: result.insertId,
      });
    } else {
      return res
        .status(500)
        .json({ error: "Error while creating the checklist" });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      specific: err.message,
    });
  }
});

router.put("/:id", checkAdmin, async (req, res) => {
  const checklistId = req.params.id;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
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
          .json({ error: "Access denied or checklist not found" });
      }
    }

    const [result] = await db.execute(
      "UPDATE checklist_template SET title = ? WHERE id = ?",
      [title, checklistId],
    );

    if (result.affectedRows === 1) {
      return res
        .status(200)
        .json({ message: "Checklist updated successfully" });
    } else {
      return res.status(404).json({ error: "Checklist not found" });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
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
          .json({ error: "Access denied or checklist not found" });
      }
    }

    const [result] = await db.execute(
      "DELETE FROM checklist_template WHERE id = ?",
      [checklistId],
    );

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Checklist deleted successfully" });
    } else {
      return res.status(404).json({ error: "Checklist not found" });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
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
          error: "Server error",
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
          error: "Server error",
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
          error: "Server error",
          specific: err.message,
        });
      });
  }

  return res.status(403).json({ error: "Access denied" });
});

router.post("/:templateId/item", checkAdmin, async (req, res) => {
  const templateId = req.params.templateId;
  const { description } = req.body;
  console.log(templateId, description);

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  const [templateResults] = await db.execute(
    "SELECT ct.id FROM checklist_template ct JOIN project p ON ct.project_id = p.id WHERE ct.id = ? AND (p.created_by = ? OR ?)",
    [templateId, req.user.id, req.user.role === "superadmin"],
  );

  if (templateResults.length === 0) {
    return res
      .status(403)
      .json({ error: "Access denied or template not found" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO checklist_item (template_id, description) VALUES (?, ?)",
      [templateId, description],
    );

    return res.status(201).json({
      message: "Checklist item added successfully",
      id: result.insertId,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      specific: err.message,
    });
  }
});

router.put("/item/:id", checkAdmin, async (req, res) => {
  const itemId = req.params.id;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  const [itemResults] = await db.execute(
    "SELECT ci.id FROM checklist_item ci JOIN checklist_template ct ON ci.template_id = ct.id JOIN project p ON ct.project_id = p.id WHERE ci.id = ? AND (p.created_by = ? OR ?)",
    [itemId, req.user.id, req.user.role === "superadmin"],
  );

  if (itemResults.length === 0) {
    return res
      .status(403)
      .json({ error: "Access denied or checklist item not found" });
  }

  try {
    const [result] = await db.execute(
      "UPDATE checklist_item SET description = ? WHERE id = ?",
      [description, itemId],
    );

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Checklist item updated successfully" });
    } else {
      return res.status(404).json({ error: "Checklist item not found" });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      specific: err.message,
    });
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
      .json({ error: "Access denied or checklist item not found" });
  }

  try {
    const [result] = await db.execute(
      "DELETE FROM checklist_item WHERE id = ?",
      [itemId],
    );

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Checklist item deleted successfully" });
    } else {
      return res.status(404).json({ error: "Checklist item not found" });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      specific: err.message,
    });
  }
});

module.exports = router;

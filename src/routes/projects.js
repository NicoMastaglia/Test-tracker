const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkAdmin = require("../middleware/checkAdmin");
const checkUser = require("../middleware/checkUser");
const db = require("../database/db");
const { route } = require("express/lib/application");

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

router.get("/:id", checkUser, (req, res) => {
  const projectId = req.params.id;

  if (req.user.role === "superadmin") {
    return db
      .execute(
        "SELECT id, name, description, status, created_by FROM project WHERE id = ?;",
        [projectId],
      )
      .then(([results]) => {
        if (results.length === 0) {
          return res.status(404).json({ error: "Project not found" });
        }
        return res.status(200).json(results[0]);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Internal server error", specific: err.message });
      });
  } else if (req.user.role === "admin") {
    return db
      .execute(
        "SELECT id, name, description, status, created_by FROM project WHERE id = ? AND created_by = ?;",
        [projectId, req.user.id],
      )
      .then(([results]) => {
        if (results.length === 0) {
          return res.status(404).json({ error: "Project not found" });
        }
        return res.status(200).json(results[0]);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Internal server error", specific: err.message });
      });
  } else if (req.user.role === "user") {
    return db
      .execute(
        "SELECT p.id, p.name, p.description, p.status, p.created_by FROM project p JOIN project_assignment pa ON p.id = pa.project_id WHERE p.id = ? AND pa.user_id = ?;",
        [projectId, req.user.id],
      )
      .then(([results]) => {
        if (results.length === 0) {
          return res.status(404).json({ error: "Project not found" });
        }
        return res.status(200).json(results[0]);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Internal server error", specific: err.message });
      });
  }

  return res.status(403).json({ error: "Forbidden" });
});

router.put("/:id", checkAdmin, (req, res) => {
  const projectId = req.params.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Project name is required" });
  }
  if (!description) {
    return res.status(400).json({ error: "Project description is required" });
  }

  db.execute(
    "UPDATE project SET name = ?, description = ? WHERE id = ? AND created_by = ?",
    [name, description, projectId, req.user.id],
  )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Project not found" });
      }
      return res.status(200).json({ message: "Project updated successfully" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Internal server error", specific: err.message });
    });
});

router.patch("/:id/status", checkAdmin, (req, res) => {
  const projectId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Project status is required" });
  }
  if (status !== "Attivo" && status !== "Completato" && status !== "In pausa") {
    return res.status(400).json({ error: "Invalid project status" });
  }

  db.execute("UPDATE project SET status = ? WHERE id = ? AND created_by = ?", [
    status,
    projectId,
    req.user.id,
  ])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Project not found" });
      }
      return res
        .status(200)
        .json({ message: "Project status updated successfully" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Internal server error", specific: err.message });
    });
});

router.post("/:id/assign", checkAdmin, (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  db.execute(
    "INSERT INTO project_assignment (project_id, user_id) VALUES (?, ?)",
    [projectId, userId],
  )
    .then(([result]) => {
      return res
        .status(200)
        .json({ message: "User assigned to project successfully" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Internal server error", specific: err.message });
    });
});

router.get("/:id/assign", checkAdmin, (req, res) => {
  const projectId = req.params.id;

  db.execute(
    "SELECT u.id, u.nome, u.email FROM user u JOIN project_assignment pa ON u.id = pa.user_id WHERE pa.project_id = ?",
    [projectId],
  )
    .then(([results]) => {
      return res.status(200).json(results);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Internal server error", specific: err.message });
    });
});

router.delete("/:id/assign", checkAdmin, (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  db.execute(
    "DELETE FROM project_assignment WHERE project_id = ? AND user_id = ?",
    [projectId, userId],
  )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      return res
        .status(200)
        .json({ message: "User unassigned from project successfully" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Internal server error", specific: err.message });
    });
});

router.delete("/:id", checkSuperadmin, (req, res) => {
  const projectId = req.params.id;

  db.execute("DELETE FROM project WHERE id = ?", [projectId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Project not found" });
      }
      return res.status(200).json({ message: "Project deleted successfully" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Internal server error", specific: err.message });
    });
});

module.exports = router;

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
      .execute(
        `SELECT 
        p.id, p.name, p.description, p.status, p.created_by,
        u.nome AS creator_nome, u.cognome AS creator_cognome, u.email AS creator_email,
        tu.id AS tester_id, tu.nome AS tester_nome, tu.cognome AS tester_cognome, tu.email AS tester_email
       FROM project p
       JOIN user u ON p.created_by = u.id
       LEFT JOIN project_assignment pa ON p.id = pa.project_id
       LEFT JOIN user tu ON pa.user_id = tu.id`,
      )
      .then(([results]) => {
        const projectMap = new Map();

        results.forEach((row) => {
          if (!projectMap.has(row.id)) {
            projectMap.set(row.id, {
              id: row.id,
              name: row.name,
              description: row.description,
              status: row.status,
              created_by: {
                id: row.created_by,
                nome: row.creator_nome,
                cognome: row.creator_cognome,
                email: row.creator_email,
              },
              user_list: [],
            });
          }

          if (row.tester_id) {
            projectMap.get(row.id).user_list.push({
              id: row.tester_id,
              nome: row.tester_nome,
              cognome: row.tester_cognome,
              email: row.tester_email,
            });
          }
        });

        const projects = Array.from(projectMap.values());
        return res.status(200).json(projects);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Errore del server", specific: err.message });
      });
  } else if (req.user.role === "admin") {
    return db
      .execute(
        `SELECT 
        p.id, p.name, p.description, p.status, p.created_by,
        u.nome AS creator_nome, u.cognome AS creator_cognome, u.email AS creator_email,
        tu.id AS tester_id, tu.nome AS tester_nome, tu.cognome AS tester_cognome, tu.email AS tester_email
       FROM project p
       JOIN user u ON p.created_by = u.id
       LEFT JOIN project_assignment pa ON p.id = pa.project_id
       LEFT JOIN user tu ON pa.user_id = tu.id
       WHERE p.created_by = ?`,
        [req.user.id],
      )
      .then(([results]) => {
        const projectMap = new Map();

        results.forEach((row) => {
          if (!projectMap.has(row.id)) {
            projectMap.set(row.id, {
              id: row.id,
              name: row.name,
              description: row.description,
              status: row.status,
              created_by: {
                id: row.created_by,
                nome: row.creator_nome,
                cognome: row.creator_cognome,
                email: row.creator_email,
              },
              user_list: [],
            });
          }

          if (row.tester_id) {
            projectMap.get(row.id).user_list.push({
              id: row.tester_id,
              nome: row.tester_nome,
              cognome: row.tester_cognome,
              email: row.tester_email,
            });
          }
        });

        const projects = Array.from(projectMap.values());
        return res.status(200).json(projects);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Errore del server", specific: err.message });
      });
  } else if (req.user.role === "user") {
    return db
      .execute(
        "SELECT p.id, p.name, p.description, p.status, p.created_by, u.nome, u.cognome, u.email FROM project p JOIN project_assignment pa ON p.id = pa.project_id JOIN user u ON p.created_by = u.id WHERE pa.user_id = ?;",
        [req.user.id],
      )
      .then(([results]) => {
        const projects = results.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          status: row.status,
          created_by: {
            id: row.created_by,
            nome: row.nome,
            cognome: row.cognome,
            email: row.email,
          },
        }));

        return res.status(200).json(projects);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Errore del server", specific: err.message });
      });
  }

  return res.status(403).json({ error: "Accesso negato" });
});

router.post("/", checkAdmin, async (req, res) => {
  const { name, description } = req.body;
  const createdBy = req.user.id;

  const trimmedName = name ? name.trim() : "";
  const trimmedDescription = description ? description.trim() : "";

  if (!trimmedName) {
    return res.status(400).json({ error: "Richiesta non valida", message: "Il nome del progetto non può essere vuoto o contenere solo spazi." });
  }
  if (!trimmedDescription) {
    return res.status(400).json({ error: "Richiesta non valida", message: "La descrizione del progetto non può essere vuota o contenere solo spazi." });
  }

  try {
    const [existingProject] = await db.execute(
      "SELECT id FROM project WHERE name = ?",
      [trimmedName]
    );

    if (existingProject.length > 0) {
      return res.status(400).json({ 
        error: "Richiesta non valida", 
        message: "Un progetto con questo nome esiste già. Scegli un nome univoco." 
      });
    }

    const [result] = await db.execute(
      "INSERT INTO project (name, description, created_by) VALUES (?, ?, ?)",
      [trimmedName, trimmedDescription, createdBy]
    );

    return res.status(201).json({
      id: result.insertId,
      name: trimmedName,
      description: trimmedDescription,
      status: "Attivo",
      created_by: createdBy,
    });

  } catch (err) {
    return res.status(500).json({ error: "Errore del server", specific: err.message });
  }
});

router.get("/:id", checkUser, (req, res) => {
  const projectId = req.params.id;

  if (req.user.role === "superadmin") {
    return db
      .execute(
        `SELECT 
        p.id, p.name, p.description, p.status, p.created_by,
        u.nome AS creator_nome, u.cognome AS creator_cognome, u.email AS creator_email,
        tu.id AS tester_id, tu.nome AS tester_nome, tu.cognome AS tester_cognome, tu.email AS tester_email
       FROM project p
       JOIN user u ON p.created_by = u.id
       LEFT JOIN project_assignment pa ON p.id = pa.project_id
       LEFT JOIN user tu ON pa.user_id = tu.id
       WHERE p.id = ?`,
        [projectId],
      )
      .then(([results]) => {
        const projectMap = new Map();

        results.forEach((row) => {
          if (!projectMap.has(row.id)) {
            projectMap.set(row.id, {
              id: row.id,
              name: row.name,
              description: row.description,
              status: row.status,
              created_by: {
                id: row.created_by,
                nome: row.creator_nome,
                cognome: row.creator_cognome,
                email: row.creator_email,
              },
              user_list: [],
            });
          }

          if (row.tester_id) {
            projectMap.get(row.id).user_list.push({
              id: row.tester_id,
              nome: row.tester_nome,
              cognome: row.tester_cognome,
              email: row.tester_email,
            });
          }
        });

        const projects = Array.from(projectMap.values());
        return res.status(200).json(projects[0]);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Errore del server", specific: err.message });
      });
  } else if (req.user.role === "admin") {
    return db
      .execute(
        `SELECT 
        p.id, p.name, p.description, p.status, p.created_by,
        u.nome AS creator_nome, u.cognome AS creator_cognome, u.email AS creator_email,
        tu.id AS tester_id, tu.nome AS tester_nome, tu.cognome AS tester_cognome, tu.email AS tester_email
       FROM project p
       JOIN user u ON p.created_by = u.id
       LEFT JOIN project_assignment pa ON p.id = pa.project_id
       LEFT JOIN user tu ON pa.user_id = tu.id
       WHERE p.id = ? AND p.created_by = ?`,
        [projectId, req.user.id],
      )
      .then(([results]) => {
        const projectMap = new Map();

        results.forEach((row) => {
          if (!projectMap.has(row.id)) {
            projectMap.set(row.id, {
              id: row.id,
              name: row.name,
              description: row.description,
              status: row.status,
              created_by: {
                id: row.created_by,
                nome: row.creator_nome,
                cognome: row.creator_cognome,
                email: row.creator_email,
              },
              user_list: [],
            });
          }

          if (row.tester_id) {
            projectMap.get(row.id).user_list.push({
              id: row.tester_id,
              nome: row.tester_nome,
              cognome: row.tester_cognome,
              email: row.tester_email,
            });
          }
        });

        const projects = Array.from(projectMap.values());
        return res.status(200).json(projects[0]);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Errore del server", specific: err.message });
      });
  } else if (req.user.role === "user") {
    return db
      .execute(
        `SELECT 
        p.id, p.name, p.description, p.status, p.created_by,
        u.nome AS creator_nome, u.cognome AS creator_cognome, u.email AS creator_email
       FROM project p
       JOIN user u ON p.created_by = u.id
       JOIN project_assignment pa ON p.id = pa.project_id
       WHERE p.id = ? AND pa.user_id = ?`,
        [projectId, req.user.id],
      )
      .then(([results]) => {
        if (results.length === 0) {
          return res.status(404).json({ error: "Progetto non trovato" });
        }
        const project = {
          id: results[0].id,
          name: results[0].name,
          description: results[0].description,
          status: results[0].status,
          created_by: {
            id: results[0].created_by,
            nome: results[0].creator_nome,
            cognome: results[0].creator_cognome,
            email: results[0].creator_email,
          },
        };
        return res.status(200).json(project);
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Errore del server", specific: err.message });
      });
  }

  return res.status(403).json({ error: "Accesso negato" });
});

router.put("/:id", checkAdmin, async (req, res) => {
  const projectId = req.params.id;
  const { name, description } = req.body;

  const trimmedName = name ? name.trim() : "";
  const trimmedDescription = description ? description.trim() : "";

  if (!trimmedName) {
    return res.status(400).json({ 
      message: "Errore nella richiesta", 
      specific: "Il nome del progetto è obbligatorio e non può essere vuoto." 
    });
  }
  if (!trimmedDescription) {
    return res.status(400).json({ 
      message: "Errore nella richiesta", 
      specific: "La descrizione del progetto è obbligatoria e non può essere vuota." 
    });
  }

  try {
    const [existingProject] = await db.execute(
      "SELECT id FROM project WHERE name = ? AND id != ?",
      [trimmedName, projectId]
    );

    if (existingProject.length > 0) {
      return res.status(400).json({ 
        message: "Errore nella richiesta", 
        specific: "Un progetto con questo nome esiste già. Scegli un nome univoco." 
      });
    }
    const [result] = await db.execute(
      "UPDATE project SET name = ?, description = ? WHERE id = ? AND created_by = ?",
      [trimmedName, trimmedDescription, projectId, req.user.id],
      
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Errore nella richiesta", 
        specific: "Progetto non trovato o permessi insufficienti." 
      });
    }

    return res.status(200).json({ message: "Progetto aggiornato con successo" });

  } catch (err) {
    return res.status(500).json({ 
      message: "Errore del server", 
      specific: err.message 
    });
  }
});

router.patch("/:id/status", checkAdmin, (req, res) => {
  const projectId = req.params.id;
  const { status } = req.body;

  const trimmedStatus = status ? status.trim() : "";

  if (!trimmedStatus) {
    return res.status(400).json({ error: "Richiesta non valida", message: "Lo stato non può essere vuoto." });
  }

  db.execute("UPDATE project SET status = ? WHERE id = ?", [trimmedStatus, projectId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Progetto non trovato" });
      }
      return res.status(200).json({ message: "Stato del progetto aggiornato con successo", status: trimmedStatus });
    })
    .catch((err) => {
      return res.status(500).json({ error: "Errore del server", specific: err.message });
    });
});

router.post("/:id/assign", checkAdmin, (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Richiesta non valida", message: "L'ID utente è obbligatorio" });
  }

  db.execute(
    "INSERT INTO project_assignment (project_id, user_id) VALUES (?, ?)",
    [projectId, userId],
  )
    .then(([result]) => {
      return res
        .status(200)
        .json({ message: "Utente assegnato al progetto con successo" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Errore del server", specific: err.message });
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
        .json({ error: "Errore del server", specific: err.message });
    });
});

router.delete("/:id/assign", checkAdmin, (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Richiesta non valida", message: "L'ID utente è obbligatorio" });
  }

  db.execute(
    "DELETE FROM project_assignment WHERE project_id = ? AND user_id = ?",
    [projectId, userId],
  )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Assegnazione non trovata" });
      }
      return res
        .status(200)
        .json({ message: "Assegnazione utente rimossa con successo" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Errore del server", specific: err.message });
    });
});

router.delete("/:id", checkSuperadmin, (req, res) => {
  const projectId = req.params.id;

  db.execute("DELETE FROM project WHERE id = ?", [projectId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Progetto non trovato" });
      }
      return res.status(200).json({ message: "Progetto eliminato con successo" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Errore del server", specific: err.message });
    });
});

module.exports = router;
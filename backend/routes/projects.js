const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkAdmin = require("../middleware/checkAdmin");
const checkUser = require("../middleware/checkUser");
const db = require("../database/db");
const logActivity = require("../utils/logActivity");
const { sendProjectEmail } = require("../utils/sendEmail");



router.get("/", checkUser, (req, res) => {
  if (req.user.role === "superadmin") {
    return db
      .execute(
        `SELECT 
        p.id, p.name, p.description, p.status, p.created_by, p.manager_id,
        p.created_at, p.updated_at, p.started_at, p.deadline, p.completed_at,
        u.nome AS creator_nome, u.cognome AS creator_cognome, u.email AS creator_email,
        mu.nome AS manager_nome, mu.cognome AS manager_cognome, mu.email AS manager_email,
        tu.id AS tester_id, tu.nome AS tester_nome, tu.cognome AS tester_cognome, tu.email AS tester_email
       FROM project p
       JOIN user u ON p.created_by = u.id
       LEFT JOIN user mu ON p.manager_id = mu.id
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
              created_at: row.created_at,
              updated_at: row.updated_at,
              started_at: row.started_at,
              deadline: row.deadline,
              completed_at: row.completed_at,
              created_by: {
                id: row.created_by,
                nome: row.creator_nome,
                cognome: row.creator_cognome,
                email: row.creator_email,
              },
              manager: row.manager_id ? {
                id: row.manager_id,
                nome: row.manager_nome,
                cognome: row.manager_cognome,
                email: row.manager_email
              } : null,
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
        console.error(err);
        return res.status(500).json({ error: "Errore del server" });
      });
  } else if (req.user.role === "admin") {
    return db
      .execute(
        `SELECT 
        p.id, p.name, p.description, p.status, p.created_by, p.manager_id,
        p.created_at, p.updated_at, p.started_at, p.deadline, p.completed_at,
        u.nome AS creator_nome, u.cognome AS creator_cognome, u.email AS creator_email,
        mu.nome AS manager_nome, mu.cognome AS manager_cognome, mu.email AS manager_email,
        tu.id AS tester_id, tu.nome AS tester_nome, tu.cognome AS tester_cognome, tu.email AS tester_email
       FROM project p
       JOIN user u ON p.created_by = u.id
       LEFT JOIN user mu ON p.manager_id = mu.id
       LEFT JOIN project_assignment pa ON p.id = pa.project_id
       LEFT JOIN user tu ON pa.user_id = tu.id
       WHERE p.created_by = ? OR p.manager_id = ?`,
        [req.user.id, req.user.id],
       
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
              created_at: row.created_at,
              updated_at: row.updated_at,
              started_at: row.started_at,
              deadline: row.deadline,
              completed_at: row.completed_at,
              created_by: {
                id: row.created_by,
                nome: row.creator_nome,
                cognome: row.creator_cognome,
                email: row.creator_email,
              },
              manager: row.manager_id ? {
                id: row.manager_id,
                nome: row.manager_nome,
                cognome: row.manager_cognome,
                email: row.manager_email
              } : null,
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
        console.error(err);
        return res.status(500).json({ error: "Errore del server" });
      });
  } else if (req.user.role === "user") {
    return db
      .execute(
        `SELECT p.id, p.name, p.description, p.status, p.created_by, p.manager_id, 
        p.created_at, p.updated_at, p.started_at, p.deadline, p.completed_at,
        u.nome AS creator_nome, u.cognome AS creator_cognome, u.email AS creator_email,
        mu.nome AS manager_nome, mu.cognome AS manager_cognome, mu.email AS manager_email
        FROM project p 
        JOIN project_assignment pa ON p.id = pa.project_id 
        JOIN user u ON p.created_by = u.id 
        LEFT JOIN user mu ON p.manager_id = mu.id
        WHERE pa.user_id = ?;`,
        [req.user.id],
      )
      .then(([results]) => {
        const projects = results.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          status: row.status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          started_at: row.started_at,
          deadline: row.deadline,
          completed_at: row.completed_at,
          created_by: {
            id: row.created_by,
            nome: row.creator_nome,
            cognome: row.creator_cognome,
            email: row.creator_email,
          },
          manager: row.manager_id ? {
            id: row.manager_id,
            nome: row.manager_nome,
            cognome: row.manager_cognome,
            email: row.manager_email
          } : null,
        }));

        return res.status(200).json(projects);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "Errore del server" });
      });
  }

  return res.status(403).json({ error: "Accesso negato" });
});

router.post("/", checkAdmin, async (req, res) => {
  const { name, description, manager_id, deadline } = req.body;
  const createdBy = req.user.id;

  const trimmedName = name ? name.trim() : "";
  const trimmedDescription = description ? description.trim() : "";
  const finalDeadline = deadline ? deadline : null;

  if (!trimmedName) {
    return res.status(400).json({ error: "Richiesta non valida", message: "Il nome del progetto non può essere vuoto o contenere solo spazi." });
  }
  if (!trimmedDescription) {
    return res.status(400).json({ error: "Richiesta non valida", message: "La descrizione del progetto non può essere vuota o contenere solo spazi." });
  }

  try {
    let finalManagerId;
    if (req.user.role === "admin") {
      finalManagerId = req.user.id;
    } else if (req.user.role === "superadmin") {
      finalManagerId = manager_id;
      if (!finalManagerId) {
        return res.status(400).json({ error: "Richiesta non valida", message: "Seleziona un responsabile (admin)." });
      }
      const [managerResult] = await db.execute(
        "SELECT id FROM user WHERE id = ? AND role = 'admin'",
        [finalManagerId]
      );
      if (!managerResult.length) {
        return res.status(400).json({ error: "Richiesta non valida", message: "Il responsabile deve essere un admin esistente." });
      }
    }

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
      "INSERT INTO project (name, description, created_by, manager_id, deadline) VALUES (?, ?, ?, ?, ?)",
      [trimmedName, trimmedDescription, createdBy, finalManagerId, finalDeadline]
    );
  
   

   await  logActivity(req.user.id,result.insertId,"project.created",{name : trimmedName})

    
    return res.status(201).json({
      id: result.insertId,
      name: trimmedName,
      description: trimmedDescription,
      status: "Non iniziato",
      created_by: createdBy,
      manager_id: finalManagerId,
      deadline: finalDeadline
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.get("/:id", checkUser, (req, res) => {
  const projectId = req.params.id;

  if (req.user.role === "superadmin") {
    return db
      .execute(
        `SELECT 
        p.id, p.name, p.description, p.status, p.created_by, p.manager_id,
        p.created_at, p.updated_at, p.started_at, p.deadline, p.completed_at,
        u.nome AS creator_nome, u.cognome AS creator_cognome, u.email AS creator_email,
        mu.nome AS manager_nome, mu.cognome AS manager_cognome, mu.email AS manager_email,
        tu.id AS tester_id, tu.nome AS tester_nome, tu.cognome AS tester_cognome, tu.email AS tester_email
       FROM project p
       JOIN user u ON p.created_by = u.id
       LEFT JOIN user mu ON p.manager_id = mu.id
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
              created_at: row.created_at,
              updated_at: row.updated_at,
              started_at: row.started_at,
              deadline: row.deadline,
              completed_at: row.completed_at,
              created_by: {
                id: row.created_by,
                nome: row.creator_nome,
                cognome: row.creator_cognome,
                email: row.creator_email,
              },
              manager: row.manager_id ? {
                id: row.manager_id,
                nome: row.manager_nome,
                cognome: row.manager_cognome,
                email: row.manager_email
              } : null,
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
        if (projects.length === 0) {
          return res.status(404).json({ error: "Progetto non trovato" });
        }
        return res.status(200).json(projects[0]);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "Errore del server" });
      });
  } else if (req.user.role === "admin") {
    return db
      .execute(
        `SELECT 
        p.id, p.name, p.description, p.status, p.created_by, p.manager_id,
        p.created_at, p.updated_at, p.started_at, p.deadline, p.completed_at,
        u.nome AS creator_nome, u.cognome AS creator_cognome, u.email AS creator_email,
        mu.nome AS manager_nome, mu.cognome AS manager_cognome, mu.email AS manager_email,
        tu.id AS tester_id, tu.nome AS tester_nome, tu.cognome AS tester_cognome, tu.email AS tester_email
       FROM project p
       JOIN user u ON p.created_by = u.id
       LEFT JOIN user mu ON p.manager_id = mu.id
       LEFT JOIN project_assignment pa ON p.id = pa.project_id
       LEFT JOIN user tu ON pa.user_id = tu.id
       WHERE p.id = ? AND (p.created_by = ? OR p.manager_id = ?)`,
        [projectId, req.user.id, req.user.id],
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
              created_at: row.created_at,
              updated_at: row.updated_at,
              started_at: row.started_at,
              deadline: row.deadline,
              completed_at: row.completed_at,
              created_by: {
                id: row.created_by,
                nome: row.creator_nome,
                cognome: row.creator_cognome,
                email: row.creator_email,
              },
              manager: row.manager_id ? {
                id: row.manager_id,
                nome: row.manager_nome,
                cognome: row.manager_cognome,
                email: row.manager_email
              } : null,
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
        if (projects.length === 0) {
          return res.status(404).json({ error: "Progetto non trovato" });
        }
        return res.status(200).json(projects[0]);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "Errore del server" });
      });
  } else if (req.user.role === "user") {
    return db
      .execute(
        `SELECT 
        p.id, p.name, p.description, p.status, p.created_by, p.manager_id,
        p.created_at, p.updated_at, p.started_at, p.deadline, p.completed_at,
        u.nome AS creator_nome, u.cognome AS creator_cognome, u.email AS creator_email,
        mu.nome AS manager_nome, mu.cognome AS manager_cognome, mu.email AS manager_email
       FROM project p
       JOIN user u ON p.created_by = u.id
       LEFT JOIN user mu ON p.manager_id = mu.id
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
          created_at: results[0].created_at,
          updated_at: results[0].updated_at,
          started_at: results[0].started_at,
          deadline: results[0].deadline,
          completed_at: results[0].completed_at,
          created_by: {
            id: results[0].created_by,
            nome: results[0].creator_nome,
            cognome: results[0].creator_cognome,
            email: results[0].creator_email,
          },
          manager: results[0].manager_id ? {
            id: results[0].manager_id,
            nome: results[0].manager_nome,
            cognome: results[0].manager_cognome,
            email: results[0].manager_email
          } : null,
        };
        return res.status(200).json(project);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "Errore del server" });
      });
  }

  return res.status(403).json({ error: "Accesso negato" });
});

router.put("/:id", checkAdmin, async (req, res) => {
  const projectId = req.params.id;
  const { name, description, manager_id, deadline } = req.body;

  const trimmedName = name ? name.trim() : "";
  const trimmedDescription = description ? description.trim() : "";
  const finalDeadline = deadline ? deadline : null;

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
    let updateQuery = "UPDATE project SET name = ?, description = ?, deadline = ?, updated_at = NOW()";
    let queryParams = [trimmedName, trimmedDescription, finalDeadline];

    if (req.user.role === "superadmin") {
      if (manager_id) {
        const [m] = await db.execute("SELECT id FROM user WHERE id = ? AND role = 'admin'", [manager_id]);
        if (!m.length) {
          return res.status(400).json({ message: "Errore nella richiesta", specific: "Il responsabile deve essere un admin esistente." });
        }
        updateQuery += ", manager_id = ?";
        queryParams.push(manager_id);
      }
      updateQuery += " WHERE id = ?";
      queryParams.push(projectId);
    } else {
      updateQuery += " WHERE id = ? AND (created_by = ? OR manager_id = ?)";
      queryParams.push(projectId, req.user.id, req.user.id);
    }
    const [result] = await db.execute(updateQuery, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Errore nella richiesta", 
        specific: "Progetto non trovato o permessi insufficienti." 
      });
    }
    
    await logActivity(req.user.id,projectId,"project.updated",{name : trimmedName })
    return res.status(200).json({ message: "Progetto aggiornato con successo" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Errore del server" });
  }
});

router.patch("/:id/status", checkAdmin, async (req, res) => {
  const projectId = req.params.id;
  const { status } = req.body;

  const trimmedStatus = status ? status.trim() : "";

  if (!trimmedStatus) {
    return res.status(400).json({ error: "Richiesta non valida", message: "Lo stato non può essere vuoto." });
  }

  const ALLOWED = {
    "Non iniziato": ["Attivo"],
    "Attivo": ["Completato", "In pausa"],
    "In pausa": ["Attivo"],
    "Completato": []
  };

  try {
    const [rows] = await db.execute("SELECT status, created_by, manager_id FROM project WHERE id = ?", [projectId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Progetto non trovato" });
    }
    // admin può agire solo sui progetti creati da lui o di cui è responsabile; superadmin su tutti
    if (req.user.role !== "superadmin" &&
        rows[0].created_by !== req.user.id && rows[0].manager_id !== req.user.id) {
      return res.status(403).json({ error: "Permessi insufficienti" });
    }
    const currentStatus = rows[0].status;
    if (!ALLOWED[currentStatus] || !ALLOWED[currentStatus].includes(trimmedStatus)) {
      return res.status(400).json({
        error: "Transizione di stato non consentita",
        message: `Non puoi passare da "${currentStatus}" a "${trimmedStatus}".`
      });
    }
    let result;
    if (trimmedStatus === "Attivo") {
      [result] = await db.execute(
        "UPDATE project SET status = ?, started_at = IFNULL(started_at, NOW()), updated_at = NOW() WHERE id = ?",
        [trimmedStatus, projectId]
      );
    } else if (trimmedStatus === "Completato") {
      [result] = await db.execute(
        "UPDATE project SET status = ?, completed_at = NOW(), updated_at = NOW() WHERE id = ?",
        [trimmedStatus, projectId]
      );
    } else {
      [result] = await db.execute(
        "UPDATE project SET status = ?, updated_at = NOW() WHERE id = ?",
        [trimmedStatus, projectId]
      );
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Progetto non trovato" });
    }
    await logActivity(req.user.id, projectId, "project.status_changed", { from: currentStatus, to: trimmedStatus });
    return res.status(200).json({ message: "Stato del progetto aggiornato con successo", status: trimmedStatus });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.post("/:id/assign", checkAdmin, async (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Richiesta non valida", message: "L'ID utente è obbligatorio" });
  }

  try {
    const [proj] = await db.execute("SELECT created_by, manager_id, name, status FROM project WHERE id = ?", [projectId]);
    if (!proj.length) {
      return res.status(404).json({ error: "Progetto non trovato" });
    }

    if (req.user.role !== "superadmin" &&
        proj[0].created_by !== req.user.id && proj[0].manager_id !== req.user.id) {
      return res.status(403).json({ error: "Permessi insufficienti" });
    }

    if (proj[0].status === "Completato") {
      return res.status(400).json({ error: "Progetto completato: non è possibile modificare il team." });
    }

    const projectAssignment = proj[0].name;

    // 1. Verifica l'utente prima di scrivere: deve esistere ed essere un tester
    const [user] = await db.execute("SELECT nome, cognome, email, role FROM user WHERE id = ?", [userId]);
    if (!user.length) {
      return res.status(404).json({ error: "Utente non trovato" });
    }
    if (user[0].role !== "user") {
      return res.status(400).json({ error: "Richiesta non valida", message: "Puoi assegnare al progetto solo utenti con ruolo tester." });
    }

    const [existingAssignment] = await db.execute(
      "SELECT project_id FROM project_assignment WHERE project_id = ? AND user_id = ?",
      [projectId, userId],
    );
    if (existingAssignment.length > 0) {
      return res.status(400).json({ error: "Richiesta non valida", message: "L'utente è già assegnato a questo progetto." });
    }

    // 2. Assegna il progetto nel DB
    await db.execute("INSERT INTO project_assignment (project_id, user_id) VALUES (?, ?)", [projectId, userId]);

    await db.execute("UPDATE project SET updated_at = NOW() WHERE id = ?", [projectId]);
    await logActivity(req.user.id, projectId, "project.member_assigned", { userId: userId });

    // 3. INVIA L'EMAIL SPECIFICA USANDO LE OPTIONS (Senza bisogno del token!)
    await sendProjectEmail(
      { nome: user[0].nome, email: user[0].email }, 
      'projectAssignment', 
      { 
        projectName: projectAssignment,
        subject: `Sei stato assegnato al progetto ${projectAssignment}`
      }
    );

    return res.status(200).json({ message: "Utente assegnato al progetto con successo" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.get("/:id/assign", checkAdmin, async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  if(userRole !== "superadmin" && userRole !== "admin") {
    return res.status(403).json({ error: "Accesso negato" });
  }
  

  try {
  const [result] = await db.execute(
    `

    SELECT p.id FROM project p WHERE p.id = ? AND (p.created_by = ? OR p.manager_id = ? OR ?)`,
[projectId, userId, userId,req.user.role === "superadmin"]

  )

  if(result.length === 0) {
    return res.status(403).json({ error: "Permessi insufficienti" });


 
  }

   const [assignments] = await db.execute(
    ` select u.id,u.nome,u.cognome
from project p 
join project_assignment pa 
ON pa.project_id = p.id 
join user u 
on u.id = pa.user_id
where p.id = ? 

`,[projectId]

   )

   return res.status(200).json(assignments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
  


});

router.delete("/:id/assign", checkAdmin, async (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Richiesta non valida", message: "L'ID utente è obbligatorio" });
  }

  try {
    const [proj] = await db.execute("SELECT created_by, manager_id, status FROM project WHERE id = ?", [projectId]);
    if (!proj.length) {
      return res.status(404).json({ error: "Progetto non trovato" });
    }
    // admin solo sui progetti creati da lui o di cui è responsabile; superadmin su tutti
    if (req.user.role !== "superadmin" &&
        proj[0].created_by !== req.user.id && proj[0].manager_id !== req.user.id) {
      return res.status(403).json({ error: "Permessi insufficienti" });
    }

    if (proj[0].status === "Completato") {
      return res.status(400).json({ error: "Progetto completato: non è possibile modificare il team." });
    }

    const [result] = await db.execute(
      "DELETE FROM project_assignment WHERE project_id = ? AND user_id = ?",
      [projectId, userId],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Assegnazione non trovata" });
    }
    await db.execute("UPDATE project SET updated_at = NOW() WHERE id = ?", [projectId]);
    await logActivity(req.user.id, projectId, "project.member_unassigned", { userId: userId });
    return res.status(200).json({ message: "Assegnazione utente rimossa con successo" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.delete("/:id", checkSuperadmin, async (req, res) => {
  const projectId = req.params.id;

  try {
    const [result]  = await db.execute("SELECT id,name FROM project WHERE id = ?", [projectId]);
      
    if (result.length === 0) {
      return res.status(404).json({ error: "Progetto non trovato" });
    }

     await db.execute("DELETE FROM project WHERE id = ?", [projectId])

     await logActivity(req.user.id,null,"project.deleted",{deletedProject: result[0].name})
     return res.status(200).json({ message: "Progetto eliminato con successo" });


  
  
  
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
  // db.execute("DELETE FROM project WHERE id = ?", [projectId])
  //   .then(async ([result]) => {
  //     if (result.affectedRows === 0) {
  //       return res.status(404).json({ error: "Progetto non trovato" });
  //     }

  //     await logActivity(req.user.id,null, "project.deleted",{deletedProjectId: projectId});
  //     return res.status(200).json({ message: "Progetto eliminato con successo" });
  //   })
  //   .catch((err) => {
  //     return res
  //       .status(500)
  //       .json({ error: "Errore del server", specific: err.message });
  //   });
});



// rotte aggiunte


//  superadmin ottiene le stats di tutti i progetti;
// admin otttiene le stats solo dei progetti creati da lui o di cui è responsabile;
// per il momento user non ottiene stats sui progetti, ma in futuro potrà ottenere le stats dei progetti a cui è assegnato
router.get('/:id/stats', checkAdmin, async (req, res) => {
  const projectId = req.params.id;


  if(!projectId) {
    return res.status(400).json({ error: "ID progetto mancante" });
  }

  if(isNaN(projectId) || parseInt(projectId) <= 0  ) {
    return res.status(400).json({ error: "ID progetto non valido" });
  }

  if (req.user.role !== "superadmin" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Accesso negato" });
  }

  try {
  const [existingProject] = await db.execute("SELECT id FROM project WHERE id = ?", [projectId]);
  if (existingProject.length === 0) {
    return res.status(404).json({ error: "Progetto non trovato" });
  }

  // admin ha stats solo sui progetti creati da lui o di cui è responsabile; superadmin su tutti
  if (req.user.role === "admin") {
    const [proj] = await db.execute("SELECT created_by, manager_id FROM project WHERE id = ? AND (created_by = ? OR manager_id = ?)", [projectId, req.user.id, req.user.id]);
    if (!proj.length) {
      return res.status(404).json({ error: "Progetto non trovato" });
    }

    if (proj[0].created_by !== req.user.id && proj[0].manager_id !== req.user.id) {
      return res.status(403).json({ error: "Permessi insufficienti" });
    }

  }

  const [t] = await db.execute(
  `SELECT COUNT(ci.id) AS totalTasks,
          SUM(ci.status IN ('Completata','Archiviata')) AS completedTasks
   FROM checklist_template ct
   JOIN checklist_item ci ON ci.template_id = ct.id
   WHERE ct.project_id = ?`,
  [projectId]
);


const [s] = await db.execute(
  `SELECT COUNT(*) AS totalSessions,
          MAX(COALESCE(completed_at, started_at)) AS lastActivity
   FROM test_session
   WHERE project_id = ?`,
  [projectId]
);


  const taskCompletionRate = t[0].totalTasks > 0 ? (t[0].completedTasks / t[0].totalTasks) * 100 : 0;
  return res.status(200).json({
    totalTasks: t[0].totalTasks,
    completedTasks: t[0].completedTasks,
    taskCompletionRate: taskCompletionRate.toFixed(2) + '%',
    totalSessions: s[0].totalSessions,
    lastActivity: s[0].lastActivity
  });
}
catch (err) {
  console.error(err);
  return res.status(500).json({ error: "Errore del server" });
}





})



router.get('/:id/activities',checkUser, async (req,res)=>{
  const {id : project_id} = req.params
  const  {id : user_id,role}  = req.user
  

  if(isNaN(project_id) || parseInt(project_id) <0){
    return res.status(400).json({
      error : 'ID progetto non valido o non trovato'
    })
  }


     try {


  const [existingProject] = await db.execute(
    'select id from project where id = ?'
    ,[project_id]
  ) 

  if(existingProject.length === 0){
   
    return res.status(404).json({ error: "Progetto non trovato" });
  }


   if(role === 'user'){
    const [proj] = await db.execute(
     'select pa.user_id from project p join project_assignment pa on pa.project_id = p.id  where  p.id = ?   and  pa.user_id = ?' 
    ,[project_id, user_id])

    if(proj.length === 0){
      return res.status(403).json({ error: "Permessi insufficenti" });
    }

   }

   if(role === 'admin'){
    const [proj] = await db.execute(
      'select p.created_by, p.manager_id from project p where p.id = ? and (p.created_by = ? or p.manager_id = ?)',
      [project_id, user_id, user_id])

    

    if(proj.length ===0){
      return res.status(403).json({ error: "Permessi insufficenti" });
    }

  }

  

    const limit = Math.min(Number(req.query.limit) || 50, 500);
    const { dateFrom, dateTo } = req.query;

    const filterByUser = role === "user";

    const dateWhereParts = [];
    const dateParams = [];
    if (dateFrom) { dateWhereParts.push("a.timestamp >= ?"); dateParams.push(dateFrom + " 00:00:00"); }
    if (dateTo)   { dateWhereParts.push("a.timestamp <= ?"); dateParams.push(dateTo   + " 23:59:59"); }
    const dateWhereSQL = dateWhereParts.length > 0 ? " AND " + dateWhereParts.join(" AND ") : "";

    const baseParams = filterByUser ? [project_id, user_id] : [project_id];

    const [activities] = await db.execute(
       `SELECT a.id, a.action, a.details, a.timestamp, u.id AS user_id, u.nome, u.cognome,
          p.name AS project_name, ct.title AS checklist_name, ci.description AS task_description,
          ru.nome AS related_user_nome, ru.cognome AS related_user_cognome, rs.started_at AS session_started_at
   FROM audit_log a
   LEFT JOIN user u ON a.user_id = u.id
   LEFT JOIN project p ON p.id = a.project_id
   LEFT JOIN checklist_item ci ON ci.id = CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.itemId')) AS UNSIGNED)
   LEFT JOIN checklist_template ct ON ct.id = COALESCE(
     CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.checklistId')) AS UNSIGNED),
     CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.templateId')) AS UNSIGNED),
     ci.template_id
   )
   LEFT JOIN user ru ON ru.id = COALESCE(
     CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.assignedTo')) AS UNSIGNED),
     CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.userId')) AS UNSIGNED)
   )
   LEFT JOIN test_session rs ON rs.id = CAST(JSON_UNQUOTE(JSON_EXTRACT(a.details, '$.sessionId')) AS UNSIGNED)
   WHERE a.project_id = ?  ${filterByUser ? 'AND a.user_id = ?' : ''} ${dateWhereSQL}
   ORDER BY a.timestamp DESC
   LIMIT ?`,
   [...baseParams, ...dateParams, String(limit)]


    )
    
    // non attività trovate non vuol dire errore 404 
    // ma che non ci sono attività per questo progetto
    if(activities.length ===0){
     return res.status(200).json({message : "Nessuna attività trovata per questo progetto", activities : []})
 
    }

    return res.status(200).json({activities : activities})

  }catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }

  

})



module.exports = router;
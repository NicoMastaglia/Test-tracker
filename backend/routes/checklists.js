const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkAdmin = require("../middleware/checkAdmin");
const checkUser = require("../middleware/checkUser");
const db = require("../database/db");
const logActivity = require("../utils/logActivity");
const { sendProjectEmail } = require("../utils/sendEmail");

// eliminare checklist/task cancella a cascata (FK) le session_task collegate: una
// sessione "In corso" può restarne senza nemmeno una, aperta per sempre e senza
// modo per il tester di chiuderla. Chiude automaticamente queste sessioni orfane.
const closeEmptyOpenSessions = async (projectId, userId) => {
  const [emptySessions] = await db.execute(
    `SELECT ts.id FROM test_session ts
     WHERE ts.project_id = ? AND ts.status = 'In corso'
       AND NOT EXISTS (SELECT 1 FROM session_task st WHERE st.session_id = ts.id)`,
    [projectId],
  );

  if (emptySessions.length === 0) return;

  await db.query("UPDATE test_session SET status = 'Completata', completed_at = NOW() WHERE id IN (?)", [
    emptySessions.map((s) => s.id),
  ]);

  for (const s of emptySessions) {
    await logActivity(userId, projectId, "session.completed", {
      sessionId: s.id,
      reason: "Tutte le task della sessione sono state eliminate",
    });
  }
};

router.post("/", checkAdmin, async (req, res) => {
  const { title, project_id, description } = req.body;
  const createdBy = req.user.id;


 
  
  const trimmedTitle = title ? title.trim() : "";
  const trimmedDescription = description ? description.trim() : "";

  if (!trimmedTitle) {
    return res
      .status(400)
      .json({
        error: "Richiesta non valida",
        message: "Il titolo della checklist non può essere vuoto.",
      });
  }
  if (!project_id) {
    return res
      .status(400)
      .json({
        error: "Richiesta non valida",
        message: "Il progetto di riferimento è obbligatorio.",
      });
  }

  try {
    if (req.user.role === "admin") {
      const [results] = await db.execute(
        "SELECT id FROM project WHERE id = ? AND (created_by = ? OR manager_id = ?)",
        [project_id, createdBy, createdBy],
      );

      if (results.length === 0) {
        return res.status(404).json({ error: "Progetto non trovato o permessi insufficienti" });
      }
    }

    const [projectRows] = await db.execute("SELECT status FROM project WHERE id = ?", [project_id]);
    if (projectRows.length === 0) {
      return res.status(404).json({ error: "Progetto non trovato" });
    }
    if (projectRows[0].status === "Completato") {
      return res.status(400).json({ error: "Progetto completato: non è possibile modificare task o checklist." });
    }
    if (projectRows[0].status === "In pausa") {
      return res.status(400).json({ error: "Progetto in pausa: non è possibile creare nuove checklist." });
    }
    if (projectRows[0].status === "Non iniziato") {
      return res.status(400).json({ error: "Progetto non ancora avviato: non è possibile creare nuove checklist." });
    }

    const [result] = await db.execute(
      "INSERT INTO checklist_template (title, project_id,created_by,description,last_updated) VALUES (?,?,?,?,NOW())",
      [trimmedTitle, project_id, createdBy, trimmedDescription],
    );
    
    await logActivity(req.user.id, project_id, "checklist.created", {
      checklistId: result.insertId,
      title: trimmedTitle,
    });
    res.status(201).json({
      id: result.insertId,
      title: trimmedTitle,
      project_id,
      createdBy,
      description: trimmedDescription,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

router.put("/:id", checkAdmin, async (req, res) => {
  const checklistId = req.params.id;
  const { title, description } = req.body;

  const trimmedTitle = title ? title.trim() : "";
  const trimmedDescription = description ? description.trim() : "";
  if (!trimmedTitle) {
    return res
      .status(400)
      .json({
        error: "Richiesta non valida",
        message: "Il titolo è obbligatorio e non può essere vuoto.",
      });
  }

  try {

     const [results] = await db.execute(
      "SELECT ct.id, ct.project_id FROM checklist_template ct WHERE ct.id = ?",
      [checklistId],
    );

    if(!results.length){
      return res.status(404).json({ error: "Checklist non trovata" });
    }

    const project_id = results.length > 0 ? results[0].project_id : null;



    if (req.user.role === "admin") {
      const [owned] = await db.execute(
        "SELECT ct.id,ct.project_id FROM checklist_template ct JOIN project p ON ct.project_id = p.id WHERE ct.id = ? AND (p.created_by = ? OR p.manager_id = ?)",
        [checklistId, req.user.id, req.user.id],
      );

      if (!owned.length) {
        return res
          .status(403)
          .json({ error: "Accesso negato o checklist non trovata" });
      }

    }

    const [projectRows] = await db.execute("SELECT status FROM project WHERE id = ?", [project_id]);
    if (projectRows[0]?.status === "Completato") {
      return res.status(400).json({ error: "Progetto completato: non è possibile modificare task o checklist." });
    }

    const [result] = await db.execute(
      "UPDATE checklist_template SET title = ?, description = ?, last_updated = NOW() WHERE id = ?",
      [trimmedTitle, trimmedDescription, checklistId],
    );

    if (result.affectedRows === 1) {
      await logActivity(req.user.id, project_id, "checklist.updated", {
        checklistId: checklistId,
        title: trimmedTitle,
      });
      return res
        .status(200)
        .json({ message: "Checklist aggiornata con successo" });
    } else {
      return res.status(404).json({ error: "Checklist non trovata" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.delete("/:id", checkAdmin, async (req, res) => {
  const checklistId = req.params.id;

  try {  


    const [results] = await db.execute(
      "SELECT ct.id, ct.project_id FROM checklist_template ct WHERE ct.id = ?",
      [checklistId],
    );

    if(!results.length){
      return res.status(404).json({ error: "Checklist non trovata" });
    }

    const project_id = results.length > 0 ? results[0].project_id : null;

    if (req.user.role === "admin") {
      const [owned] = await db.execute(
        "SELECT ct.id,ct.project_id FROM checklist_template ct JOIN project p ON ct.project_id = p.id WHERE ct.id = ? AND (p.created_by = ? OR p.manager_id = ?)",
        [checklistId, req.user.id,req.user.id],
      );

      if (!owned.length) {
        return res
          .status(403)
          .json({ error: "Accesso negato o checklist non trovata" });
      }

    }

    const [projectRows] = await db.execute("SELECT status FROM project WHERE id = ?", [project_id]);
    if (projectRows[0]?.status === "Completato") {
      return res.status(400).json({ error: "Progetto completato: non è possibile modificare task o checklist." });
    }

    const [result] = await db.execute(
      "DELETE FROM checklist_template WHERE id = ?",
      [checklistId],
    );

    if (result.affectedRows > 0) {
      await logActivity(req.user.id, project_id, "checklist.deleted", {
        checklistId: checklistId,
      });
      await closeEmptyOpenSessions(project_id, req.user.id);
      return res
        .status(200)
        .json({ message: "Checklist eliminata con successo" });
    } else {
      return res.status(404).json({ error: "Checklist non trovata" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.get("/:projectId", checkUser, (req, res) => {
  const projectId = req.params.projectId;
  const formatChecklists = (results) => {
    const checklistMap = new Map();
    results.forEach((row) => {
      if (!checklistMap.has(row.checklist_id)) {
        checklistMap.set(row.checklist_id, {
          id: row.checklist_id,
          checklist_id: row.checklist_id,
          title: row.title,
          project_id: row.project_id,
          last_updated: row.last_updated,
          description: row.checklist_description,
          created_by: row.created_by,
          creator: row.created_by
            ? { nome: row.creator_nome, cognome: row.creator_cognome }
            : null,
          items: [],
        });
      }
      // Se c'è un item associato alla checklist, lo aggiungiamo all'array degli items della checklist
      // (item_description è un alias per description dell'item, così da evitare conflitti con la description della checklist)
      if (row.item_id) {
        checklistMap.get(row.checklist_id).items.push({
          id: row.item_id,
          item_id: row.item_id,
          description: row.item_description,
          position: row.position,
          assigned_to: row.assigned_to,
          status: row.status,
          deadline: row.deadline,
          // esito/nota dell'ultima sessione risolta su questa task (null se mai testata)
          latest_outcome: row.latest_outcome,
          latest_note: row.latest_note,
        });
      }
    });

    return Array.from(checklistMap.values());
  }; 

 
  

  
  if (req.user.role === "superadmin") {
    return db
      .execute(
        `SELECT ct.id AS checklist_id, ct.title, ct.project_id, ct.last_updated,
                ct.description AS checklist_description, ct.created_by,
                u.nome AS creator_nome, u.cognome AS creator_cognome,
                ci.id AS item_id, ci.description AS item_description, ci.position,
                ci.assigned_to, ci.status, ci.deadline,
                st.outcome AS latest_outcome, st.note AS latest_note
         FROM checklist_template ct
         LEFT JOIN checklist_item ci ON ct.id = ci.template_id
         LEFT JOIN session_task st ON st.id = (
           SELECT st2.id FROM session_task st2
           JOIN test_session ts2 ON st2.session_id = ts2.id
           WHERE st2.checklist_item_id = ci.id AND st2.outcome IS NOT NULL
           ORDER BY ts2.started_at DESC
           LIMIT 1
         )
         LEFT JOIN user u ON ct.created_by = u.id
         WHERE ct.project_id = ?`,
        [projectId],
      )
      .then(([results]) => {
        res.status(200).json(formatChecklists(results));
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Errore del server" });
      });
  } else if (req.user.role === "admin") {
    return db
      .execute(
        `SELECT ct.id AS checklist_id, ct.title, ct.project_id, ct.last_updated,
                ct.description AS checklist_description, ct.created_by,
                u.nome AS creator_nome, u.cognome AS creator_cognome,
                ci.id AS item_id, ci.description AS item_description, ci.position,
                ci.assigned_to, ci.status, ci.deadline,
                st.outcome AS latest_outcome, st.note AS latest_note
         FROM checklist_template ct
         LEFT JOIN checklist_item ci ON ct.id = ci.template_id
         LEFT JOIN session_task st ON st.id = (
           SELECT st2.id FROM session_task st2
           JOIN test_session ts2 ON st2.session_id = ts2.id
           WHERE st2.checklist_item_id = ci.id AND st2.outcome IS NOT NULL
           ORDER BY ts2.started_at DESC
           LIMIT 1
         )
         JOIN project p ON ct.project_id = p.id
         LEFT JOIN user u ON ct.created_by = u.id
         WHERE ct.project_id = ? AND (p.created_by = ? or p.manager_id = ?)`,
        [projectId, req.user.id, req.user.id],
      )
      .then(([results]) => {
        res.status(200).json(formatChecklists(results));
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Errore del server" });
      });
  } else if (req.user.role === "user") {
    return db
      .execute(
        `SELECT ct.id AS checklist_id, ct.title, ct.project_id, ct.last_updated,
                ct.description AS checklist_description, ct.created_by,
                u.nome AS creator_nome, u.cognome AS creator_cognome,
                ci.id AS item_id, ci.description AS item_description, ci.position,
                ci.assigned_to, ci.status, ci.deadline,
                st.outcome AS latest_outcome, st.note AS latest_note
         FROM checklist_template ct
         LEFT JOIN checklist_item ci ON ct.id = ci.template_id
         LEFT JOIN session_task st ON st.id = (
           SELECT st2.id FROM session_task st2
           JOIN test_session ts2 ON st2.session_id = ts2.id
           WHERE st2.checklist_item_id = ci.id AND st2.outcome IS NOT NULL
           ORDER BY ts2.started_at DESC
           LIMIT 1
         )
         JOIN project p ON ct.project_id = p.id
         JOIN project_assignment pa ON p.id = pa.project_id
         LEFT JOIN user u ON ct.created_by = u.id
         WHERE ct.project_id = ? AND pa.user_id = ?`,
        [projectId, req.user.id],
      )
      .then(([results]) => {
        res.status(200).json(formatChecklists(results));
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Errore del server" });
      });
  }

  return res.status(403).json({ error: "Accesso negato" });
});

router.post("/:templateId/item", checkAdmin, async (req, res) => {
  const templateId = req.params.templateId;
  const { description, deadline } = req.body;
  const trimmedDescription = description ? description.trim() : "";

  if (!trimmedDescription) {
    return res
      .status(400)
      .json({
        error: "Richiesta non valida",
        message: "La descrizione è obbligatoria e non può essere vuota.",
      });
  }

  

  try {
    const [templateResults] = await db.execute(
    "SELECT ct.id, ct.project_id, p.status AS project_status FROM checklist_template ct JOIN project p ON ct.project_id = p.id WHERE ct.id = ? AND (p.created_by = ? OR p.manager_id = ? OR ?)",
    [templateId, req.user.id, req.user.id, req.user.role === "superadmin"],
  );

  if (templateResults.length === 0) {
    return res
      .status(403)
      .json({ error: "Accesso negato o template non trovato" });
  }

  if (templateResults[0].project_status === "Completato") {
    return res.status(400).json({ error: "Progetto completato: non è possibile modificare task o checklist." });
  }
  if (templateResults[0].project_status === "In pausa") {
    return res.status(400).json({ error: "Progetto in pausa: non è possibile creare nuove task." });
  }
  if (templateResults[0].project_status === "Non iniziato") {
    return res.status(400).json({ error: "Progetto non ancora avviato: non è possibile creare nuove task." });
  }

    const [result] = await db.execute(
      "INSERT INTO checklist_item (template_id, description, deadline) VALUES (?, ?, ?)",
      [templateId, trimmedDescription, deadline || null],
    );

    await db.execute(
      "UPDATE checklist_template SET last_updated = NOW() WHERE id = ?",
      [templateId],
    );

    await logActivity(req.user.id, templateResults[0].project_id, "task.created", {
      itemId: result.insertId,
      templateId,
      description: trimmedDescription,
    });

    return res.status(201).json({
      message: "Elemento della checklist aggiunto con successo",
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.put("/item/:id", checkAdmin, async (req, res) => {
  const itemId = req.params.id;
  const { description, deadline } = req.body;
  const userId = req.user.id;

  const trimmedDescription = description ? description.trim() : "";

  if (!trimmedDescription) {
    return res.status(400).json({
      error: "Richiesta non valida",
      message: "La nuova descrizione non può essere vuota.",
    });
  }

  try {


    const [isOwnerResults] = await db.execute(
      "SELECT ci.id, ct.project_id, p.status AS project_status FROM checklist_item ci JOIN checklist_template ct ON ci.template_id = ct.id JOIN project p ON ct.project_id = p.id WHERE ci.id = ? AND (p.created_by = ? OR p.manager_id = ? OR ?)",
      [itemId, userId, userId, req.user.role === "superadmin"],
    );

    if (isOwnerResults.length === 0) {
      return res
        .status(403)
        .json({ error: "Accesso negato o elemento della checklist non trovato" });
    }

    if (isOwnerResults[0].project_status === "Completato") {
      return res.status(400).json({ error: "Progetto completato: non è possibile modificare task o checklist." });
    }

    const [result] = await db.execute(
      "UPDATE checklist_item SET description = ?, deadline = ? WHERE id = ?",
      [trimmedDescription, deadline || null, itemId],
    );

    if (result.affectedRows > 0) {
      const [templateResults] = await db.execute(
        `SELECT ci.template_id, ct.project_id
         FROM checklist_item ci
         JOIN checklist_template ct ON ci.template_id = ct.id
         WHERE ci.id = ?`,
        [itemId],
      );
      const templateId = templateResults[0].template_id;
      const projectId = templateResults[0].project_id;

      await db.execute(
        "UPDATE checklist_template SET last_updated = NOW() WHERE id = ?",
        [templateId],
      );

      await logActivity(req.user.id, projectId, "task.updated", {
        itemId: itemId,
        templateId: templateId,
        newDescription: trimmedDescription,
      });
      return res.status(200).json({
        message: "Elemento della checklist aggiornato con successo",
        description: trimmedDescription,
        deadline: deadline || null,
      });
    } else {
      return res
        .status(404)
        .json({ error: "Elemento della checklist non trovato" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.delete("/item/:id", checkAdmin, async (req, res) => {
  const itemId = req.params.id;


  

  try { 
    
    const [itemResults] = await db.execute(
  "SELECT ci.id, ct.id AS template_id,p.id as project_id, p.status AS project_status FROM checklist_item ci JOIN checklist_template ct ON ci.template_id = ct.id JOIN project p ON ct.project_id = p.id WHERE ci.id = ? AND (p.created_by = ? OR p.manager_id = ? OR ?)",
  [itemId, req.user.id,req.user.id, req.user.role === "superadmin"],
);

  if (itemResults.length === 0) {
    return res
      .status(403)
      .json({ error: "Accesso negato o elemento della checklist non trovato" });
  }

  if (itemResults[0].project_status === "Completato") {
    return res.status(400).json({ error: "Progetto completato: non è possibile modificare task o checklist." });
  }

  const projectId = itemResults[0].project_id;

  const [result] = await db.execute("DELETE FROM checklist_item WHERE id = ?", [itemId]);

    if (result.affectedRows > 0) {
      await db.execute(
    "UPDATE checklist_template SET last_updated = NOW() WHERE id = ?",
    [itemResults[0].template_id]   // letto prima di cancellare l'item, così da avere il template_id corretto
  );

  await logActivity(req.user.id, projectId, "task.deleted", {
    itemId: itemId,
    templateId: itemResults[0].template_id,
  });
  await closeEmptyOpenSessions(projectId, req.user.id);
      return res
        .status(200)
        .json({ message: "Elemento della checklist eliminato con successo" });
    } else {
      return res
        .status(404)
        .json({ error: "Elemento della checklist non trovato" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

// nuove rotte qui sott0

// assegnazione di una task ad un utente (del team del progetto)

router.patch("/item/:itemId/assign", checkAdmin, async (req, res) => {
  // prendo il parametro id dell'item da assegnare
  const itemId = req.params.itemId;

  // prendo l'id dell'utente a cui assegnare l'item dal body della richiesta
  const { userId } = req.body;

  try {
    // verifico che l'item esista e che l'utente abbia i permessi per modificarlo (superadmin o admin del progetto)
    const [itemResults] = await db.execute(
      "SELECT ci.id, ci.description, p.id as project_id, p.name AS project_name, p.status AS project_status FROM checklist_item ci JOIN checklist_template ct ON ci.template_id = ct.id JOIN project p ON ct.project_id = p.id WHERE ci.id = ? AND (p.created_by = ? OR p.manager_id = ? OR ?)",
      [itemId, req.user.id, req.user.id, req.user.role === "superadmin"],
    );

    if (itemResults.length === 0) {
      return res
        .status(403)
        .json({ error: "Accesso negato o elemento della checklist non trovato" });
    }

    if (itemResults[0].project_status === "Completato") {
      return res.status(400).json({ error: "Progetto completato: non è possibile modificare task o checklist." });
    }

    const projectId = itemResults[0].project_id;

    // verifico che l'utente a cui assegnare l'item esista
    const [userResults] = await db.execute("SELECT id, nome, email FROM user WHERE id = ?", [
      userId,
    ]);

    if (userResults.length === 0) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    // verifico che l'utente faccia parte del team del progetto: una task non può
    // essere assegnata a chi non ha accesso al progetto
    const [membership] = await db.execute(
      "SELECT project_id FROM project_assignment WHERE project_id = ? AND user_id = ?",
      [projectId, userId],
    );

    if (membership.length === 0) {
      return res.status(400).json({
        error: "Richiesta non valida",
        message: "L'utente non fa parte del team di questo progetto.",
      });
    }

    // aggiorno l'item assegnandolo all'utente
    const [result] = await db.execute(
      "UPDATE checklist_item SET assigned_to = ? WHERE id = ?",
      [userId, itemId],
    );

    if (result.affectedRows > 0) {
    await logActivity(req.user.id, projectId, "task.assigned", {
      itemId: itemId,
      assignedTo: userId,
    });

    const assignedUser = userResults[0];
    const { project_name: projectName, description: taskDescription } = itemResults[0];
    sendProjectEmail(
      { nome: assignedUser.nome, email: assignedUser.email },
      "taskAssignment",
      {
        projectName,
        taskDescription,
        subject: `Nuova task assegnata su ${projectName}`,
      },
    ).catch((err) => console.error("Errore invio email assegnazione task:", err.message));

      return res
        .status(200)
        .json({ message: "Elemento della checklist assegnato con successo" });
    } else {
      return res
        .status(404)
        .json({ error: "Elemento della checklist non trovato" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});



// restituisce le task assegnate  al tester logggato 

router.get('/task/assigned', checkUser, async (req, res) => {

  if(!req.user || req.user.role !== 'user') {
    return res.status(403).json({ error: "Accesso negato" });
  }
  
  
  try {
    // JOIN fino a project: senza project_id il FE non può raggruppare/filtrare
    // le task assegnate per progetto (serve alla modale di creazione sessione).
    const [tasks] = await db.execute(
      `SELECT ci.*, ct.project_id, ct.title AS checklist_title, p.name AS project_name, p.status AS project_status,
              EXISTS (
                SELECT 1 FROM session_task st
                JOIN test_session ts ON st.session_id = ts.id
                WHERE st.checklist_item_id = ci.id AND st.outcome IS NULL AND ts.status = 'In corso'
              ) AS in_open_session
       FROM checklist_item ci
       JOIN checklist_template ct ON ci.template_id = ct.id
       JOIN project p ON ct.project_id = p.id
       WHERE ci.assigned_to = ?`,
      [req.user.id]
    );
    return res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});



// aggiorna lo stato di una task assegnata 
router.patch('/item/:itemId/status',checkUser,async(req,res)=>{
  const itemID = req.params.itemId

  const {status:nextStatus} = req.body 
   
   // se viene passato uno stato non valido, restituisco errore
   if (!["Bloccata", "Archiviata", "Completata", "TODO"].includes(nextStatus)) {
     return res.status(400).json({
       error: "Richiesta non valida",
       message:
         "Stato non valido per questa rotta (solo Bloccata, Archiviata, riapertura a Completata, o sblocco a TODO).",
     });
   }


   try {

   const [rows] = await db.execute(
    `SELECT p.id as project_id , ci.id,ci.status as currentStatus,
    ci.assigned_to,ct.id AS template_id,p.created_by,p.manager_id,p.status as project_status
    from checklist_item ci
    join checklist_template ct on ci.template_id = ct.id
    join project p on ct.project_id = p.id
    where ci.id = ?`,
    [itemID]
   )



   if(!rows || rows.length === 0){
    return res.status(404).json({error:"Elemento della checklist non trovato"})
   }




   // prendo la task
   const task = rows[0];
   const projectId = task.project_id;

   // progetto concluso: niente più modifiche alle task, nemmeno per admin/superadmin
   if (task.project_status === "Completato") {
    return res.status(400).json({error:"Progetto completato: non è possibile modificare task o checklist."})
   }

   // progetto in pausa: nessuna transizione di stato finché non riprende
   if (task.project_status === "In pausa") {
    return res.status(400).json({error:"Progetto in pausa: non è possibile modificare lo stato delle task."})
   }

   // progetto non ancora avviato: nessuna transizione di stato prima che parta
   if (task.project_status === "Non iniziato") {
    return res.status(400).json({error:"Progetto non ancora avviato: non è possibile modificare lo stato delle task."})
   }


   // superadmin può fare tutto,admin controlla le task del progetto creato o assegnato
   const isOwnerAdmin = 
   req.user.role === 'superadmin' || 
   (req.user.role === 'admin' && (task.created_by === req.user.id || task.manager_id === req.user.id));


   const isAssignedTester = req.user.role === 'user' && task.assigned_to === req.user.id;

   if(!isOwnerAdmin && !isAssignedTester){
    return res.status(403).json({error:"Accesso negato"})
   }

   
   

   // Archiviata e riapertura sono azioni riservate ad admin/superadmin (Bloccata invece resta anche al tester)
   if (nextStatus !== "Bloccata" && !isOwnerAdmin) {
    return res.status(403).json({ error: "Accesso negato" })
   }

   if(nextStatus === "Archiviata" && task.currentStatus !== "Completata") {
    return res.status(400).json({
      error: 'Transizione di stato non consentita',
      message : `Non puoi archiviare una task in stato "${task.currentStatus}".`
    })
   }

   if(nextStatus === "Completata" && task.currentStatus !== "Archiviata") {
    return res.status(400).json({
      error: 'Transizione di stato non consentita',
      message : `La riapertura è valida solo da Archiviata. Stato corrente: "${task.currentStatus}".`
    })
   }

   if(nextStatus === "TODO" && task.currentStatus !== "Bloccata") {
    return res.status(400).json({
      error: 'Transizione di stato non consentita',
      message : `Lo sblocco è valido solo da Bloccata. Stato corrente: "${task.currentStatus}".`
    })
   }


    const [result] = await db.execute(
       `
        UPDATE checklist_item
        SET status = ?
        WHERE id = ?
       `,
       [nextStatus, itemID]
    )

    if(result.affectedRows === 0){
      return res.status(404).json({error: "Elemento della checklist non trovato"})
    }

    await db.execute(
      "UPDATE checklist_template SET last_updated = NOW() WHERE id = ?",
      [task.template_id]
    )
    
    const mapStatusToAction = {
      "Bloccata": "task.status_blocked",
      "Archiviata": "task.status_archived",
      "Completata": "task.unarchived",
      "TODO": "task.status_unblocked"
    }
    await logActivity(req.user.id, projectId, mapStatusToAction[nextStatus] || "task.status_updated", {
      itemId: itemID,
      from : task.currentStatus,
      to: nextStatus,
    })

    return res.status(200).json({message: `Stato aggiornato a "${nextStatus}"`,status: nextStatus})


   }catch(err){
    console.error(err);
    return res.status(500).json({error: "Errore del server"})
   }





})


router.patch('/item/:itemId/unassign', checkAdmin, async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const [itemResults] = await db.execute(
      "SELECT ci.assigned_to, p.id AS project_id, p.status AS project_status FROM checklist_item ci JOIN checklist_template ct ON ci.template_id = ct.id JOIN project p ON ct.project_id = p.id WHERE ci.id = ? AND (p.created_by = ? OR p.manager_id = ? OR ?)",
      [itemId, req.user.id, req.user.id, req.user.role === "superadmin"],
    );

    if (itemResults.length === 0) {
      return res.status(403).json({ error: "Accesso negato o elemento della checklist non trovato" });
    }

    if (itemResults[0].project_status === "Completato") {
      return res.status(400).json({ error: "Progetto completato: non è possibile modificare task o checklist." });
    }

    const { assigned_to: previousAssignee, project_id: projectId } = itemResults[0];

    const [result] = await db.execute(
      "UPDATE checklist_item SET assigned_to = NULL WHERE id = ?",
      [itemId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Elemento della checklist non trovato" });
    }

    await logActivity(req.user.id, projectId, "task.unassigned", {
      itemId,
      unassignedFrom: previousAssignee,
    });

    return res.status(200).json({ message: "Assegnazione rimossa con successo" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});




module.exports = router;

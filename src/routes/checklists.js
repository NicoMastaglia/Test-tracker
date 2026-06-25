const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkAdmin = require("../middleware/checkAdmin");
const checkUser = require("../middleware/checkUser");
const db = require("../database/db");
const logActivity = require("../utils/logActivity");


const { route } = require("express/lib/application");

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
        "SELECT id FROM project WHERE id = ? AND created_by = ?",
        [project_id, createdBy],
      );

      if (results.length === 0) {
        return res.status(403).json({ error: "Progetto non trovato" });
      }
    }

    const [result] = await db.execute(
      "INSERT INTO checklist_template (title, project_id,createdBy,description,last_updated) VALUES (?,?,?,?,NOW())",
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
    res.status(500).json({ error: "Errore del server", specific: err.message });
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
        "SELECT ct.id,ct.project_id FROM checklist_template ct JOIN project p ON ct.project_id = p.id WHERE ct.id = ? AND p.created_by = ?",
        [checklistId, req.user.id],
      );

      if (!owned.length) {
        return res
          .status(403)
          .json({ error: "Accesso negato o checklist non trovata" });
      }

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
    return res.status(500).json({
      error: "Errore del server",
      specific: err.message,
    });
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
        "SELECT ct.id,ct.project_id FROM checklist_template ct JOIN project p ON ct.project_id = p.id WHERE ct.id = ? AND p.created_by = ?",
        [checklistId, req.user.id],
      );

      if (!owned.length) {
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
      await logActivity(req.user.id, project_id, "checklist.deleted", {
        checklistId: checklistId,
      });
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
                ci.id AS item_id, ci.description AS item_description, ci.position
         FROM checklist_template ct
         LEFT JOIN checklist_item ci ON ct.id = ci.template_id
         LEFT JOIN user u ON ct.created_by = u.id
         WHERE ct.project_id = ?`,
        [projectId],
      )
      .then(([results]) => {
        res.status(200).json(formatChecklists(results));
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
        `SELECT ct.id AS checklist_id, ct.title, ct.project_id, ct.last_updated,
                ct.description AS checklist_description, ct.created_by,
                u.nome AS creator_nome, u.cognome AS creator_cognome,
                ci.id AS item_id, ci.description AS item_description, ci.position
         FROM checklist_template ct
         LEFT JOIN checklist_item ci ON ct.id = ci.template_id
         JOIN project p ON ct.project_id = p.id
         LEFT JOIN user u ON ct.created_by = u.id
         WHERE ct.project_id = ? AND p.created_by = ?`,
        [projectId, req.user.id],
      )
      .then(([results]) => {
        res.status(200).json(formatChecklists(results));
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
        `SELECT ct.id AS checklist_id, ct.title, ct.project_id, ct.last_updated,
                ct.description AS checklist_description, ct.created_by,
                u.nome AS creator_nome, u.cognome AS creator_cognome,
                ci.id AS item_id, ci.description AS item_description, ci.position
         FROM checklist_template ct
         LEFT JOIN checklist_item ci ON ct.id = ci.template_id
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
    return res
      .status(400)
      .json({
        error: "Richiesta non valida",
        message: "La descrizione è obbligatoria e non può essere vuota.",
      });
  }

  const [templateResults] = await db.execute(
    "SELECT ct.id, ct.project_id FROM checklist_template ct JOIN project p ON ct.project_id = p.id WHERE ct.id = ? AND (p.created_by = ? OR ?)",
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
    return res.status(400).json({
      error: "Richiesta non valida",
      message: "La nuova descrizione non può essere vuota.",
    });
  }

  try {
    const [result] = await db.execute(
      "UPDATE checklist_item SET description = ? WHERE id = ?",
      [trimmedDescription, itemId],
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
      });
    } else {
      return res
        .status(404)
        .json({ error: "Elemento della checklist non trovato" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Errore del server", specific: err.message });
  }
});

router.delete("/item/:id", checkAdmin, async (req, res) => {
  const itemId = req.params.id;

  const [itemResults] = await db.execute(
  "SELECT ci.id, ct.id AS template_id,p.id as project_id FROM checklist_item ci JOIN checklist_template ct ON ci.template_id = ct.id JOIN project p ON ct.project_id = p.id WHERE ci.id = ? AND (p.created_by = ? OR ?)",
  [itemId, req.user.id, req.user.role === "superadmin"],
);

  if (itemResults.length === 0) {
    return res
      .status(403)
      .json({ error: "Accesso negato o elemento della checklist non trovato" });
  }

  const projectId = itemResults[0].project_id;

  try {
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
      return res
        .status(200)
        .json({ message: "Elemento della checklist eliminato con successo" });
    } else {
      return res
        .status(404)
        .json({ error: "Elemento della checklist non trovato" });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Errore del server",
      specific: err.message,
    });
  }
});

// nuove rotte qui sott0

// assegnazione di una task ad un utente (del team del progetto)

router.patch("/item/:itemId/assign", checkAdmin, async (req, res) => {
  // prendo il parametro id dell'item da assegnare
  const itemId = req.params.itemId;

  // prendo l'id dell'utente a cui assegnare l'item dal body della richiesta
  const { userId } = req.body;

  // verifico che l'item esista e che l'utente abbia i permessi per modificarlo (superadmin o admin del progetto)

  const [itemResults] = await db.execute(
    "SELECT ci.id,p.id as project_id FROM checklist_item ci JOIN checklist_template ct ON ci.template_id = ct.id JOIN project p ON ct.project_id = p.id WHERE ci.id = ? AND (p.created_by = ? OR ?)",
    [itemId, req.user.id, req.user.role === "superadmin"],
  );

  if (itemResults.length === 0) {
    return res
      .status(403)
      .json({ error: "Accesso negato o elemento della checklist non trovato" });
  }

  const projectId = itemResults[0].project_id;

  // verifico che l'utente a cui assegnare l'item esista
  const [userResults] = await db.execute("SELECT id FROM user WHERE id = ?", [
    userId,
  ]);

  if (userResults.length === 0) {
    return res.status(404).json({ error: "Utente non trovato" });
  }

  try {
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

    
      return res
        .status(200)
        .json({ message: "Elemento della checklist assegnato con successo" });
    } else {
      return res
        .status(404)
        .json({ error: "Elemento della checklist non trovato" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Errore del server", specific: err.message });
  }
});



// restituisce le task assegnate  al tester logggato 

router.get('/task/assigned', checkUser, async (req, res) => {

  if(!req.user || req.user.role !== 'user') {
    return res.status(403).json({ error: "Accesso negato" });
  }
  
  
  try {
    const [tasks] = await db.execute(
      "SELECT * FROM checklist_item WHERE assigned_to = ?",
      [req.user.id]
    );
    return res.status(200).json(tasks);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Errore del server", specific: err.message });
  }
});



// aggiorna lo stato di una task assegnata 
router.patch('/item/:itemId/status',checkUser,async(req,res)=>{
  const itemID = req.params.itemId

  const {status:nextStatus} = req.body 
   
   // se viene passato uno stato non valido, restituisco errore
   if (!["Bloccata", "Archiviata", "Completata"].includes(nextStatus)) {
     return res.status(400).json({
       error: "Richiesta non valida",
       message:
         "Stato non valido per questa rotta (solo Bloccata, Archiviata, o riapertura a Completata).",
     });
   }


   const [rows] = await db.execute(
    `SELECT p.id as project_id , ci.id,ci.status as currentStatus,
    ci.assigned_to,ct.id AS template_id,p.created_by,p.manager_id
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


   try {
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
      "Completata": "task.unarchived"
    }
    await logActivity(req.user.id, projectId, mapStatusToAction[nextStatus] || "task.status_updated", {
      itemId: itemID,
      from : task.currentStatus,
      to: nextStatus,
    })

    return res.status(200).json({message: `Stato aggiornato a "${nextStatus}"`,status: nextStatus})


   }catch(err){
    return res.status(500).json({error: "Errore del server", specific: err.message})
   }





})

module.exports = router;

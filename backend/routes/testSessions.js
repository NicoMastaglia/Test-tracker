const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkAdmin = require("../middleware/checkAdmin");
const checkUser = require("../middleware/checkUser");
const db = require("../database/db");
const logActivity = require("../utils/logActivity");
const { sendProjectEmail } = require("../utils/sendEmail");



router.post("/", checkUser, async (req, res) => {
  const testerId = req.user.id;
  const { checklistItemIds } = req.body;

  if (!Array.isArray(checklistItemIds) || checklistItemIds.length === 0) {
    return res
      .status(400)
      .json({ error: "Nessun elemento della checklist fornito" });
  }

  const [items] = await db.query(
    `
    SELECT ci.id,ci.assigned_to,ci.status,ct.project_id,p.status AS project_status
    FROM checklist_item ci
    JOIN checklist_template ct ON ci.template_id = ct.id
    JOIN project p ON ct.project_id = p.id
    WHERE ci.id in (?)

    `,
    [checklistItemIds],
  );

  // Verifica che tutti gli elementi della checklist esistano
  if (items.length !== checklistItemIds.length) {
    return res.status(400).json({ error: "Una o più task non esistono" });
  }

  // un progetto concluso non può essere il punto di partenza di una nuova sessione
  if (items.some((item) => item.project_status === "Completato")) {
    return res
      .status(400)
      .json({ error: "Il progetto è completato: non è possibile creare nuove sessioni" });
  }

  // progetto in pausa: nessuna nuova sessione finché non riprende
  if (items.some((item) => item.project_status === "In pausa")) {
    return res
      .status(400)
      .json({ error: "Il progetto è in pausa: non è possibile creare nuove sessioni" });
  }

  // progetto non ancora avviato: nessuna sessione prima che parta
  if (items.some((item) => item.project_status === "Non iniziato")) {
    return res
      .status(400)
      .json({ error: "Il progetto non è ancora avviato: non è possibile creare nuove sessioni" });
  }

  const notAssignedItems = items.filter(
    (item) => item.assigned_to !== testerId,
  );

  // Verifica che tutti gli elementi della checklist siano assegnati al tester loggato
  if (notAssignedItems.length > 0) {
    return res
      .status(403)
      .json({ error: "Puoi creare sessioni solo sulle tue task assegnate" });
  }

  // Verifica che tutti gli elementi della checklist appartengano allo stesso progetto
  //  mi ritorna un array di project_id unici, se la lunghezza è maggiore di 1 allora gli elementi appartengono a progetti diversi
  const projectIds = [...new Set(items.map((item) => item.project_id))];

  if (projectIds.length > 1) {
    return res
      .status(400)
      .json({
        error:
          "Gli elementi della checklist devono appartenere allo stesso progetto",
      });
  }

  // Bloccata esclusa insieme a Completata/Archiviata: una task bloccata non è lavorabile
  const notWorkable = items.filter(
    (item) =>
      item.status === "Archiviata" ||
      item.status === "Completata" ||
      item.status === "Bloccata",
  );

  if (notWorkable.length > 0) {
    return res
      .status(400)
      .json({
        error: "Non puoi creare sessioni su task completate, archiviate o bloccate",
      });
  }

  // Una task già presente in un'altra sessione ancora aperta (esito non ancora
  // impostato) non può essere riassegnata a una nuova sessione: eviterebbe esiti
  // discordanti sulla stessa task tra due sessioni diverse.
  const [alreadyOpenTasks] = await db.query(
    `
    SELECT DISTINCT st.checklist_item_id
    FROM session_task st
    JOIN test_session ts ON st.session_id = ts.id
    WHERE st.checklist_item_id IN (?) AND st.outcome IS NULL AND ts.status = 'In corso'
    `,
    [checklistItemIds],
  );

  if (alreadyOpenTasks.length > 0) {
    return res
      .status(400)
      .json({
        error: "Una o più task sono già in un'altra sessione di test ancora aperta",
      });
  }

  let connection;

  try {
    connection = await db.getConnection();

    await connection.beginTransaction();

    const [result] = await connection.execute(
      "INSERT INTO test_session (project_id, user_id, status, started_at) VALUES (?, ?, 'In corso', NOW())",
      [projectIds[0], testerId],
    );

    // prendo l'id della sessione appena creata per inserirlo nella tabella session_task
    const sessionId = result.insertId;

    // creo un array di valori da inserire nella tabella session_task
    // es [sessionId, itemId1, null, null], [sessionId, itemId2, null, null], ...]
    const values = checklistItemIds.map((itemId) => [
      sessionId,
      itemId,
      null,
    ]);

    // inserisco i valori nella tabella session_task
    await connection.query(
      "INSERT INTO session_task (session_id, checklist_item_id,outcome) VALUES ?",
      [values],
    );

    // aggiorno lo status degli elementi della checklist a "In corso" solo se lo status attuale è "TODO"
    await connection.query(
      "UPDATE checklist_item SET status = 'In corso' WHERE id IN (?) AND status = 'TODO'",
      [checklistItemIds],
    );

    await connection.commit();

    await logActivity(testerId, projectIds[0], "session.created", {
      sessionId: sessionId,
      checklistItemIds: checklistItemIds,
    });
    return res
      .status(201)
      .json({ message: "Sessione di test creata con successo", sessionId });
  } catch (error) {
    if (typeof connection !== "undefined") {
      // Rollback della transazione in caso di errore
      // per evitare che la sessione venga creata senza i risultati dei test o viceversa
      await connection.rollback();
    }

    return res
      .status(500)
      .json({ error: "Errore del server", details: error.message });
  } finally {
    if (connection) {
      // Rilascia la connessione al pool
      connection.release();
    }
  }
});

router.get("/", checkUser, async (req, res) => {
  const { projectId } = req.query;
  const hasProject =
    projectId !== undefined && projectId !== null && projectId !== "";

  // project_name serve al FE per mostrare a quale progetto appartiene ogni
  // sessione (un tester può avere sessioni su più progetti contemporaneamente).
  if (req.user.role === "superadmin") {
    try {
      const [sessions] = await db.execute(
        `SELECT ts.*, p.name AS project_name, u.nome AS tester_nome, u.cognome AS tester_cognome,
                EXISTS (
                  SELECT 1 FROM session_task st
                  JOIN checklist_item ci ON ci.id = st.checklist_item_id
                  WHERE st.session_id = ts.id AND ci.status = 'Bloccata'
                ) AS has_blocked_task
         FROM test_session ts
         JOIN project p ON ts.project_id = p.id
         JOIN user u ON ts.user_id = u.id
         ${hasProject ? "WHERE ts.project_id = ?" : ""}`,
        hasProject ? [projectId] : [],
      );
      // lista vuota è un risultato valido, non un errore: 200 con array vuoto
      return res.status(200).json(sessions);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore del server", details: error.message });
    }
  }

  if (req.user.role === "admin") {
    try {
      // come in GET /api/projects: un admin vede anche i progetti che gestisce
      // (manager_id), non solo quelli creati da lui
      const [sessions] = await db.execute(
        `SELECT ts.id, ts.project_id, ts.user_id, ts.status, ts.started_at, ts.completed_at, p.name AS project_name, u.nome AS tester_nome, u.cognome AS tester_cognome,
                EXISTS (
                  SELECT 1 FROM session_task st
                  JOIN checklist_item ci ON ci.id = st.checklist_item_id
                  WHERE st.session_id = ts.id AND ci.status = 'Bloccata'
                ) AS has_blocked_task
         FROM test_session ts
         JOIN project p ON ts.project_id = p.id
         JOIN user u ON ts.user_id = u.id
         WHERE (p.created_by = ? OR p.manager_id = ?) ${hasProject ? "AND p.id = ?" : ""}`,
        hasProject ? [req.user.id, req.user.id, projectId] : [req.user.id, req.user.id],
      );
      // lista vuota è un risultato valido, non un errore: 200 con array vuoto
      return res.status(200).json(sessions);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore del server", details: error.message });
    }
  }

  if (req.user.role === "user") {
    try {
      const [sessions] = await db.execute(
        `SELECT ts.id, ts.project_id, ts.user_id, ts.status, ts.started_at, ts.completed_at, p.name AS project_name,
                EXISTS (
                  SELECT 1 FROM session_task st
                  JOIN checklist_item ci ON ci.id = st.checklist_item_id
                  WHERE st.session_id = ts.id AND ci.status = 'Bloccata'
                ) AS has_blocked_task
         FROM test_session ts JOIN project p ON ts.project_id = p.id WHERE ts.user_id = ? ${hasProject ? "AND ts.project_id = ?" : ""}`,
        hasProject ? [req.user.id, projectId] : [req.user.id],
      );
      // lista vuota è un risultato valido, non un errore: 200 con array vuoto
      return res.status(200).json(sessions);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore del server", details: error.message });
    }
  }

  return res.status(403).json({ error: "Accesso negato" });
});



router.delete("/:id", checkAdmin, async (req, res) => {
  const sessionId = req.params.id;

  if (!sessionId) {
    return res.status(400).json({ error: "ID sessione non valido" });
  }

  if (req.user.role === "admin") {
    try {
      const [session] = await db.execute(
        "SELECT * FROM test_session JOIN project p ON test_session.project_id = p.id WHERE test_session.id = ? AND p.created_by = ?",
        [sessionId, req.user.id],
      );
      if (!session.length) {
        return res.status(404).json({
          error: "Sessione di test non trovata o permessi insufficienti",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore del server", details: error.message });
    }
  }

  let connection;

  try {
    connection = await db.getConnection();

    await connection.beginTransaction();

    await connection.execute("DELETE FROM session_task WHERE session_id = ?", [
      sessionId,
    ]);

    const [result] = await connection.execute(
      "DELETE FROM test_session WHERE id = ?",
      [sessionId],
    );

    await connection.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Sessione di test non trovata",
      });
    }

    await logActivity(req.user.id, null, "session.deleted", {
      sessionId: sessionId,
    });
    return res
      .status(200)
      .json({ message: "Sessione di test eliminata con successo" });
  } catch (error) {
    if (typeof connection !== "undefined") {
      await connection.rollback();
    }
    return res
      .status(500)
      .json({ error: "Errore del server", details: error.message });
  } finally {
    if (typeof connection !== "undefined") {
      connection.release();
    }
  }
});


// Riapre una sessione di test completata
router.patch("/:id/reopen", checkAdmin, async (req, res) => {
  const sessionId = req.params.id;

  if (!sessionId) {
    return res.status(400).json({ error: "ID sessione non valido" });
  }
  

  const [session] = await db.execute(
  'select p.id as project_id, p.name as project_name, ts.status, ts.user_id, u.nome, u.email from test_session ts join project p on ts.project_id = p.id join user u on ts.user_id = u.id where ts.id = ?',
  [sessionId]
  )

  if(session.length === 0){
    return res.status(404).json({error:"Sessione di test non trovata"})
  }

  if(session[0].status !== 'Completata'){
    return res.status(400).json({error:"Sessione di test non completata, impossibile riaprirla"})
  }

  const projectId = session[0].project_id;
  const projectName = session[0].project_name;
  const tester = { nome: session[0].nome, email: session[0].email };


  if (req.user.role === "admin") {
    try {
      const [session] = await db.execute(
        "SELECT * FROM test_session JOIN project p ON test_session.project_id = p.id WHERE test_session.id = ? AND p.created_by = ?",
        [sessionId, req.user.id],
      );
      if (!session.length) {
        return res.status(404).json({
          error: "Sessione di test non trovata o permessi insufficienti",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore del server", details: error.message });
    }
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.execute(
      "UPDATE test_session SET status = 'In corso', completed_at = NULL WHERE id = ?",
      [sessionId],
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        error: "Sessione di test non trovata",
      });
    }

    // riaprire l'intera sessione riapre anche tutte le sue task: con l'esito
    // bloccato una volta inviato, senza questo azzeramento nessuna task tornerebbe
    // davvero modificabile (le task già bloccate da un admin non vengono toccate)
    await connection.execute(
      "UPDATE session_task SET outcome = NULL WHERE session_id = ?",
      [sessionId],
    );

    await connection.execute(
      `UPDATE checklist_item
       SET status = 'In corso'
       WHERE id IN (SELECT checklist_item_id FROM session_task WHERE session_id = ?)
         AND status = 'Completata'`,
      [sessionId],
    );

    await connection.commit();

    await logActivity(req.user.id, projectId, "session.reopened", {
      sessionId: sessionId,

    });

    sendProjectEmail(
      tester,
      "sessionReopened",
      { projectName, subject: `Sessione di test riaperta su ${projectName}` },
    ).catch((err) => console.error("Errore invio email riapertura sessione:", err.message));

    return res
      .status(200)
      .json({ message: "Sessione di test riaperta con successo" });
  } catch (error) {
    if (typeof connection !== "undefined") {
      await connection.rollback();
    }
    return res
      .status(500)
      .json({ error: "Errore del server", details: error.message });
  } finally {
    if (typeof connection !== "undefined") {
      connection.release();
    }
  }
});


// Aggiorna l'outcome e la nota di una task in una sessione di test
router.patch('/:sessionId/task/:itemId',checkUser,async (req,res)=>{
  const userId = req.user.id;
  const {sessionId,itemId} = req.params;
  const {outcome,note} = req.body;

  if(!sessionId || !itemId){
    return res.status(400).json({error:"ID sessione o task non valido"});
  }

  if(!outcome || !['Positivo','Negativo'].includes(outcome)){
    return res.status(400).json({error:"Outcome non valido, deve essere Positivo o Negativo"});

  }

  // if(!note){
  //   return res.status(400).json({error:"Nota non valida"});
  // }

  try{

    const [session] = await db.execute(

    'select p.id as project_id, p.status as project_status, ts.status from test_session ts join project p on ts.project_id = p.id where ts.id = ? and ts.user_id = ? and ts.status = "In corso"',
    [sessionId,userId]


    )

    if(session.length === 0){
      return res.status(404).json({error:"Sessione di test non trovata, non tua o non attiva"})
    }

    // progetto concluso: la sessione resta visibile in sola lettura, niente più
    // aggiornamenti di esito anche se era ancora "In corso" al momento del completamento
    if (session[0].project_status === 'Completato') {
      return res.status(400).json({error:"Il progetto è stato completato: non è più possibile aggiornare task da questa sessione"})
    }

    // progetto in pausa: nessun aggiornamento di esito finché non riprende
    if (session[0].project_status === 'In pausa') {
      return res.status(400).json({error:"Il progetto è in pausa: non è possibile aggiornare task da questa sessione"})
    }

    // progetto non ancora avviato: nessun aggiornamento di esito prima che parta
    if (session[0].project_status === 'Non iniziato') {
      return res.status(400).json({error:"Il progetto non è ancora avviato: non è possibile aggiornare task da questa sessione"})
    }

    const projectId = session[0].project_id;

    // una task bloccata o disassegnata nel frattempo (es. da un admin) non può più
    // essere completata da questa sessione, anche se la sessione è ancora aperta
    const [taskRows] = await db.execute(
      'select status,assigned_to from checklist_item where id = ?',
      [itemId]
    )

    if (taskRows.length === 0) {
      return res.status(404).json({error:"Task non trovata"})
    }

    if (taskRows[0].status === 'Bloccata') {
      return res.status(400).json({error:"La task è stata bloccata, non puoi più aggiornarne l'esito da questa sessione"})
    }

    if (taskRows[0].assigned_to !== userId) {
      return res.status(400).json({error:"La task non è più assegnata a te, non puoi più aggiornarne l'esito da questa sessione"})
    }

    // un esito già inviato resta bloccato finché non viene esplicitamente riaperto
    // (PATCH .../reopen): evita che una task già risposta venga sovrascritta per errore
    const [existingOutcome] = await db.execute(
      'select outcome from session_task where session_id = ? and checklist_item_id = ?',
      [sessionId, itemId]
    )

    if (existingOutcome.length > 0 && existingOutcome[0].outcome !== null) {
      return res.status(400).json({error:"Esito già inviato: usa 'Riapri esito' per modificarlo"})
    }

    const [result]  = await db.execute(
      `

      UPDATE session_task st
      set st.outcome = ?, st.note = ?
      where st.session_id = ? and st.checklist_item_id = ? and st.outcome is null and st.session_id in (select ts.id from test_session ts where ts.user_id = ? and ts.status = 'In corso')
   `,[outcome,note,sessionId,itemId,userId]



    )


     if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Task non trovata nella sessione, o sessione non attiva/non tua" });
  }

    
 
      await db.execute(
        `
        UPDATE checklist_item ci
        set ci.status = 'Completata'
        where ci.id = ? and ci.status = 'In corso'
        `,[itemId]
      )
    const [sessionCloseResult] = await db.execute(
      `
      UPDATE test_session ts
      set ts.status = 'Completata', ts.completed_at = NOW()
      where ts.id = ? and ts.status = 'In corso' and not exists (select 1 from session_task st where st.session_id = ts.id and st.outcome is null)
      `,[sessionId]
    
    )

     await logActivity(userId,projectId,'task.status_changed',{sessionId:sessionId,itemId:itemId,outcome:outcome,note:note})

    if(sessionCloseResult.affectedRows > 0){
      await logActivity(userId,projectId,'session.completed',{sessionId:sessionId})


    }
    
    

    return res.status(200).json({message:"Risultato della task aggiornato con successo"})

  }catch(error){
    return res.status(500).json({error:"Errore del server",details:error.message})
  }
});

// self-service: il tester riapre un esito che ha sbagliato a inserire, su una
// sessione già "Completata" (finché la sessione è ancora "In corso" può già
// correggere l'esito ripetendo la PATCH sopra, senza bisogno di questa rotta).
// Non richiede l'intervento di un admin: a differenza di PATCH /:id/reopen
// (admin-only, riapre l'intera sessione) questa riapre solo la singola task.
router.patch('/:sessionId/task/:itemId/reopen', checkUser, async (req, res) => {
  const userId = req.user.id;
  const { sessionId, itemId } = req.params;

  if (!sessionId || !itemId) {
    return res.status(400).json({ error: "ID sessione o task non valido" });
  }

  try {
    const [session] = await db.execute(
      'select p.id as project_id, p.status as project_status, ts.status from test_session ts join project p on ts.project_id = p.id where ts.id = ? and ts.user_id = ?',
      [sessionId, userId]
    );

    if (session.length === 0) {
      return res.status(404).json({ error: "Sessione di test non trovata o non tua" });
    }

    if (session[0].project_status === 'Completato') {
      return res.status(400).json({ error: "Il progetto è stato completato: non è più possibile riaprire esiti da questa sessione" });
    }

    if (session[0].project_status === 'In pausa') {
      return res.status(400).json({ error: "Il progetto è in pausa: non è possibile riaprire esiti da questa sessione" });
    }

    if (session[0].project_status === 'Non iniziato') {
      return res.status(400).json({ error: "Il progetto non è ancora avviato: non è possibile riaprire esiti da questa sessione" });
    }

    const projectId = session[0].project_id;

    const [taskRows] = await db.execute(
      'select ci.status, ci.assigned_to from checklist_item ci join session_task st on st.checklist_item_id = ci.id where st.session_id = ? and st.checklist_item_id = ?',
      [sessionId, itemId]
    );

    if (taskRows.length === 0) {
      return res.status(404).json({ error: "Task non trovata in questa sessione" });
    }

    if (taskRows[0].status === 'Bloccata') {
      return res.status(400).json({ error: "La task è stata bloccata, non puoi riaprirne l'esito" });
    }

    if (taskRows[0].status !== 'Completata') {
      return res.status(400).json({ error: "La task non ha ancora un esito da riaprire" });
    }

    if (taskRows[0].assigned_to !== userId) {
      return res.status(400).json({ error: "La task non è più assegnata a te, non puoi riaprirne l'esito" });
    }

    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      // la nota non viene azzerata: può restare documentazione valida anche se
      // l'esito scelto era sbagliato; il tester la può sovrascrivere reinviando l'esito
      await connection.execute(
        "UPDATE session_task SET outcome = NULL WHERE session_id = ? AND checklist_item_id = ?",
        [sessionId, itemId]
      );

      await connection.execute(
        "UPDATE checklist_item SET status = 'In corso' WHERE id = ? AND status = 'Completata'",
        [itemId]
      );

      // se la sessione era già "In corso" (altre task ancora aperte) non c'è nulla
      // da riaprire a livello sessione, solo la singola task viene sbloccata sopra
      if (session[0].status === 'Completata') {
        await connection.execute(
          "UPDATE test_session SET status = 'In corso', completed_at = NULL WHERE id = ?",
          [sessionId]
        );
      }

      await connection.commit();
    } catch (error) {
      if (typeof connection !== "undefined") {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (typeof connection !== "undefined") {
        connection.release();
      }
    }

    await logActivity(userId, projectId, 'task.outcome_reopened', { sessionId: sessionId, itemId: itemId });

    return res.status(200).json({ message: "Esito riaperto: ora puoi correggerlo" });
  } catch (error) {
    return res.status(500).json({ error: "Errore del server", details: error.message });
  }
});


router.get('/:sessionId',checkUser,async (req,res)=>{
  const {sessionId} = req.params
  const userId = req.user.id 

  if(!sessionId || isNaN(sessionId)){
    return res.status(404).json({error:"ID sessione non valido"})
  }

  try{
    let session; 

    if(req.user.role === 'superadmin'){

      const [rows] = await db.execute(

      `
      select ts.id,ts.project_id,ts.status,ts.started_at,ts.completed_at,p.name as project_name,p.status as project_status
      from test_session ts
      join project p on ts.project_id = p.id
      where ts.id = ?

      `,[sessionId]
    )
    session = rows;
    }
    else if (req.user.role === 'admin'){
      const [rows] = await db.execute(

       `
      select ts.id,ts.project_id,ts.status,ts.started_at,ts.completed_at,p.name as project_name,p.status as project_status
      from test_session ts
      join project p on ts.project_id = p.id
      where ts.id = ? AND  (p.created_by = ? OR p.manager_id = ?)`
      ,
      [sessionId,req.user.id,req.user.id]
      )
      session = rows

    }else{


    const [rows] = await db.execute(

      `
      select ts.id,ts.project_id,ts.status,ts.started_at,ts.completed_at,p.name as project_name,p.status as project_status
      from test_session ts
      join project p on ts.project_id = p.id
      where ts.id = ? and ts.user_id = ?

      `,[sessionId,userId]
    )
    session = rows
    }

    if(session.length ===0){
      return res.status(400).json({
        error  : ` Sessione ${sessionId} non trovata o non appartiente all'utente loggato`
      })
    }

    const [tasks] = await db.execute(
      `
      select st.checklist_item_id,st.outcome,st.note,ci.status as task_status,
      ci.description,ci.assigned_to
      from session_task st
      join checklist_item ci on st.checklist_item_id = ci.id
      where st.session_id = ?
      `,[sessionId]
    )

    return res.status(200).json({
      session:session[0],
      tasks:tasks
    })

  }catch(error){
    return res.status(500).json({error:"Errore del server",details:error.message})
  }
})


module.exports = router;
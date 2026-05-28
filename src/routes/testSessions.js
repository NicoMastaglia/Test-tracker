const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkAdmin = require("../middleware/checkAdmin");
const checkUser = require("../middleware/checkUser");
const db = require("../database/db");

router.post("/", checkUser, async (req, res) => {
  const testerId = req.user.id;
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: "Progetto non valido" });
  }

  const [projectResults] = await db.execute(
    "SELECT id FROM project WHERE id = ?",
    [projectId],
  );

  if (!projectResults.length) {
    return res.status(404).json({ error: "Progetto non trovato" });
  }

  if (req.user.role === "user") {
    const [membershipResults] = await db.execute(
      "SELECT user_id FROM project_assignment WHERE project_id = ? AND user_id = ?",
      [projectId, testerId],
    );

    if (!membershipResults.length) {
      return res.status(403).json({ error: "Accesso non consentito" });
    }
  }

  if (req.user.role === "admin") {
    const [adminResults] = await db.execute(
      "SELECT id FROM project WHERE id = ? AND created_by = ?",
      [projectId, testerId],
    );

    if (!adminResults.length) {
      return res.status(403).json({ error: "Accesso non consentito" });
    }
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO test_session (project_id, user_id) VALUES (?, ?)",
      [projectId, testerId],
    );
    if (result.affectedRows === 0) {
      return res
        .status(500)
        .json({ error: "Errore durante la creazione della sessione di test" });
    } else {
      return res.status(201).json({
        id: result.insertId,
        message: "Sessione di test creata con successo",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Errore interno del server", details: error.message });
  }
});

router.get("/", checkUser, async (req, res) => {
  const { projectId } = req.query;
  const hasProject =
    projectId !== undefined && projectId !== null && projectId !== "";

  if (req.user.role === "superadmin") {
    try {
      const [sessions] = await db.execute(
        `SELECT * FROM test_session ts ${hasProject ? "WHERE ts.project_id = ?" : ""}`,
        hasProject ? [projectId] : [],
      );
      if (!sessions.length) {
        return res
          .status(404)
          .json({ error: "Nessuna sessione di test trovata" });
      }
      return res.status(200).json(sessions);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore interno del server", details: error.message });
    }
  }

  if (req.user.role === "admin") {
    try {
      const [sessions] = await db.execute(
        `SELECT ts.id, ts.project_id, ts.user_id, ts.status, ts.started_at, ts.completed_at FROM test_session ts JOIN project p ON ts.project_id = p.id WHERE p.created_by = ? ${hasProject ? "AND p.id = ?" : ""}`,
        hasProject ? [req.user.id, projectId] : [req.user.id],
      );
      if (!sessions.length) {
        return res
          .status(404)
          .json({ error: "Nessuna sessione di test trovata" });
      }
      return res.status(200).json(sessions);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore interno del server", details: error.message });
    }
  }

  if (req.user.role === "user") {
    try {
      const [sessions] = await db.execute(
        `SELECT ts.id, ts.project_id, ts.user_id, ts.status, ts.started_at, ts.completed_at FROM test_session ts WHERE ts.user_id = ? ${hasProject ? "AND ts.project_id = ?" : ""}`,
        hasProject ? [req.user.id, projectId] : [req.user.id],
      );
      if (!sessions.length) {
        return res
          .status(404)
          .json({ error: "Nessuna sessione di test trovata" });
      }
      return res.status(200).json(sessions);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore interno del server", details: error.message });
    }
  }

  return res.status(403).json({ error: "Accesso non consentito" });
});

router.get("/:id", checkUser, async (req, res) => {
  const sessionId = req.params.id;

  if (!sessionId) {
    return res.status(400).json({ error: "ID sessione non valido" });
  }

  if (req.user.role === "superadmin") {
    try {
      const [session] = await db.execute(
        "SELECT * FROM test_session WHERE id = ?",
        [sessionId],
      );
      if (!session.length) {
        return res.status(404).json({ error: "Sessione di test non trovata" });
      }
      return res.status(200).json(session[0]);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore interno del server", details: error.message });
    }
  }

  if (req.user.role === "admin") {
    try {
      const [session] = await db.execute(
        "SELECT ts.* FROM test_session ts JOIN project p ON ts.project_id = p.id WHERE p.created_by = ? AND ts.id = ?",
        [req.user.id, sessionId],
      );
      if (!session.length) {
        return res.status(404).json({
          error: "Sessione di test non trovata o permessi insufficienti",
        });
      }
      return res.status(200).json(session[0]);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore interno del server", details: error.message });
    }
  }

  if (req.user.role === "user") {
    try {
      const [session] = await db.execute(
        "SELECT ts.* FROM test_session ts WHERE ts.user_id = ? AND ts.id = ?",
        [req.user.id, sessionId],
      );
      if (!session.length) {
        return res.status(404).json({
          error: "Sessione di test non trovata o permessi insufficienti",
        });
      }
      return res.status(200).json(session[0]);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore interno del server", details: error.message });
    }
  }

  return res.status(403).json({ error: "Accesso non consentito" });
});

router.patch("/:id/complete", checkUser, async (req, res) => {
  const sessionId = req.params.id;

  if (!sessionId) {
    return res.status(400).json({ error: "ID sessione non valido" });
  }

  if (req.user.role === "user") {
    try {
      const [session] = await db.execute(
        "SELECT * FROM test_session WHERE id = ? AND user_id = ?",
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
        .json({ error: "Errore interno del server", details: error.message });
    }
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
        .json({ error: "Errore interno del server", details: error.message });
    }
  }

  try {
    const [result] = await db.execute(
      "UPDATE test_session SET status = 'Completata', completed_at = NOW() WHERE id = ?",
      [sessionId],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Sessione di test non trovata o permessi insufficienti",
      });
    }
    return res
      .status(200)
      .json({ message: "Sessione di test completata con successo" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Errore interno del server", details: error.message });
  }
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
        .json({ error: "Errore interno del server", details: error.message });
    }
  }

  try {
    const [result] = await db.execute("DELETE FROM test_session WHERE id = ?", [
      sessionId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Sessione di test non trovata",
      });
    }
    return res
      .status(200)
      .json({ message: "Sessione di test eliminata con successo" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Errore interno del server", details: error.message });
  }
});

router.patch("/:id/reopen", checkAdmin, async (req, res) => {
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
        .json({ error: "Errore interno del server", details: error.message });
    }
  }

  try {
    const [result] = await db.execute(
      "UPDATE test_session SET status = 'In corso', completed_at = NULL WHERE id = ?",
      [sessionId],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Sessione di test non trovata",
      });
    }
    return res
      .status(200)
      .json({ message: "Sessione di test riaperta con successo" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Errore interno del server", details: error.message });
  }
});

module.exports = router;

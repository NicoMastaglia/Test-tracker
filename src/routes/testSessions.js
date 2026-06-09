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
      return res.status(403).json({ error: "Accesso negato" });
    }
  }

  if (req.user.role === "admin") {
    const [adminResults] = await db.execute(
      "SELECT id FROM project WHERE id = ? AND created_by = ?",
      [projectId, testerId],
    );

    if (!adminResults.length) {
      return res.status(403).json({ error: "Accesso negato" });
    }
  }

  let connection;

  try {
    connection = await db.getConnection();

    await connection.beginTransaction();

    const [result] = await connection.execute(
      "INSERT INTO test_session (project_id, user_id) VALUES (?, ?)",
      [projectId, testerId],
    );

    const sessionId = result.insertId;

    const [items] = await connection.execute(
      "SELECT ci.id FROM checklist_template ct JOIN checklist_item ci ON ci.template_id = ct.id WHERE ct.project_id = ? ORDER BY ct.id, ci.position, ci.id",
      [projectId],
    );

    if (items.length > 0) {
      const values = items.map((item) => [sessionId, item.id, 0, null, null]);
      await connection.query(
        "INSERT INTO test_result (session_id, checklist_item_id, is_tested, outcome, note) VALUES ?",
        [values],
      );
    }

    await connection.commit();

    return res.status(201).json({
      id: sessionId,
      message: "Sessione di test creata con successo",
    });
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
        return res.status(404).json({ error: "Nessuna sessione di test trovata" });
      }
      return res.status(200).json(sessions);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore del server", details: error.message });
    }
  }

  if (req.user.role === "admin") {
    try {
      const [sessions] = await db.execute(
        `SELECT ts.id, ts.project_id, ts.user_id, ts.status, ts.started_at, ts.completed_at FROM test_session ts JOIN project p ON ts.project_id = p.id WHERE p.created_by = ? ${hasProject ? "AND p.id = ?" : ""}`,
        hasProject ? [req.user.id, projectId] : [req.user.id],
      );
      if (!sessions.length) {
        return res.status(404).json({ error: "Nessuna sessione di test trovata" });
      }
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
        `SELECT ts.id, ts.project_id, ts.user_id, ts.status, ts.started_at, ts.completed_at FROM test_session ts WHERE ts.user_id = ? ${hasProject ? "AND ts.project_id = ?" : ""}`,
        hasProject ? [req.user.id, projectId] : [req.user.id],
      );
      if (!sessions.length) {
        return res.status(404).json({ error: "Nessuna sessione di test trovata" });
      }
      return res.status(200).json(sessions);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore del server", details: error.message });
    }
  }

  return res.status(403).json({ error: "Accesso negato" });
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
        .json({ error: "Errore del server", details: error.message });
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
        .json({ error: "Errore del server", details: error.message });
    }
  }

  try {
    const [progress] = await db.execute(
      "SELECT COUNT(*) AS total_items, SUM(CASE WHEN is_tested = 1 THEN 1 ELSE 0 END) AS tested_items FROM test_result WHERE session_id = ?",
      [sessionId],
    );

    const totalItems = Number(progress[0]?.total_items || 0);
    const testedItems = Number(progress[0]?.tested_items || 0);

    if (totalItems > 0 && testedItems < totalItems) {
      return res.status(400).json({
        error: "Non tutti gli elementi sono stati testati",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Errore del server", details: error.message });
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
      .json({ error: "Errore del server", details: error.message });
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
        .json({ error: "Errore del server", details: error.message });
    }
  }

  let connection;

  try {
    connection = await db.getConnection();

    await connection.beginTransaction();

    await connection.execute("DELETE FROM test_result WHERE session_id = ?", [
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
        .json({ error: "Errore del server", details: error.message });
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
      .json({ error: "Errore del server", details: error.message });
  }
});

module.exports = router;
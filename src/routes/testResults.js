const express = require("express");
const router = express.Router();
const checkSuperadmin = require("../middleware/checkSuperadmin");
const checkAdmin = require("../middleware/checkAdmin");
const checkUser = require("../middleware/checkUser");
const db = require("../database/db");

function normalizeBoolean(value) {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return 1;
  }

  if (value === false || value === 0 || value === "0" || value === "false") {
    return 0;
  }

  return null;
}

async function getAccessibleSession(sessionId, user, connection = db) {
  if (user.role === "superadmin") {
    const [session] = await connection.execute(
      "SELECT ts.id, ts.project_id, ts.user_id, ts.status, ts.started_at, ts.completed_at FROM test_session ts WHERE ts.id = ?",
      [sessionId],
    );
    return session[0] || null;
  }

  if (user.role === "admin") {
    const [session] = await connection.execute(
      "SELECT ts.id, ts.project_id, ts.user_id, ts.status, ts.started_at, ts.completed_at FROM test_session ts JOIN project p ON ts.project_id = p.id WHERE ts.id = ? AND p.created_by = ?",
      [sessionId, user.id],
    );
    return session[0] || null;
  }

  if (user.role === "user") {
    const [session] = await connection.execute(
      "SELECT ts.id, ts.project_id, ts.user_id, ts.status, ts.started_at, ts.completed_at FROM test_session ts JOIN project_assignment pa ON ts.project_id = pa.project_id WHERE ts.id = ? AND pa.user_id = ?",
      [sessionId, user.id],
    );
    return session[0] || null;
  }

  return null;
}

router.get("/session/:sessionId", checkUser, async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await getAccessibleSession(sessionId, req.user);

    if (!session) {
      return res.status(404).json({
        error: "Sessione di test non trovata o permessi insufficienti",
      });
    }

    const [results] = await db.execute(
      `SELECT
        ci.id AS checklist_item_id,
        ci.template_id,
        ci.description,
        ci.position,
        tr.id AS test_result_id,
        tr.is_tested,
        tr.outcome,
        tr.note
      FROM checklist_template ct
      JOIN checklist_item ci ON ci.template_id = ct.id
      LEFT JOIN test_result tr ON tr.session_id = ? AND tr.checklist_item_id = ci.id
      WHERE ct.project_id = ?
      ORDER BY ct.id, ci.position, ci.id`,
      [sessionId, session.project_id],
    );

    return res.status(200).json({
      session,
      items: results,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Errore del server", details: error.message });
  }
});

router.patch(
  "/session/:sessionId/item/:itemId",
  checkUser,
  async (req, res) => {
    const { sessionId, itemId } = req.params;
    const { is_tested, outcome, note } = req.body;

    if (
      is_tested === undefined &&
      outcome === undefined &&
      note === undefined
    ) {
      return res.status(400).json({ error: "Nessun dato da aggiornare" });
    }

    if (outcome !== undefined && outcome !== null) {
      if (outcome !== "Positivo" && outcome !== "Negativo") {
        return res.status(400).json({ error: "Esito non valido" });
      }
    }

    try {
      const session = await getAccessibleSession(sessionId, req.user);

      if (!session) {
        return res.status(404).json({
          error: "Sessione di test non trovata o permessi insufficienti",
        });
      }

      const [itemResults] = await db.execute(
        `SELECT ci.id
        FROM checklist_template ct
       JOIN checklist_item ci ON ci.template_id = ct.id
       WHERE ct.project_id = ? AND ci.id = ?`,
        [session.project_id, itemId],
      );

      if (!itemResults.length) {
        return res.status(404).json({
          error: "Elemento della checklist non trovato nella sessione",
        });
      }

      const testedValue = normalizeBoolean(is_tested);
      const updates = [];
      const parameters = [];

      if (testedValue !== null) {
        updates.push("is_tested = ?");
        parameters.push(testedValue);

        if (testedValue === 0 && outcome === undefined) {
          updates.push("outcome = NULL");
        }
      }

      if (outcome !== undefined) {
        updates.push("outcome = ?");
        parameters.push(outcome);
      }

      if (note !== undefined) {
        const trimmedNote = (note && note.trim() !== "") ? note.trim() : null;
        updates.push("note = ?");
        parameters.push(trimmedNote);
      }

      if (!updates.length) {
        return res.status(400).json({ error: "Nessun dato valido da aggiornare" });
      }

      parameters.push(sessionId, itemId);

      const [result] = await db.execute(
        `UPDATE test_result SET ${updates.join(", ")} WHERE session_id = ? AND checklist_item_id = ?`,
        parameters,
      );

      if (result.affectedRows === 0) {
        const insertIsTested = testedValue === null ? 0 : testedValue;
        const insertOutcome = outcome !== undefined ? outcome : null;
        const insertNote = note !== undefined ? note : null;

        await db.execute(
          "INSERT INTO test_result (session_id, checklist_item_id, is_tested, outcome, note) VALUES (?, ?, ?, ?, ?)",
          [sessionId, itemId, insertIsTested, insertOutcome, insertNote],
        );
      }

      const [updatedResult] = await db.execute(
        "SELECT id, session_id, checklist_item_id, is_tested, outcome, note FROM test_result WHERE session_id = ? AND checklist_item_id = ?",
        [sessionId, itemId],
      );

      return res.status(200).json(updatedResult[0]);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Errore del server", details: error.message });
    }
  },
);

module.exports = router;
const db = require("../database/db");


// Logga un'attività dell'utente nel database (audit_log) con i dettagli forniti.
async function logActivity(userId, projectId, action, details = null) {
  try {
    await db.execute(
      "INSERT INTO audit_log (user_id, project_id, action, details) VALUES (?, ?, ?, ?)",
      [userId, projectId, action, details ? JSON.stringify(details) : null],
    );
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

module.exports = logActivity;

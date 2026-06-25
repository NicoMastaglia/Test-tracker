const db = require("../database/db");

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

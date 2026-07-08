const db = require("../database/db");

// un token emesso prima dell'ultimo cambio password è considerato "stale":
// permette di invalidare tutti i JWT precedenti (altre schede/dispositivi)
// non appena l'utente cambia password, senza dover tracciare ogni singolo token
async function isTokenStale(userId, tokenIat) {
  const [rows] = await db.execute("SELECT password_changed_at FROM user WHERE id = ?", [userId]);
  if (rows.length === 0 || !rows[0].password_changed_at) return false;
  const changedAtSeconds = Math.floor(new Date(rows[0].password_changed_at).getTime() / 1000);
  return tokenIat < changedAtSeconds;
}

module.exports = { isTokenStale };

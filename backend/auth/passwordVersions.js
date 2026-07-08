

const db = require("../database/db");

// controlla se il token è scaduto 
// confronto tra la data di creazione del token e data modifica della password dell'utente
// tokenIat è il timestamp di creazione del token (in secondi)
async function isTokenStale(userId, tokenIat) {
  const [rows] = await db.execute("SELECT password_changed_at FROM user WHERE id = ?", [userId]);
  if (rows.length === 0 || !rows[0].password_changed_at) return false;

  const changedAtSeconds = Math.floor(new Date(rows[0].password_changed_at).getTime() / 1000);
  // Se il token è stato creato prima della modifica della password = scaduto
  // Se il token è stato creato dopo la modifica della password = valido
  return tokenIat < changedAtSeconds;
}

module.exports = { isTokenStale };
// Denylist in-memory dei token revocati al logout.
// Limite noto: un riavvio del server svuota la lista; i token restano comunque
// validi al massimo fino alla loro scadenza naturale (6h).
const deniedTokens = new Map();

// pulizia periodica: rimuove i token la cui scadenza è passata
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [token, expiresAtMs] of deniedTokens) {
    if (expiresAtMs <= now) {
      deniedTokens.delete(token);
    }
  }
}, CLEANUP_INTERVAL_MS).unref();

function denyToken(token, expiresAtSeconds) {
  const expiresAtMs = expiresAtSeconds
    ? expiresAtSeconds * 1000
    : Date.now() + 6 * 60 * 60 * 1000;
  deniedTokens.set(token, expiresAtMs);
}

function isTokenDenied(token) {
  const expiresAtMs = deniedTokens.get(token);
  if (expiresAtMs === undefined) return false;
  if (expiresAtMs <= Date.now()) {
    deniedTokens.delete(token);
    return false;
  }
  return true;
}

module.exports = { denyToken, isTokenDenied };

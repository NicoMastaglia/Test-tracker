# Convenzioni e valori configurabili

Questo documento elenca le scelte fatte durante lo sviluppo che sono **arbitrarie e modificabili a piacimento** (non vincoli tecnici), con il punto esatto del codice dove intervenire se si vuole cambiarle. Non è una guida di setup (per quella vedi `README.md`), ma un riferimento rapido per chi riprende il progetto.

## Autenticazione e sicurezza

- **Durata del token JWT**: `"6h"`, hardcoded in `backend/auth/generateToken.js` (opzione `expiresIn`). Non è letta da variabile d'ambiente: per cambiarla va modificato il codice e riavviato il backend.
- **Lunghezza minima password**: 8 caratteri, controllata in **3 punti indipendenti** nel backend (nessuna costante condivisa, se si cambia va aggiornata in tutti e tre):
  - `backend/routes/auth.js` — bootstrap del primo superadmin.
  - `backend/routes/auth.js` — completamento setup/reset password tramite token via email.
  - `backend/routes/users.js` — cambio password del proprio account.
- **Domini email ammessi**: solo `gmail.com` ed `example.com`/`example` (pensato per sviluppo/demo, non per produzione). Definiti **due volte**, senza fonte condivisa:
  - `frontend/src/utils/helpers/validators.js` (`ALLOWED_DOMAINS`)
  - `backend/utils/validators.js` (`ALLOWED_DOMAINS`)
  
  Se si aggiunge un dominio, va aggiornato in entrambi i file, altrimenti un utente potrebbe aggirare il controllo frontend e registrarsi con un dominio non validato lato server (o viceversa, essere bloccato lato client per un dominio che il server accetterebbe).
- **Denylist token JWT**: solo in memoria (`backend/auth/tokenDenylist.js`), non persistita su DB. Un riavvio del backend riabilita i vecchi token già "sloggati" fino alla loro scadenza naturale (max 6h).


## Audit log

- **Limite risultati**: 500 eventi massimo per richiesta.
  - Backend: `backend/routes/auditLog.js` (`Math.min(Number(req.query.limit) || 50, 500)` — default 50, cap 500).
  - Frontend: `frontend/src/pages/admin/AuditLog.jsx` (costante `AUDIT_FETCH_LIMIT`, allineata manualmente al cap backend). Un banner avvisa l'utente quando i risultati raggiungono il limite, per non far credere che la lista sia completa.
- **Azioni tracciate**: 31 in totale, mappate in `frontend/src/utils/helpers/auditActions.js` (oggetto `auditActions`), raggruppate per categoria:
  - **Auth** (4): login, logout, richiesta reset password, bootstrap superadmin.
  - **Users** (3): registrazione, aggiornamento, eliminazione utente.
  - **Projects** (6): creazione, aggiornamento, cambio stato, assegnazione/rimozione tester dal team, eliminazione.
  - **Checklist** (3): creazione, aggiornamento, eliminazione.
  - **Task** (11): creazione, aggiornamento, eliminazione, assegnazione/rimozione assegnazione, blocco/sblocco, archiviazione/ripristino, cambio stato, riapertura esito.
  - **Sessions** (4): creazione, completamento, riapertura, eliminazione.
  
  Per aggiungere una nuova azione tracciata: chiamare `logActivity(...)` nel backend con una nuova chiave (es. `"foo.bar"`), poi aggiungere la stessa chiave in `auditActions.js` con label/icona/colore — altrimenti l'evento compare comunque nel log ma con etichetta grezza e icona generica (fallback).

## Email

5 tipi di template disponibili, definiti in `backend/utils/emailTemplates.js` e inviati tramite `sendProjectEmail(user, type, options)` in `backend/utils/sendEmail.js`:

| Tipo | Quando viene inviata |
|---|---|
| `setupPassword` | Nuovo utente creato dal superadmin, oppure richiesta "password dimenticata" da un account che non ha mai impostato una password. |
| `resetPassword` | Richiesta "password dimenticata" da un account che ha già una password impostata. |
| `projectAssignment` | Un tester viene assegnato al team di un progetto. |
| `taskAssignment` | Una task viene assegnata a un tester. |
| `sessionReopened` | Un admin/superadmin riapre una sessione di test completata. |

Per aggiungere un nuovo tipo: aggiungere una entry in `htmlContent` (`emailTemplates.js`) e richiamare `sendProjectEmail` con la nuova chiave nel punto del backend dove serve.




## Tabelle

- **Righe per pagina**: 10 di default in `frontend/src/utils/components/StandardTable.jsx` (prop `pageSize`). Nessuna pagina dell'app lo sovrascrive, quindi tutte le tabelle usano questo valore.



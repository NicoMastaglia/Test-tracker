# Backend — Test Tracker

Express + MySQL2. **L'entry point è `index.js` nella root del progetto**, non qui: questa cartella contiene solo la logica applicativa (routes, middleware, auth, utils, swagger), richiesta da `../index.js`. Non esiste un `package.json` separato per il backend — le dipendenze e gli script sono quelli della root (vedi [`../README.md`](../README.md) per installazione/avvio/`.env`).

## Struttura

```
backend/
├── routes/            # una rotta Express per risorsa, montate in ../index.js
│   ├── main.js         # redirect di cortesia + fallback 404
│   ├── auth.js          # register, setup account, forgot-password, verify-setup-token, login, logout
│   ├── users.js         # CRUD utenti (self-service /me + gestione admin/superadmin)
│   ├── projects.js      # progetti, team, stats, activities
│   ├── checklists.js    # checklist template + task (assegnazione, stato, blocco/sblocco)
│   ├── testSessions.js  # sessioni di test e risultati task
│   └── auditLog.js      # log attività globale (superadmin)
├── middleware/
│   ├── checkUser.js       # richiede un JWT valido, qualunque ruolo
│   ├── checkAdmin.js      # richiede ruolo admin o superadmin
│   └── checkSuperadmin.js # richiede ruolo superadmin
├── auth/
│   ├── generateToken.js   # firma il JWT di accesso (scadenza fissa, vedi sotto)
│   └── hash.js             # bcrypt hash/verify password
├── database/
│   └── db.js               # pool di connessione mysql2
├── utils/
│   ├── logActivity.js      # scrive una riga in audit_log (usato da quasi tutte le routes)
│   ├── mailer.js            # wrapper nodemailer (transport SMTP)
│   ├── sendEmail.js         # sendProjectEmail(user, type, options) — sceglie il template e invia
│   ├── emailTemplates.js    # HTML delle email (layout condiviso + 4 varianti)
│   └── setupToken.js        # genera/hasha i token di setup/reset password
└── swagger/
    └── swagger.json         # documentazione OpenAPI, manuale — vedi nota sotto
```

## Ruoli e permessi

Gerarchia: `superadmin` > `admin` > `user` (tester). Applicata via middleware su ogni rotta:

- `checkUser` — chiunque sia loggato (es. il tester che vede le proprie task/sessioni)
- `checkAdmin` — admin o superadmin (gestione progetti, checklist, task)
- `checkSuperadmin` — solo superadmin (gestione utenti, audit log globale, registrazione nuovi account)

Un `admin` vede solo i progetti che ha creato o di cui è responsabile (`created_by`/`manager_id`); un `superadmin` vede tutto. Questo filtro è applicato query per query nelle singole rotte, non centralizzato.

## Autenticazione e account

Non esiste un flusso di registrazione self-service: solo il superadmin crea nuovi utenti (`POST /api/auth/register`), **senza password**. Il nuovo utente riceve un'email con un link di setup (`/setup?token=...`, gestito lato frontend) valido 48 ore, generato da `setupToken.js` e salvato hashato (SHA-256) nella tabella `password_setup_token`.

Lo stesso meccanismo serve per il reset password (`POST /api/auth/forgot-password`): la risposta è identica indipendentemente dal fatto che l'email esista o meno (per non rivelare quali account sono registrati); se esiste, invalida gli eventuali token non ancora usati e ne genera uno nuovo. `GET /api/auth/verify-setup-token` permette al frontend di controllare se un token è ancora valido senza consumarlo (utile per non ripresentare il form dopo che è già stato usato).

Il JWT di accesso (`generateAccessToken`) scade dopo **6 ore fisse**, nessun refresh token, nessuna logica di inattività. Il frontend non ha oggi un interceptor centralizzato che intercetti un 401 da token scaduto (vedi nota nel README del frontend).

## Email

`sendProjectEmail(user, type, options)` in `sendEmail.js` è il punto d'ingresso unico per ogni email transazionale. `type` seleziona il template in `emailTemplates.js`:

| type | Quando | 
|---|---|
| `setupPassword` | Nuovo utente creato, o "password dimenticata" da un account senza password impostata |
| `resetPassword`  | "Password dimenticata" da un account che ha già una password |
| `projectAssignment` | Utente assegnato a un progetto |
| `taskAssignment` | Task assegnata a un utente |

Tutti i template condividono lo stesso layout HTML (`emailLayout` in `emailTemplates.js`) per coerenza visiva; cambia solo colore accento, titolo e corpo.

## Audit log

Ogni azione rilevante (creazione/modifica/eliminazione progetti, checklist, task, sessioni, login/logout, ecc.) viene registrata via `logActivity(userId, projectId, action, details)` nella tabella `audit_log`. `GET /api/audit-log` (superadmin) e `GET /api/projects/:id/activities` supportano `limit`, `dateFrom`, `dateTo` come query param per filtrare senza dover caricare l'intera tabella.

## Documentazione Swagger

`backend/swagger/swagger.json` è scritto e mantenuto **a mano** — non è generato da annotazioni nel codice. Ogni volta che si aggiunge, modifica o rimuove una rotta (path, metodo, body, risposte), va aggiornato manualmente questo file, altrimenti la documentazione su `/api-docs` diventa disallineata dal comportamento reale delle API.

## Convenzioni

- Colonne utente in italiano nel DB e nelle richieste (`nome`, `cognome`), non `name`/`surname` — attenzione quando si aggiungono nuove rotte, per coerenza con lo schema esistente.
- Gli stati di progetto/task/checklist sono stringhe italiane (`"Attivo"`, `"In pausa"`, `"Completato"`, `"Bloccata"`, `"Archiviata"`, `"TODO"`, `"In corso"`, `"Completata"`), confrontate per uguaglianza esatta in tutto il codice — non case-insensitive.
- Un progetto `"Completato"` blocca ogni modifica a checklist/task/sessioni; un progetto `"In pausa"` blocca solo le **nuove** sessioni/checklist/task e le transizioni di stato, non le azioni già in corso (assegna/rimuovi membri, modifica descrizioni).

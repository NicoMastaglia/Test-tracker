# Test Tracker

Applicazione per la gestione di progetti, checklist di test, sessioni di test e audit log, con tre ruoli utente: **superadmin**, **admin**, **user** (tester).

Il repository contiene due parti:

- **Backend** — Express + MySQL2, vive nella **root del progetto** (`index.js` + `package.json` qui), con la logica applicativa nella cartella [`backend/`](backend/README.md).
- **Frontend** — React 19 + Vite, applicazione separata nella cartella [`frontend/`](frontend/README.md), con proprio `package.json`.

> Nota: non esiste una cartella `backend` con un proprio `package.json` — il server Express è avviato da `index.js` in root, che richiede i file sotto `backend/`. Questo README copre il setup di entrambi; per i dettagli specifici vedi i README dedicati linkati sopra.

## Prerequisiti

- Node.js v18+ (richiesto da Vite 8 e dalle dipendenze del frontend)
- MySQL/MariaDB in esecuzione, con un database già creato
- Un account SMTP per l'invio email (Mailtrap in sviluppo, Gmail/altro provider in produzione)

## Installazione

Il backend (root) e il frontend hanno dipendenze separate, vanno installate entrambe:

```bash
npm install                    # dipendenze backend (root)
npm --prefix frontend install  # dipendenze frontend
```

## Configurazione

Creare un file `.env` nella **root del progetto** (non dentro `frontend/`) con queste variabili:

```env
# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Auth
JWT_SECRET=una_chiave_lunga_e_segreta

# Email (setup account, reset password, notifiche assegnazione)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
MAIL_FROM="Test Tracker <noreply@test-tracker.local>"
```

`FRONTEND_URL` è usato sia per la configurazione CORS sia per costruire i link nelle email (setup account, reset password) — deve puntare all'URL su cui gira il frontend (es. `http://localhost:5173` in sviluppo).

Il frontend legge l'URL del backend da una variabile propria; vedi [`frontend/README.md`](frontend/README.md) per i dettagli (di default punta a `http://localhost:3000` se non configurata).

## Avvio in sviluppo

Backend e frontend vanno avviati separatamente (due processi):

```bash
npm run start                  # backend, da root — nodemon su index.js
npm --prefix frontend run dev  # frontend, Vite dev server
```

In alternativa, uno dei due comandi qui sotto avvia entrambi insieme:

```bash
npm run dev:all                 # un solo terminale, output interlacciato (concurrently)
```
```powershell
.\scripts\start-dev.ps1         # Windows: apre due finestre PowerShell separate
```

## Documentazione API

Una volta avviato il backend, la documentazione Swagger interattiva è disponibile su:

```
http://localhost:3000/api-docs
```

Va aggiornata manualmente (`backend/swagger/swagger.json`) ogni volta che si aggiunge, modifica o rimuove una rotta — non è generata automaticamente dal codice.

## Struttura del repository

```
Test-tracker/
├── index.js              # entry point del backend (Express)
├── package.json           # dipendenze e script del backend
├── backend/                # logica applicativa del backend (routes, middleware, auth, utils, swagger)
├── frontend/               # applicazione React + Vite (progetto separato)
├── scripts/
│   └── start-dev.ps1       # avvia backend + frontend in due finestre (Windows)
└── plans/                  # documenti di progettazione/roadmap interni
```

Per i dettagli su singole cartelle, rotte disponibili e convenzioni di ciascuna parte, vedi:
- [`backend/README.md`](backend/README.md)
- [`frontend/README.md`](frontend/README.md)

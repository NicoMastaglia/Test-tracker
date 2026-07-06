# Frontend — Test Tracker

React 19 + Vite 8, Tailwind CSS v4, shadcn/ui (su radix-ui). Applicazione separata dal backend, con proprio `package.json` — vedi [`../README.md`](../README.md) per il quadro d'insieme del repository.

## Installazione

```bash
npm install
```

## Configurazione

Il frontend legge l'URL del backend da una variabile d'ambiente Vite. Creare un file `.env` in questa cartella (`frontend/.env`, **non** nella root del repo):

```env
VITE_BACKEND_URL=http://localhost:3000
```

Se non impostata, di default punta a `http://localhost:3000` (vedi `src/services/config.js`).

## Avvio

```bash
npm run dev       # dev server Vite, con hot reload
npm run build     # build di produzione in dist/
npm run preview   # serve la build di produzione in locale
npm run lint      # ESLint su src/
```

Il backend va avviato separatamente (vedi [`../README.md`](../README.md)).

## Struttura

```
src/
├── pages/                # una pagina per rotta (admin/, user/, shared/, auth/)
├── Components/
│   ├── features/          # componenti legati a un dominio (projects, users, audit, settings, ...)
│   ├── layout/             # AppLayout, Sidebar, Header
│   └── ui/                  # primitive shadcn/ui (Button, Dialog, Select, ...) — generate, non modificare a mano
├── context/               # un Context+Provider per dominio (Auth, User, Project, Checklist, Session, Task, Audit)
├── services/               # chiamate axios verso il backend, un file per dominio
├── utils/
│   ├── components/          # componenti generici riusabili (StandardTable, ModalForm, StatsCardsRow, ...)
│   ├── helpers/              # funzioni pure (formattazione, validazione, badge di stato, export Excel/PDF)
│   └── fields/                # definizioni dei campi per i form generici (ModalForm)
├── Router/                 # AppRouter (route pubbliche/protette) + ProtectedRoute
├── dashboard/               # le 3 dashboard per ruolo (SuperAdmin, Admin, User)
└── hooks/                   # hook custom (es. useIsMobile)
```

## Pattern architetturali

- **Context per dominio**: ogni Context espone sia il `Provider` sia un hook `useXContext()` dallo stesso file. 
- **Reducer + dispatch**: ogni context usa `useReducer` con azioni tipizzate per stringa (`SET_LOADING`, `SET_ERROR`, ecc.), niente librerie esterne di state management.
- **`ModalForm`** (`utils/components/ModalForm.jsx`): form generico guidato da un array di `fields` (vedi `utils/fields/`) — usato per la maggior parte delle create/edit modal. Per flussi con logica non riconducibile a un campo per form (es. selezione progetto → task multiple nella creazione sessione) si preferisce un componente dedicato invece di forzare `ModalForm`.
- **`StandardTable`** (`utils/components/StandardTable.jsx`): tabella paginata riusabile, con una `*Row.jsx` dedicata per ogni dominio (es. `AdminSessionRow.jsx`, `ProjectRow.jsx`).

- **Export dati**: `xlsx` e `jspdf`/`jspdf-autotable` per l'export di sessioni/report in Excel e PDF, generato interamente lato client (vedi `utils/helpers/exportSessionReport.js` e `exportSessionsList.js`).



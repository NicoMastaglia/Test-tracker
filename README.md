# Test Tracker

Prerequisiti

- Node.js v16+ installato

Installazione

```bash
npm install
```

Configurazione

1. Creare un file `.env` nella root del progetto con queste variabili minime:

```
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=una_chiave_lunga_e_segreta
```

Avvio

```bash
npm start
```

Note

- La lista delle rotte è disponibile su /api-docs

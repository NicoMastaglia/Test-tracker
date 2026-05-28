# Test Tracker


- frontend React + Vite nella cartella `public`


## Variabili d'ambiente backend

Il backend legge queste variabili dal file `.env` nella root:

- `PORT` opzionale, default `3000`
- `FRONTEND_URL` URL del frontend, ad esempio `http://localhost:5173`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## Installazione

Apri un terminale nella root del progetto e installa le dipendenze del backend:

```bash
npm install
```

Poi apri un secondo terminale nella cartella `public` e installa le dipendenze del frontend:

```bash
cd public
npm install
```

## Avvio

Backend:

```bash
npm start
```

Il server parte di default su `http://localhost:3000`.

Frontend:

```bash
cd public
npm run dev
```

Vite parte di default su `http://localhost:5173`.

## Note rapide

- Se il frontend non comunica con il backend, controlla `FRONTEND_URL` nel `.env`.
- Le API sono disponibili sotto `http://localhost:3000/api`.
- La documentazione Swagger è su `http://localhost:3000/api-docs`.

# Frontend (public/src)

Questo folder contiene il codice client (React + Vite) del progetto.

Convenzioni rapide:

- Componenti React: PascalCase (`MyComponent.jsx`).
- Cartelle per feature: `Components/features/<feature>/` con `index.js` per esportare i componenti.
- Helpers/util: `utils` (non `utilis`).
- Context: usare nomi di cartelle senza punti, es. `context/Auth`.
- UI primitives: `Components/ui` con barrel file `index.js`.

Comandi:

```
# dalla root del progetto frontend
npm install
npm run dev
```

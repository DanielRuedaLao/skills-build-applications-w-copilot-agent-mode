# Octofit Tracker frontend

React 19, Vite, React Router and Bootstrap presentation tier. For full setup, demo accounts, and API routes, see [the application guide](../README.md).

## Run locally

```sh
npm install --prefix octofit-tracker/frontend
npm run dev --prefix octofit-tracker/frontend
```

The frontend uses `http://localhost:8000/api` by default. In Codespaces, set `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` to the Codespace name; the client will use `https://<name>-8000.app.github.dev/api`. Restart Vite after changing the file. The backend must be available on port `8000`.
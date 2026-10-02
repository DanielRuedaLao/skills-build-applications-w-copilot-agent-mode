# Octofit presentation tier

React 19, Vite and React Router presentation tier for Octofit Tracker.

## Run locally

```sh
npm install --prefix octofit-tracker/frontend
npm run dev --prefix octofit-tracker/frontend
```

## API URL

In Codespaces, define `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local`:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

The API base is `https://<VITE_CODESPACE_NAME>-8000.app.github.dev/api`. Restart Vite after editing `.env.local`. If unset, the frontend uses `http://localhost:8000/api`. The backend must be running on port `8000`.
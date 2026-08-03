# DocLean Deployment Guide

This guide details how to host both the React frontend and FastAPI backend for the DocLean hackathon submission.

---

## 🖥️ 1. Hosting the Backend (FastAPI)

Since the backend communicates with the Paritok API and the 0G Compute decentralized network using your private API credentials, it should be hosted on a cloud server environment (such as **Render**, **Railway**, **Heroku**, or a **digital VPS**).

### A. Deploy via Railway (Recommended)
1.  Sign in to [Railway.app](https://railway.app).
2.  Click **New Project** -> **Deploy from GitHub repo**.
3.  Select your repository.
4.  Add the following **Environment Variables** in Railway's Settings tab:
    ```env
    PORT=8000
    PARITOK_API_KEY=pk_live_iqkn9k5Csp8IkEYkHim5trSXTGRQnrZb
    0G_API_KEY=app-sk-eyJhZGRyZXNzIjoiMHgxMjc5M2NBNGY0OTVmNTI1NUM0MjMxMjhiMUVEOUNkNzFCMDgwMjNEIiwicHJvdmlkZXIiOiIweGY1NmZBYWY5OTg5YURhZkREZjI2ZmE1RmZkZDAzYTlBMjdiMzhmQUUiLCJ0aW1lc3RhbXAiOjE3ODU3NzIxMTU2NDQsImV4cGlyZXNBdCI6MCwibm9uY2UiOiI5YmIzYWU4MjU1YmI4YTRjYTNkNGQ0ODUwZDg4ZDNiNCIsImdlbmVyYXRpb24iOjAsInRva2VuSWQiOjF9fDB4MDU0YmQ4MzQzZjc4ZmMwMTM5NmEyYjdiNTVkMjE1ODAxYjUwMGMxMmZlMjY4MzFlOWZjNjBlNmI5M2MwM2IwNjJlOTU4ZDYwOTQzYjY1ZTVmYjI3ODhiMjI3NTk3M2EyNjcyM2E4YzU2YWYzNzcyZjc5MGY3NGE0Y2VhZTBhYWIxYg==
    0G_MODEL=0GM-1.0-35B-A3B-SIA
    0G_ENDPOINT=https://compute-network-29.integratenetwork.work/v1/proxy/chat/completions
    ```
5.  Railway will automatically detect the `requirements.txt` file in `backend/` and start the server using `uvicorn main:app --host 0.0.0.0 --port $PORT`.
6.  Copy the generated backend public URL (e.g. `https://docsense-backend.up.railway.app`).

---

## 🎨 2. Hosting the Frontend (Vite + React)

The frontend is a static React application and can be hosted for **free** on platforms like **Vercel**, **Netlify**, or **GitHub Pages**.

### A. Update the Backend URL
Before deploying, open `frontend/src/App.jsx` and change the fetch endpoints from localhost to your newly deployed public backend URL:

```javascript
// Replace localhost with your live Railway URL:
const BACKEND_URL = "https://docsense-backend.up.railway.app"; 

// Update fetches in App.jsx:
const res = await fetch(`${BACKEND_URL}/api/metrics`);
const res = await fetch(`${BACKEND_URL}/api/upload`, ...);
const res = await fetch(`${BACKEND_URL}/api/query`, ...);
```

### B. Deploy via Vercel (Recommended)
1.  Install Vercel CLI or log in to [Vercel.com](https://vercel.com).
2.  Click **Add New** -> **Project** -> import your GitHub repository.
3.  Set the **Root Directory** setting to `frontend`.
4.  Click **Deploy**.
5.  Vercel will build the React bundle using `npm run build` and publish it to a custom URL (e.g. `https://doclean.vercel.app`).

---

## ⚡ Hackathon Submission Requirements Checklist

1.  **Repository**: Push the project folder to GitHub. Ensure `backend/.env` is ignored by `.gitignore` to keep credentials secure.
2.  **Live Demo URL**: Submit the live Vercel frontend URL.
3.  **Video Walkthrough**: Record a 2-minute demo showing:
    *   Pasting or uploading a document (PDF/text).
    *   Asking a query and showing the live timeline.
    *   Highlighting the **97%+ Token Savings** and estimated costs saved using **Paritok**.
    *   Explaining that inference executes on **0G Labs' decentralized compute network**.

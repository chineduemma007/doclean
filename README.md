# DocLean - Token-Efficient Context-Compressed Document AI Reviewer

[![Built with Paritok](https://img.shields.io/badge/Built%20with-Paritok-1f2d3d)](https://github.com/Paritok-official/paritok-4b-v1)

DocLean is an AI-powered document review system that lets you paste raw text or upload any PDF, article, or brochure to analyze it instantly. 

By combining **Paritok's Context Compression Model** with **0G Labs' Decentralized Compute Network**, DocLean strips away up to 95%+ of irrelevant boilerplate context *before* executing LLM inference. This slashes API token bills, optimizes latency, and increases the effective context window of decentralized node models.

Built for the **Build with Paritok: The Token-Efficiency Hackathon**.

---

## ⚡ Tech Stack & Architecture

*   **Frontend**: React (Vite) styled with Vanilla CSS (Glassmorphism design system).
*   **Backend**: FastAPI (Python) with `pypdf` for clean document text extraction.
*   **Compression Model**: Paritok (`Paritok-4B-v1` via hosted API).
*   **Inference Model**: 0G Labs Decentralized Network (`0GM-1.0-35B-A3B-SIA` proxy).

---

## 📏 Specifications & Optimal Limits

*   **Optimal Context Size**: Up to **8,000 tokens** (~6,000 words) of text or PDF content.
*   **High-Context Timeout Protection**: If the Paritok compression step exceeds 20 seconds (e.g. for extremely long documents), the backend automatically falls back to forwarding the uncompressed context to 0G Compute, preventing user-facing crashes.

---

## 🚀 Setup & Execution Guide

### Prerequisite
Ensure you have Node.js (v18+) and Python (v3.9+) installed.

### 💻 1. Backend Setup (FastAPI)
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment and activate it:
    ```bash
    python -m venv .venv
    # On Windows:
    .venv\Scripts\activate
    # On macOS/Linux:
    source .venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the `backend/` folder:
    ```env
    PARITOK_API_KEY=pk_live_iqkn9k5Csp8IkEYkHim5trSXTGRQnrZb
    0G_API_KEY=app-sk-eyJhZGRyZXNzIjoiMHgxMjc5M2NBNGY0OTVmNTI1NUM0MjMxMjhiMUVEOUNkNzFCMDgwMjNEIiwicHJvdmlkZXIiOiIweGY1NmZBYWY5OTg5YURhZkREZjI2ZmE1RmZkZDAzYTlBMjdiMzhmQUUiLCJ0aW1lc3RhbXAiOjE3ODU3NzIxMTU2NDQsImV4cGlyZXNBdCI6MCwibm9uY2UiOiI5YmIzYWU4MjU1YmI4YTRjYTNkNGQ0ODUwZDg4ZDNiNCIsImdlbmVyYXRpb24iOjAsInRva2VuSWQiOjF9fDB4MDU0YmQ4MzQzZjc4ZmMwMTM5NmEyYjdiNTVkMjE1ODAxYjUwMGMxMmZlMjY4MzFlOWZjNjBlNmI5M2MwM2IwNjJlOTU4ZDYwOTQzYjY1ZTVmYjI3ODhiMjI3NTk3M2EyNjcyM2E4YzU2YWYzNzcyZjc5MGY3NGE0Y2VhZTBhYWIxYg==
    0G_MODEL=0GM-1.0-35B-A3B-SIA
    0G_ENDPOINT=https://compute-network-29.integratenetwork.work/v1/proxy/chat/completions
    ```
5.  Start the backend server:
    ```bash
    python main.py
    ```
    *(The backend will start at `http://127.0.0.1:8000`)*

### 🎨 2. Frontend Setup (React)
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
    *(The frontend will start at `http://localhost:5173`)*

---

## 🛠️ Open-Source Feedback & Recommendations
Our development log with feedback and bugs encountered regarding the Paritok API is documented here:
*   [bugs_and_feedback.md](bugs_and_feedback.md)

---

## 📄 License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

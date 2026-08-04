# DocLean - Token-Efficient Context-Compressed AI Document Reviewer

[![Built with Paritok](https://img.shields.io/badge/Built%20with-Paritok-1f2d3d)](https://github.com/Paritok-official/paritok-4b-v1)

Built with [Paritok](https://github.com/Paritok-official/paritok-4b-v1).

DocLean is an AI-powered document review system designed to make large-scale document analysis economically viable. By leveraging **Paritok's Context Compression Model** alongside **0G Labs' Decentralized Compute Network**, DocLean dynamically filters out redundant details *before* sending requests for inference, slashing costs and latency while preserving full answer quality.

---

## 💡 The Core Story: Solving Two Problems for Two Audiences

Building production-ready AI document analyzers requires addressing two distinct challenges: the user experience bottleneck and the infrastructure cost bottleneck.

### 👤 1. The User's Problem (Solved by DocLean)
* **Who**: Students, investors, analysts, researchers, and enterprises.
* **The Problem**: Long PDFs, manuals, and reports take too long to read. Critical insights are buried, and reading a 100-page document to find a single answer is a massive waste of time.
* **The Solution**: **DocLean** provides a high-fidelity interface where users can upload any document, ask natural language questions, and receive accurate, structured answers instantly without reading a single page.

### ⚙️ 2. The Builder's Problem (Solved by Paritok)
* **Who**: DocLean developers and any company running AI document analysis at scale.
* **The Problem**: Shipping a 100-page document context to the LLM on every user query consumes a massive number of input tokens. Because inference cost scales linearly with context size, operating costs scale unsustainably as user activity grows.
* **The Solution**: **Paritok** functions as a cognitive context compression layer. It sits between the user's document and the LLM, analyzing the query to strip out irrelevant text, boilerplate, and noise *before* the prompt reaches the LLM. This slashes token volume, reducing inference costs by up to 90%+ with zero loss in answer quality.

---

## 🏗️ Technical Architecture & Data Pipeline

DocLean separates the user-facing reading problem from the developer-facing infrastructure problem, leveraging Paritok and 0G Labs to scale affordably:

```mermaid
graph TD
    subgraph "User Experience (DocLean)"
        A["👤 User: 'I need to understand this document quickly'"] -->|1. Upload Document / Ask Question| B["💻 DocLean App"]
    end

    subgraph "Infrastructure Efficiency (Paritok & 0G)"
        B -->|2. Large Context + Query| C["⚡ Paritok Context Compression Layer"]
        C -->|'We need to keep inference affordable'| D["⚙️ Cognitive Prompt Shrinker"]
        D -->|3. Compressed Context 90%+ Slashed| E["🧠 0G Labs Decentralized Inference"]
        E -->|4. Generate Answer| F["✨ Optimized AI Response"]
    end

    F -->|5. Return accurate answer| B
```

### Key Technical Roles:
*   **Paritok (`Paritok-4B-v1`)**: The prompt shrinker. It reads the document context, identifies the specific question asked, and strips out boilerplate text, headers, and irrelevant paragraphs, reducing token size by up to 97%.
*   **0G Labs (`0GM-1.0-35B-A3B-SIA`)**: The inference engine. It runs the compressed context on its decentralized compute network to generate high-fidelity reasoning answers.
*   **DocLean**: The application layer. It parses files, manages the dynamic compression diff logs, monitors token savings, and provides the visual interface.

---

## 🎯 Target Audience (A Universal Use Case)
Unlike niche developer tools, DocLean provides value to anyone who receives a 100-page PDF and just wants answers:

*   **🎓 Students**: Review textbooks, lecture notes, and study guides efficiently.
*   **💼 Investors**: Analyze pitch decks, annual reports, and financial statements in seconds.
*   **🚀 Founders**: Speed up competitor analysis, market reports, and RFP responses.
*   **⚖️ Lawyers**: Extract clauses, terms, and conditions from long contracts.
*   **🔬 Researchers**: Query academic publications and retrieve methodology summaries.
*   **🤝 Recruiters & HR**: Review large batches of CVs, resumes, and employee handbooks.
*   **📈 Sales Teams**: Cross-reference product brochures and sales documentation.

---

## ⚡ Specifications & Fallback Protections

*   **Optimal Context Limit**: Up to **8,000 tokens** (~6,000 words) of text or PDF content.
*   **Timeout Bypass**: If Paritok compression takes longer than 20 seconds, the backend automatically catches the timeout and forwards the uncompressed document directly to 0G Compute, guaranteeing a successful response.
*   **Real-time Diff Tracker**: A dynamic algorithm in the backend compares the original document against the compressed output on every request, displaying the exact lines removed vs. preserved in the dashboard UI.

---

## 🚀 Setup & Execution Guide

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
    0G_API_KEY=your_0g_api_key
    0G_MODEL=0GM-1.0-35B-A3B-SIA
    0G_ENDPOINT=https://compute-network-29.integratenetwork.work/v1/proxy/chat/completions
    ```
5.  Start the backend server:
    ```bash
    python main.py
    ```

### 🎨 2. Frontend Setup (React)
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 📄 License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

# DocLean Hackathon Log: Paritok Bugs, Limits & Developer Feedback

This document compiles technical bugs, performance limits, and system feedback related specifically to the **Paritok Context Compression API** encountered during the development of DocLean.

---

## ⚡ Paritok System Specifications & Limits

### 1. Maximum Context Word/Token Limits
*   **Paritok Context Limit**: The underlying model (`Paritok-4B`) has a model context window of **8,192 tokens** (roughly **6,000 words** of text or code content).
*   **Optimal Compression Range**: To ensure prompt execution, input context should be kept below **8,000 tokens** (approx. **6,000 words**).
*   **Above Limit Behavior**: When inputs exceed this size, compression processing overhead increases significantly, risking HTTP/HTTPS connection timeouts.

---

## 📂 Active Bug Log & Resolutions

### Bug A: Paritok API Read Timeout on Large Contexts
*   **Symptom**: Querying large documents (e.g., `10.pdf` with **9,176 tokens** / **5,276 words**) yields a **0% compression ratio** (uncompressed) in the logs.
*   **Root Cause**: The hosted Paritok compression endpoint (`https://www.paritok.com/api/compress`) took longer than the default 20-second connection timeout limit to analyze the 9,176 tokens.
*   **Resolution / Workaround**: Implemented a connection timeout handler in the backend (`backend/main.py`). If the Paritok API times out, the backend catches the error and automatically forwards the **original uncompressed text** to the downstream model (0G Compute) to prevent a user-facing failure.

---

## 💡 Developer Feedback for Paritok Team

1.  **Async/Streaming Compression Endpoint**: For contexts larger than 8,000 tokens, a synchronous blocking API call is prone to timeouts. Providing an asynchronous endpoint (where the client submits the document and polls for the compressed context) would prevent timeouts.
2.  **Context Chunking**: When document contexts exceed 8,000 tokens, it would be beneficial for the Paritok client library to automatically split the document into semantic chunks, compress them independently, and merge the result.
3.  **Configurable Compression Ratio**: Permit developers to specify a target compression strength (e.g., *low, medium, high*) in the API payload to trade off latency vs. savings.

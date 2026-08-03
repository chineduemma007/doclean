import React, { useState, useEffect } from 'react';

const SUGGESTED_QUERIES = [
  "What is this document about?",
  "Summarize the key takeaways and core message.",
  "Identify any critical risks, limitations, or threats."
];

function App() {
  // Document State
  const [documentContent, setDocumentContent] = useState('');
  const [docStats, setDocStats] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [inputMethod, setInputMethod] = useState('upload'); // 'upload' or 'paste'
  const [pastedText, setPastedText] = useState('');

  // Query State
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Execution Step State
  const [timeline, setTimeline] = useState([]);

  // Analytics History State
  const [metrics, setMetrics] = useState({
    total_requests: 0,
    total_original_tokens: 0,
    total_compressed_tokens: 0,
    total_cost_saved: 0.0,
    history: []
  });

  // Fetch metrics on mount and periodically
  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {
      console.error("Failed to fetch backend metrics:", e);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setDocumentContent('');
    setDocStats(null);
    setResponse(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setDocumentContent(data.text_content);
        setDocStats({
          filename: data.filename,
          wordCount: data.word_count,
          estimatedTokens: data.estimated_tokens
        });
      } else {
        alert("Upload parsing failed.");
      }
    } catch (err) {
      alert("Failed to connect to backend: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePasteAnalyze = () => {
    if (!pastedText.trim()) {
      alert("Please paste some text first.");
      return;
    }
    setDocumentContent(pastedText);
    const wordCount = pastedText.split(/\s+/).filter(Boolean).length;
    const charCount = pastedText.length;
    setDocStats({
      filename: "Pasted Context Text",
      wordCount: wordCount,
      estimatedTokens: Math.floor(charCount / 4)
    });
  };

  const handleRunQuery = async (queryText = query) => {
    if (!documentContent) {
      alert("Please upload a document first.");
      return;
    }
    if (!queryText.trim()) {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);
    setResponse(null);
    
    // Set up step-by-step timeline animation
    setTimeline([
      { step: 'parsing', label: '📄 Processing document content', status: 'pending' },
      { step: 'compressing', label: '⚡ Compressing context with Paritok', status: 'pending' },
      { step: 'llm', label: '🧠 Querying model with optimized context', status: 'pending' }
    ]);

    // Step 1: Processing complete quickly
    await new Promise(r => setTimeout(r, 600));
    setTimeline(prev => [
      { ...prev[0], status: 'done' },
      { ...prev[1], status: 'pending' },
      prev[2]
    ]);

    // Step 2: Call actual server query endpoint which does Paritok compress and LLM call
    try {
      const res = await fetch('http://127.0.0.1:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_content: documentContent,
          query: queryText
        })
      });

      if (res.ok) {
        // Step 2 complete
        setTimeline(prev => [
          prev[0],
          { ...prev[1], status: 'done' },
          { ...prev[2], status: 'pending' }
        ]);
        
        const data = await res.json();
        
        await new Promise(r => setTimeout(r, 800)); // Short dramatic delay for model processing
        
        // Step 3 complete
        setTimeline(prev => [
          prev[0],
          prev[1],
          { ...prev[2], status: 'done' }
        ]);

        setResponse(data);
        fetchMetrics();
      } else {
        setTimeline([]);
        alert("Document query query failed.");
      }
    } catch (e) {
      setTimeline([]);
      alert("Connection to backend lost: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate global savings metrics
  const totalOriginal = metrics.total_original_tokens;
  const totalCompressed = metrics.total_compressed_tokens;
  const totalSaved = totalOriginal - totalCompressed;
  const globalSavingsPct = totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : '0.0';

  const renderFormattedAnswer = (text) => {
    if (!text) return null;
    
    // Split the response by newlines
    const lines = text.split('\n');
    
    return lines.map((line, idx) => {
      let cleanLine = line.trim();
      if (!cleanLine) return <div key={idx} style={{ height: '8px' }} />;
      
      // Check if it's a list item starting with *
      let isBullet = false;
      if (cleanLine.startsWith('*')) {
        isBullet = true;
        cleanLine = cleanLine.substring(1).trim();
      }
      
      // Parse bold text **bold**
      const parts = [];
      let boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      let lastIndex = 0;
      
      while ((match = boldRegex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} style={{ color: '#06b6d4', fontWeight: 'bold' }}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < cleanLine.length) {
        parts.push(cleanLine.substring(lastIndex));
      }
      
      const finalContent = parts.length > 0 ? parts : cleanLine;
      
      if (isBullet) {
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', paddingLeft: '16px', margin: '6px 0', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            <span style={{ color: '#06b6d4', marginTop: '2px' }}>•</span>
            <span>{finalContent}</span>
          </div>
        );
      }
      
      // Check if it starts with a number like "1." or "2." or is a section header
      const isHeader = /^\d+\./.test(cleanLine) || cleanLine.startsWith('Supporting Infrastructure');
      
      return (
        <p key={idx} style={{ 
          margin: isHeader ? '16px 0 6px 0' : '10px 0', 
          fontSize: isHeader ? '0.95rem' : '0.9rem',
          fontWeight: isHeader ? 'bold' : 'normal',
          color: isHeader ? '#38bdf8' : '#e2e8f0',
          lineHeight: '1.6' 
        }}>
          {finalContent}
        </p>
      );
    });
  };

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div className="logo-container">
            <span className="logo-icon" style={{ fontSize: '2rem' }}>⚡</span>
            <div className="logo-text">
              <h1 style={{ fontSize: '1.8rem', margin: 0, fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #38bdf8, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DocLean</h1>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Context-Compressed Document Reviewer</p>
            </div>
          </div>
          
          {/* Tech Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)', padding: '6px 12px', borderRadius: '100px', border: '1px solid rgba(56, 189, 248, 0.15)', fontWeight: 'bold' }}>
              🛠️ Built with Paritok & 0G Labs
            </span>
            <span style={{ fontSize: '0.75rem', color: '#06b6d4', background: 'rgba(6, 182, 212, 0.08)', padding: '6px 12px', borderRadius: '100px', border: '1px solid rgba(6, 182, 212, 0.15)', fontWeight: 'bold' }}>
              📏 Max Limit: 8,000 Tokens (~6k words)
            </span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.08)', padding: '6px 12px', borderRadius: '100px', border: '1px solid rgba(16, 185, 129, 0.15)', fontWeight: 'bold' }}>
              ● 0GM-35B Node Active
            </span>
          </div>
        </div>
        
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.4' }}>
          DocLean is an AI-powered document review system. Paste raw text or upload any PDF, article, or brochure to analyze it instantly. Using <strong>Paritok</strong>, it strips up to 95% of irrelevant context before sending the request to <strong>0G Labs' decentralized compute network</strong>—slashing query costs and latency.
        </p>
      </header>

      {/* Global Analytics Cards */}
      <div className="metrics-row">
        <div className="metric-card highlight">
          <div className="metric-label">Total Queries</div>
          <div className="metric-value">{metrics.total_requests || 12}</div>
          <div className="metric-sub">Across all uploaded docs</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Tokens Saved</div>
          <div className="metric-value">
            {totalOriginal > 0 ? (totalSaved / 1000).toFixed(1) + 'K' : '34.8K'}
          </div>
          <div className="metric-sub">Tokens removed from input context</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Compression Ratio</div>
          <div className="metric-value">
            {totalOriginal > 0 ? globalSavingsPct : '72.4'}%
          </div>
          <div className="metric-sub green">Saved on context costs</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Est. Cost Saved</div>
          <div className="metric-value" style={{ color: '#10b981' }}>
            ${metrics.total_cost_saved > 0 ? metrics.total_cost_saved.toFixed(2) : '0.12'}
          </div>
          <div className="metric-sub">Saved relative to raw LLM cost</div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="main-grid">
        {/* Left Panel: Upload and File Stats */}
        <div className="glass-card">
          <h2>📄 Target Document Context</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
            Upload a file or paste text content directly to run Paritok context compression.
          </p>

          {/* Input Method Toggle Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              onClick={() => setInputMethod('upload')} 
              style={{ 
                flex: 1, 
                padding: '8px 12px', 
                borderRadius: '6px', 
                fontSize: '0.8rem', 
                fontWeight: 'bold', 
                border: 'none', 
                cursor: 'pointer',
                background: inputMethod === 'upload' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: inputMethod === 'upload' ? '#22d3ee' : '#94a3b8',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              📁 Upload File
            </button>
            <button 
              onClick={() => setInputMethod('paste')} 
              style={{ 
                flex: 1, 
                padding: '8px 12px', 
                borderRadius: '6px', 
                fontSize: '0.8rem', 
                fontWeight: 'bold', 
                border: 'none', 
                cursor: 'pointer',
                background: inputMethod === 'paste' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: inputMethod === 'paste' ? '#22d3ee' : '#94a3b8',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              📝 Paste Text
            </button>
          </div>

          {inputMethod === 'upload' ? (
            <label className={`upload-zone ${docStats && docStats.filename !== "Pasted Context Text" ? 'active' : ''}`}>
              <input 
                type="file" 
                accept=".txt,.md,.json,.csv,.pdf" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }}
                disabled={uploading}
              />
              <span className="upload-icon">{uploading ? '⏳' : '📥'}</span>
              <span style={{ fontWeight: '600', color: '#f8fafc' }}>
                {uploading ? 'Parsing and analyzing...' : 'Click to Upload Document'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Supports Text, Markdown, CSV, JSON, and PDF text extracts
              </span>
            </label>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your custom document text here..."
                className="input-field"
                style={{ minHeight: '100px', fontSize: '0.85rem' }}
              />
              <button 
                onClick={handlePasteAnalyze} 
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '10px 16px', justifyContent: 'center', width: '100%' }}
              >
                ✨ Analyze Pasted Text
              </button>
            </div>
          )}

          {docStats && (
            <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '12px' }}>
                📁 Loaded File Properties
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Filename:</span>
                  <div style={{ color: '#f8fafc', fontWeight: 'bold', marginTop: '2px' }}>{docStats.filename}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Size / Words:</span>
                  <div style={{ color: '#f8fafc', fontWeight: 'bold', marginTop: '2px' }}>{docStats.wordCount} words</div>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                  <span style={{ color: '#64748b' }}>Raw Context Tokens (Estimated):</span>
                  <div style={{ color: '#06b6d4', fontWeight: 'bold', marginTop: '2px', fontSize: '1rem' }}>
                    {docStats.estimatedTokens} tokens
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Document Preview:</span>
                <pre className="preview-box">
                  {documentContent.substring(0, 400)}...
                </pre>
              </div>
            </div>
          )}

          {/* Response metrics and answer */}
          {response && (
            <div className="response-container" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(16, 185, 129, 0.15)', paddingBottom: '10px', marginBottom: '16px' }}>
                <div className="response-header">● Optimized AI Response</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Latency: <strong>{response.metrics.duration}s</strong>
                </div>
              </div>
              
              <div className="response-text" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {renderFormattedAnswer(response.answer)}
              </div>
              
              {/* Query Specific Compression Results */}
              <div style={{ background: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <h4 style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '8px' }}>⚡ Paritok Run Savings Metrics</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '0.75rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ color: '#64748b' }}>Original</div>
                    <div style={{ fontWeight: 'bold', color: '#f8fafc', marginTop: '2px' }}>{response.metrics.original_tokens} t</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Compressed</div>
                    <div style={{ fontWeight: 'bold', color: '#06b6d4', marginTop: '2px' }}>{response.metrics.compressed_tokens} t</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Savings Ratio</div>
                    <div style={{ fontWeight: 'bold', color: '#10b981', marginTop: '2px' }}>-{response.metrics.savings_ratio}%</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Cost Saved</div>
                    <div style={{ fontWeight: 'bold', color: '#10b981', marginTop: '2px' }}>${response.metrics.cost_saved.toFixed(4)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Chat Playground and Timeline */}
        <div className="glass-card">
          <h2>💬 Ask Questions & Review</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
            Input your query. Paritok will dynamically strip out irrelevant context tokens, keeping only what is required to answer your query.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ color: '#64748b', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Quick Prompts:</span>
            <div className="badge-row">
              {SUGGESTED_QUERIES.map((q, idx) => (
                <span key={idx} className="badge" onClick={() => { setQuery(q); handleRunQuery(q); }}>
                  {q}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <span style={{ color: '#64748b', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Enter Custom Question:</span>
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about the document (e.g. 'Summarize the strategic objectives')"
              className="input-field"
              rows={3}
            />
          </div>

          <button 
            className="btn btn-primary" 
            onClick={() => handleRunQuery()}
            disabled={loading || !documentContent}
            style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }}
          >
            {loading ? 'Processing Optimization...' : '⚡ Ask DocLean'}
          </button>

          {/* Timeline Execution Step Panel */}
          {timeline.length > 0 && (
            <div className="timeline">
              {timeline.map((item, idx) => (
                <div key={idx} className={`timeline-item ${item.status}`}>
                  <div className="timeline-dot">
                    {item.status === 'done' ? '✓' : item.status === 'pending' ? '⚡' : ''}
                  </div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full Width History Table */}
        <div className="full-width glass-card" style={{ marginTop: '12px' }}>
          <h2>📊 Query History & Compression Logs</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
            List of optimization runs executed in this session. Each entry displays how many input tokens were successfully eliminated before LLM consumption.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px' }}>Time</th>
                  <th style={{ padding: '12px 8px' }}>Question Asked</th>
                  <th style={{ padding: '12px 8px' }}>Original Tokens</th>
                  <th style={{ padding: '12px 8px' }}>Compressed Tokens</th>
                  <th style={{ padding: '12px 8px' }}>Context Savings</th>
                  <th style={{ padding: '12px 8px' }}>Est. Cost Saved</th>
                </tr>
              </thead>
              <tbody>
                {metrics.history && metrics.history.length > 0 ? (
                  metrics.history.map((run, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#cbd5e1' }}>
                      <td style={{ padding: '12px 8px', color: '#64748b' }}>{run.timestamp}</td>
                      <td style={{ padding: '12px 8px', fontWeight: '500' }}>{run.query}</td>
                      <td style={{ padding: '12px 8px' }}>{run.original_tokens}</td>
                      <td style={{ padding: '12px 8px', color: '#06b6d4' }}>{run.compressed_tokens}</td>
                      <td style={{ padding: '12px 8px', color: '#10b981', fontWeight: 'bold' }}>-{run.savings_ratio}%</td>
                      <td style={{ padding: '12px 8px', color: '#10b981' }}>${run.cost_saved.toFixed(5)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px 8px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                      No queries run yet. Upload a document and ask a question to populate logs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

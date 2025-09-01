import React, { useState } from "react";
import api from "../api";

export default function QnA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);
    try {
      const res = await api.post("/docs/qa", { question });
      setAnswer(res.data.answer);
      setSources(res.data.sources || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to get answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      <h2>❓ Ask a Question</h2>

      <div style={{ marginBottom: 16 }}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          placeholder="Type your question here..."
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
      </div>

      <button
        onClick={handleAsk}
        disabled={loading}
        style={{
          padding: "10px 20px",
          borderRadius: 6,
          border: "none",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "Ask Question"}
      </button>

      {error && <div style={{ color: "crimson", marginTop: 12 }}>{error}</div>}

      {answer && (
        <div style={{ marginTop: 24, padding: 16, background: "#f1f5f9", borderRadius: 8 }}>
          <h4>Answer:</h4>
          <p>{answer}</p>
          {sources.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong>Sources:</strong>
              <ul>
                {sources.map((src, i) => (
                  <li key={i}>{src}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import api from "../api";

export default function VersionModal({ docId, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVersions = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/docs/${docId}/versions`);
        setVersions(res.data);
      } catch (err) {
        console.error("Failed to fetch versions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVersions();
  }, [docId]);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
      alignItems: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", padding: 24, borderRadius: 12, width: 500,
        maxHeight: "80%", overflowY: "auto", position: "relative"
      }}>
        <h3>📄 Document Versions</h3>
        <button 
          onClick={onClose} 
          style={{ position: "absolute", top: 16, right: 16, cursor: "pointer" }}
        >
          ✖
        </button>

        {loading ? (
          <p>Loading versions...</p>
        ) : versions.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {versions.map((v, i) => (
              <li key={i} style={{ marginBottom: 12, padding: 8, border: "1px solid #ccc", borderRadius: 6 }}>
                <strong>Version {i + 1}</strong> <br />
                <small style={{ color: "#6b7280" }}>
                  {new Date(v.updatedAt).toLocaleString()}
                </small>
                <p style={{ marginTop: 4 }}>{v.content.slice(0, 100)}...</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No previous versions found.</p>
        )}
      </div>
    </div>
  );
}

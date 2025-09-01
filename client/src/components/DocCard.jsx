// src/components/DocCard.jsx
import React, { useState } from "react";
import VersionModal from "./VersionModal.jsx";

export default function DocCard({ doc, onEdit, onDelete, onSummarize, onTag }) {
  const [showVersions, setShowVersions] = useState(false);

  return (
    <div style={{
      background: "#fff",
      padding: 16,
      borderRadius: 10,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      marginBottom: 16
    }}>
      <h4>{doc.title}</h4>
      <p>{doc.summary || doc.content.slice(0, 100) + "..."}</p>

      {/* Tags Section */}
      {doc.tags?.length > 0 ? (
        <div style={{ marginBottom: 8 }}>
          {doc.tags.map((t, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                background: "#f1f5f9",
                padding: "2px 8px",
                marginRight: 4,
                borderRadius: 6,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
              onClick={() => onTag(t)} // trigger search by this tag
            >
              {t}
            </span>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: 8 }}>
          No tags generated
        </div>
      )}

      <small style={{ color: "#6b7280" }}>
        By: {doc.createdBy?.name || "Unknown"}
      </small>

      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button className="btn ghost" onClick={() => onEdit(doc._id)}>✏️ Edit</button>
        <button className="btn ghost" onClick={() => onDelete(doc._id)}>🗑 Delete</button>
        <button className="btn ghost" onClick={() => onSummarize(doc._id)}>✨ Summarize</button>
        <button className="btn ghost" onClick={() => onTag(doc._id)}>🏷 Tags</button> {/* Manual tag action */}
        <button className="btn ghost" onClick={() => setShowVersions(true)}>🕒 Versions</button>
      </div>

      {showVersions && (
        <VersionModal docId={doc._id} onClose={() => setShowVersions(false)} />
      )}
    </div>
  );
}

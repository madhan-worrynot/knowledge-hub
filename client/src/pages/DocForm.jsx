import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function DocForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch document if editing
  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchDoc = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/docs/${id}`);
          setTitle(res.data.title);
          setContent(res.data.content);
          setTags(res.data.tags || []);
        } catch (err) {
          console.error("Error fetching document:", err);
          setError("Failed to load document for editing.");
        } finally {
          setLoading(false);
        }
      };
      fetchDoc();
    }
  }, [mode, id]);

  // ✅ Add tag manually
  const handleAddTag = (e) => {
    e.preventDefault();
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (t) => setTags(tags.filter(tag => tag !== t));

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "create") {
        await api.post("/docs", { title, content, tags });
        alert("✅ Document created successfully!");
      } else {
        await api.put(`/docs/${id}`, { title, content, tags });
        alert("✅ Document updated successfully!");
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving document:", err.response?.data || err.message);
      setError("❌ Error saving document. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-form" style={{
      maxWidth: 600, margin: "40px auto", padding: 16,
      background: "#fff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
    }}>
      <h2 style={{ marginBottom: 20 }}>
        {mode === "create" ? "➕ Add New Document" : "✏️ Edit Document"}
      </h2>

      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
            required
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            disabled={loading}
          />
        </div>

        {/* Tags Section */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Tags</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
            {tags.map((t, i) => (
              <span key={i} style={{
                display: "inline-block",
                background: "#f1f5f9",
                padding: "2px 8px",
                borderRadius: 6,
                fontSize: "0.85rem",
                cursor: "pointer"
              }} onClick={() => handleRemoveTag(t)}>
                {t} ×
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag and press Enter"
            onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          {loading ? "Saving..." : mode === "create" ? "Create Document" : "Update Document"}
        </button>
      </form>
    </div>
  );
}

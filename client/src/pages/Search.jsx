import React, { useState, useEffect } from "react";
import api from "../api";
import DocCard from "../components/DocCard.jsx";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState("text"); // text or semantic
  const [tags, setTags] = useState([]); // selected tags
  const [allTags, setAllTags] = useState([]); // all available tags

  // Fetch all tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/docs");
        const tagSet = new Set();
        res.data.forEach((doc) => doc.tags?.forEach((t) => tagSet.add(t)));
        setAllTags(Array.from(tagSet));
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };
    fetchTags();
  }, []);

  // Search function
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      let endpoint = "/docs/search/text"; // text search supports tags
      const params = {};
      if (query) params.q = query;
      if (searchType === "text" && tags.length > 0) params.tags = tags.join(",");

      if (searchType === "semantic") {
        endpoint = `/docs/search/semantic?q=${encodeURIComponent(query)}`;
        const res = await api.get(endpoint);
        setResults(res.data);
      } else {
        const res = await api.get(endpoint, { params });
        setResults(res.data);
      }
    } catch (err) {
      console.error("Search error:", err.response?.data || err.message);
      setError("Failed to search documents.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle tag selection and trigger search automatically
  const toggleTag = (tag) => {
    const updatedTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setTags(updatedTags);

    // Trigger search after tag selection
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h2>🔍 Search Documents</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query..."
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{ padding: 8, borderRadius: 6 }}
        >
          <option value="text">Text Search</option>
          <option value="semantic">Semantic Search</option>
        </select>
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && searchType === "text" && (
        <div style={{ marginBottom: 16 }}>
          <label>Filter by Tags:</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            {allTags.map((tag, i) => (
              <span
                key={i}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: tags.includes(tag) ? "1px solid #2563eb" : "1px solid #ccc",
                  background: tags.includes(tag) ? "#e0f2ff" : "#f1f5f9",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

      {results.length > 0 ? (
        results.map((doc) => (
          <DocCard
            key={doc._id}
            doc={doc}
            onEdit={() => {}}
            onDelete={() => {}}
            onSummarize={() => {}}
            onTag={() => {}}
          />
        ))
      ) : (
        <p>{loading ? "Searching..." : "No results found."}</p>
      )}
    </div>
  );
}

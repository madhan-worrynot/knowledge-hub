// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import DocCard from "../components/DocCard.jsx";
import ActivityFeed from "../components/ActivityFeed.jsx";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  const fetchDocs = async () => {
    try {
      const { data } = await api.get("/docs");
      setDocs(data);
    } catch (err) {
      console.error("Docs fetch error", err);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleEdit = (id) => navigate(`/docs/${id}/edit`);
  const handleDelete = async (id) => {
    try {
      await api.delete(`/docs/${id}`);
      setDocs(docs.filter(d => d._id !== id));
    } catch (err) { console.error(err); }
  };
  const handleSummarize = async (id) => {
    try {
      await api.post(`/docs/${id}/summarize`);
      fetchDocs();
    } catch (err) { console.error(err); }
  };
  const handleTag = async (id) => {
    try {
      await api.post(`/docs/${id}/tags`);
      fetchDocs();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{display:"flex", gap:20}}>
      <div style={{flex:3}}>
        <h2>📄 Documents</h2>
        <button className="btn" onClick={() => navigate("/docs/new")}>➕ Add New Document</button>
        <div style={{marginTop:16}}>
          {docs.length > 0 ? docs.map(doc => (
            <DocCard
              key={doc._id}
              doc={doc}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSummarize={handleSummarize}
              onTag={handleTag}
            />
          )) : <p>No documents yet.</p>}
        </div>
      </div>
      <div style={{flex:1}}>
        <ActivityFeed />
      </div>
    </div>
  );
}

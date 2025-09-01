// src/components/ActivityFeed.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/docs/activity/feed");
        setActivities(data);
      } catch (err) {
        console.error("Activity fetch error", err);
      }
    };
    fetch();
  }, []);

  return (
    <div style={{
      background:"#fff", padding:16, borderRadius:10,
      boxShadow:"0 4px 12px rgba(0,0,0,0.05)", marginTop:20
    }}>
      <h4>📝 Team Activity</h4>
      {activities.length > 0 ? (
        <ul>
          {activities.map((a) => (
            <li key={a._id} style={{marginBottom:6}}>
              <strong>{a.user?.name || "User"}</strong> {a.action} a doc
              <br />
              <small style={{color:"#6b7280"}}>
                {new Date(a.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activity.</p>
      )}
    </div>
  );
}

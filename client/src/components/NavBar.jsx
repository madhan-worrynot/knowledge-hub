// src/components/NavBar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "#1e40af", // dark blue
        color: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Link
        to="/dashboard"
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#fff",
          textDecoration: "none",
          letterSpacing: 1,
        }}
      >
        Knowledge Hub
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          to="/dashboard"
          style={navButtonStyle}
        >
          Dashboard
        </Link>
        <Link
          to="/search"
          style={navButtonStyle}
        >
          Search
        </Link>
        <Link
          to="/qa"
          style={navButtonStyle}
        >
          Q&A
        </Link>

        {user ? (
          <>
            <span style={{ color: "#e0e7ff", fontSize: "0.9rem", marginRight: 8 }}>
              {user.name || user.email} ({user.role || 'user'})
            </span>
            <button
              onClick={() => { logout(); nav("/auth"); }}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "none",
                background: "#f97316", // orange accent
                color: "#fff",
                fontWeight: 500,
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={e => e.currentTarget.style.background="#fb923c"}
              onMouseLeave={e => e.currentTarget.style.background="#f97316"}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" style={loginButtonStyle}>
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

// Common styles
const navButtonStyle = {
  padding: "6px 14px",
  borderRadius: 6,
  background: "#2563eb", // blue
  color: "#fff",
  textDecoration: "none",
  fontWeight: 500,
  transition: "0.3s",
  cursor: "pointer",
};
const loginButtonStyle = {
  padding: "6px 14px",
  borderRadius: 6,
  background: "#10b981", // green accent
  color: "#fff",
  textDecoration: "none",
  fontWeight: 500,
  transition: "0.3s",
  cursor: "pointer",
};

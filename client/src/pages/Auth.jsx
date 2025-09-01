// src/pages/Auth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const nav = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      nav("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Auth failed");
    }
  };

  return (
    <div style={{ maxWidth: 540, margin: "40px auto", padding: 12 }}>
      <div className="form">
        <h3 className="center">{mode === "login" ? "Login" : "Register"}</h3>
        <form onSubmit={onSubmit}>
          {mode === "register" && (
            <input className="input" name="name" placeholder="Your name" value={form.name} onChange={onChange} required />
          )}
          <input className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input className="input" type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
          {error && <div style={{ color: "crimson", marginBottom: 10 }}>{error}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit">{mode === "login" ? "Login" : "Create account"}</button>
            <button type="button" className="btn ghost" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Switch to register" : "Switch to login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

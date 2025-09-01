// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; } catch { return null; }
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    // tolerant parsing
    const token = data.token || data.accessToken || data.tokenValue;
    const userObj = data.user || (data.token ? (data.user || data) : data);
    if (token) localStorage.setItem("token", token);
    if (userObj) { localStorage.setItem("user", JSON.stringify(userObj)); setUser(userObj); }
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    const token = data.token || data.accessToken;
    const userObj = data.user || data;
    if (token) localStorage.setItem("token", token);
    if (userObj) { localStorage.setItem("user", JSON.stringify(userObj)); setUser(userObj); }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) { setUser(null); return; }
    const u = localStorage.getItem("user");
    if (u) {
      try { setUser(JSON.parse(u)); } catch { setUser(null); }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

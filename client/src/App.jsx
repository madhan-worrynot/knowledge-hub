// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NavBar from "./components/NavBar.jsx";

// pages
import AuthPage from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DocForm from "./pages/DocForm.jsx";
import Search from "./pages/Search.jsx";
import QnA from "./pages/QnA.jsx";

export default function App() {
  return (
    <AuthProvider>
      <NavBar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/docs/new" element={<ProtectedRoute><DocForm mode="create" /></ProtectedRoute>} />
          <Route path="/docs/:id/edit" element={<ProtectedRoute><DocForm mode="edit" /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/qa" element={<QnA />} />

        </Routes>
      </div>
    </AuthProvider>
  );
}

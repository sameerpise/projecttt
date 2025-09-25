import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !token) return <Navigate to="/login" replace />;

  // Role check
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
}

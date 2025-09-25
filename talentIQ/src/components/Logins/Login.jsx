import React, { useState } from "react";
import { Box, Button, TextField, Paper, Typography, InputAdornment } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch } from "react-redux";
import { setStudent } from "../redux/studentSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });

  // Dummy admin credentials
  const adminCredentials = {
    email: "admin@example.com",
    password: "admin123",
  };

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

const handleSubmit = async (e) => {
  e.preventDefault();

  // Check for admin login first
  if (form.email === adminCredentials.email && form.password === adminCredentials.password) {
    // Admin login
    const admin = { name: "Admin", email: form.email, role: "admin" };
    localStorage.setItem("token", "admin-token"); // dummy token
    localStorage.setItem("user", JSON.stringify(admin));
    navigate("/admin"); // Redirect to Admin Portal
    return;
  }

  // Otherwise, normal student login
  try {
    const res = await fetch("http://localhost:5000/api/students/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // Store student info with role in Redux and localStorage
    dispatch(setStudent({ ...data.student, role: "student" }));
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ ...data.student, role: "student" }));

    navigate("/dashboard"); // Student dashboard
  } catch (err) {
    alert(err.message);
  }
};


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #575fd8ff, #ffffff)",
        p: 2,
      }}
    >
      <Paper sx={{ p: 5, width: 400, borderRadius: 4, textAlign: "center" }}>
        <LockIcon sx={{ fontSize: 60, color: "#2193b0", mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Student / Admin Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<LockIcon />}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

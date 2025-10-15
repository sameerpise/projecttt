import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  InputAdornment,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

import { useDispatch } from "react-redux";
import { setStudent } from "../Redux/studentslice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Save student info in Redux
      dispatch(setStudent(data.student));

      // Save JWT token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("student", JSON.stringify(data.student));

      setSnack({
        open: true,
        message: "Login successful!",
        severity: "success",
      });

      // Redirect to dashboard after 1.5 sec
      setTimeout(() => navigate("/register"), 1500);
    } catch (err) {
      setSnack({ open: true, message: err.message, severity: "error" });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2193b0, #ffffff)",
        p: 2,
      }}
    >
      <Paper sx={{ p: 5, width: 400, borderRadius: 4, textAlign: "center" }}>
        {/* 🔒 Big Lock Icon on top */}
        <LockIcon sx={{ fontSize: 60, color: "#2193b0", mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Guest Login
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

        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          <Alert severity={snack.severity}>{snack.message}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch } from "react-redux";
import { setStudent } from "../redux/studentSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loginType, setLoginType] = useState("student"); // student | admin

  const adminCredentials = {
    email: "admin@example.com",
    password: "admin123",
  };

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginType === "admin") {
      if (
        form.email === adminCredentials.email &&
        form.password === adminCredentials.password
      ) {
        const admin = { name: "Admin", email: form.email, role: "admin" };
        localStorage.setItem("token", "admin-token");
        localStorage.setItem("user", JSON.stringify(admin));
        navigate("/admin");
      } else {
        alert("Invalid Admin Credentials");
      }
    } else {
      try {
        const res = await fetch("https://projecttt-15.onrender.com/api/students/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        dispatch(setStudent({ ...data.student, role: "student" }));
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.student, role: "student" })
        );

        navigate("/dashboard");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        p: 2,
      }}
    >
      <Paper
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          textAlign: "center",
          boxShadow: 6,
        }}
      >
        <LockIcon sx={{ fontSize: 60, color: "#2193b0", mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          {loginType === "admin" ? "Admin Login" : "Student Login"}
        </Typography>

        <ToggleButtonGroup
          value={loginType}
          exclusive
          onChange={(e, value) => value && setLoginType(value)}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="student">Student</ToggleButton>
          <ToggleButton value="admin">Admin</ToggleButton>
        </ToggleButtonGroup>

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
            {loginType === "admin" ? "Login as Admin" : "Login as Student"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

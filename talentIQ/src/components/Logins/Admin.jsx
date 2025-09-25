// AdminLogin.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [openSnack, setOpenSnack] = useState(false);

  const handleChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
    setErrors((s) => ({ ...s, [key]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!form.username) err.username = "Username is required";
    if (!form.password) err.password = "Password is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Admin Login submitted", form);
    setOpenSnack(true);
    setTimeout(() => navigate("/"), 2000);
  };

  const labelEffect = {
    transition: "all 0.2s ease-in-out",
    "&.Mui-focused": { transform: "scale(1.1)", color: "secondary.main" },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f7971e, #ffd200)",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: 700, color: "secondary.main", mb: 3 }}
        >
          🛡️ Admin Login
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={form.username}
            onChange={handleChange("username")}
            error={!!errors.username}
            helperText={errors.username}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AdminPanelSettingsIcon color="action" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ sx: labelEffect }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ sx: labelEffect }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.2,
              backgroundColor: "#f7971e",
              "&:hover": { backgroundColor: "#d17f0f" },
            }}
          >
            Login
          </Button>

          <Typography
            variant="body2"
            sx={{ mt: 2, textAlign: "center", cursor: "pointer", color: "blue" }}
            onClick={() => navigate("/")}
          >
            Back to Student Login
          </Typography>
        </Box>

        <Snackbar
          open={openSnack}
          autoHideDuration={2000}
          onClose={() => setOpenSnack(false)}
        >
          <Alert
            onClose={() => setOpenSnack(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Admin Login successful!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

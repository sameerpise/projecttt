import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import NumbersIcon from "@mui/icons-material/Numbers";
import LockIcon from "@mui/icons-material/Lock";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { useNavigate } from "react-router-dom";

export default function StudentRegistrationForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    department: "",
    pursuingYear: "",
    college: "",
    city: "",
    pincode: "",
    gender: "",
    address: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  const validate = () => {
    const err = {};
    if (!form.fullName.trim()) err.fullName = "Full name is required";
    if (!form.email) err.email = "Email required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Invalid email";
    if (!form.password) err.password = "Password required";
    if (form.password !== form.confirmPassword) err.confirmPassword = "Passwords do not match";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSnack({ open: true, message: "Registered successfully!", severity: "success" });
      setForm({
        fullName: "",
        email: "",
        mobile: "",
        department: "",
        pursuingYear: "",
        college: "",
        city: "",
        pincode: "",
        gender: "",
        address: "",
        dob: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setSnack({ open: true, message: err.message, severity: "error" });
    }
  };

  const labelEffect = { transition: "0.2s", "&.Mui-focused": { color: "primary.main" } };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
       background: "linear-gradient(135deg, #575fd8ff, #ffffff)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: 5,
          borderRadius: 5,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          🎓 Student Registration
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={form.fullName}
                onChange={handleChange("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>,
                }}
                InputLabelProps={{ sx: labelEffect }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={form.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>,
                }}
                InputLabelProps={{ sx: labelEffect }}
              />
            </Grid>

            {/* Mobile */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile"
                value={form.mobile}
                onChange={handleChange("mobile")}
                inputProps={{ maxLength: 10 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment>,
                }}
                InputLabelProps={{ sx: labelEffect }}
              />
            </Grid>

            {/* College */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="College"
                value={form.college}
                onChange={handleChange("college")}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SchoolIcon /></InputAdornment>,
                }}
                InputLabelProps={{ sx: labelEffect }}
              />
            </Grid>

            {/* Department */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                value={form.department}
                onChange={handleChange("department")}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><BusinessIcon /></InputAdornment>,
                }}
                InputLabelProps={{ sx: labelEffect }}
              />
            </Grid>

            {/* Pursuing Year */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pursuing Year"
                value={form.pursuingYear}
                onChange={handleChange("pursuingYear")}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><NumbersIcon /></InputAdornment>,
                }}
                InputLabelProps={{ sx: labelEffect }}
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={form.city}
                onChange={handleChange("city")}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LocationCityIcon /></InputAdornment>,
                }}
                InputLabelProps={{ sx: labelEffect }}
              />
            </Grid>

            {/* Pincode */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pincode"
                value={form.pincode}
                onChange={handleChange("pincode")}
                inputProps={{ maxLength: 6 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LocationOnIcon /></InputAdornment>,
                }}
                InputLabelProps={{ sx: labelEffect }}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
                }}
                InputLabelProps={{ sx: labelEffect }}
              />
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
                }}
                InputLabelProps={{ sx: labelEffect }}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <RadioGroup row value={form.gender} onChange={handleChange("gender")}>
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* DOB */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="DOB"
                type="date"
                value={form.dob}
                onChange={handleChange("dob")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: "12px",
                  background: "linear-gradient(90deg, #2193b0, #6dd5ed)",
                  "&:hover": { background: "linear-gradient(90deg, #6dd5ed, #2193b0)" },
                  boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                }}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Box>

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

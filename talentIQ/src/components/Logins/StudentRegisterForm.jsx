import React, { useState } from "react";
import img1 from '../../assets/Lovepik_com-450092311-Creative design online registration flat illustration.png';
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
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import NumbersIcon from "@mui/icons-material/Numbers";
import LockIcon from "@mui/icons-material/Lock";
import SchoolIcon from "@mui/icons-material/School";

import { useNavigate } from "react-router-dom";

export default function StudentRegistrationForm() {
  const navigate = useNavigate();
  const steps = ["Personal Details", "Education", "Address", "Security"];
  const [activeStep, setActiveStep] = useState(0);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    department: "",
    pursuingYear: "",
    whichYear: "",
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

  const labelEffect = {
    transition: "0.2s",
    color: "#eeeeee",
    "&.Mui-focused": { color: "#f6ae22" },
  };

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value, ...(key === "pursuingYear" ? { whichYear: "" } : {}) }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      switch (key) {
        case "fullName":
          newErrors.fullName = value.trim() ? "" : "Full name is required";
          break;
        case "email":
          if (!value) newErrors.email = "Email required";
          else if (!/^\S+@\S+\.\S+$/.test(value)) newErrors.email = "Invalid email";
          else newErrors.email = "";
          break;
        case "password":
          newErrors.password = value ? "" : "Password required";
          if (form.confirmPassword && value !== form.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
          else newErrors.confirmPassword = "";
          break;
        case "confirmPassword":
          newErrors.confirmPassword = value === form.password ? "" : "Passwords do not match";
          break;
        default:
          break;
      }
      return newErrors;
    });
  };

  const fetchCityFromPin = async (pin) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await response.json();
      if (data[0].Status === "Success") {
        return data[0].PostOffice[0].District;
      }
      return "";
    } catch (error) {
      console.error("Error fetching city:", error);
      return "";
    }
  };

  const handlePinChange = async (e) => {
    const pincode = e.target.value;
    setForm((prev) => ({ ...prev, pincode }));
    if (pincode.length === 6) {
      const city = await fetchCityFromPin(pincode);
      setForm((prev) => ({ ...prev, city }));
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0: return form.fullName && form.email && form.mobile && form.gender && form.dob;
      case 1: return form.college && form.department && form.pursuingYear && ((form.pursuingYear === "Completed" || form.pursuingYear === "Pursuing") ? form.whichYear : true);
      case 2: return form.pincode && form.city;
      case 3: return form.password && form.confirmPassword && form.password === form.confirmPassword;
      default: return false;
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://projecttt-15.onrender.com/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSnack({ open: true, message: "Registered Successfully!", severity: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setSnack({ open: true, message: err.message, severity: "error" });
    }
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#eeeeee",
      "& fieldset": { borderColor: "#f6ae22" },
      "&:hover fieldset": { borderColor: "#f6ae22" },
      "&.Mui-focused fieldset": { borderColor: "#f6ae22" },
    },
    "& .MuiInputLabel-root": { color: "#eeeeee" },
    mb: 2,
  };

  const radioStyle = {
    "& .MuiSvgIcon-root": { color: "#f6ae22" },
    "& .Mui-checked": { color: "#f6ae22" },
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2, background: "#eeeeee" }}>
      <Paper elevation={10} sx={{ display: "flex", width: "100%", maxWidth: 1000, borderRadius: 4, overflow: "hidden",    border: "3px solid #f6ae22", bgcolor: "#272425", color: "#eeeeee" }}>
        
        {/* Left Image */}
        <Box component="img" src={img1} alt="Illustration" sx={{ width: "100%", maxWidth: 380 }} />

        {/* Right Form */}
        <Box sx={{ width: { xs: "100%", sm: "60%" }, p: 5 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#f6ae22" }}>
            🎓 Student Registration Form
          </Typography>
          <Divider sx={{ mb: 3, bgcolor: "#f6ae22" }} />

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, "& .MuiStepConnector-line": { borderColor: "#f6ae22" } }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{
                  color: "#eeeeee",
                  "& .MuiStepLabel-label.Mui-active": { color: "#f6ae22", fontWeight: "bold" },
                  "& .MuiStepLabel-label.Mui-completed": { color: "#f6ae22" },
                }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box>
            {/* Step 0: Personal */}
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Full Name" value={form.fullName} onChange={handleChange("fullName")}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "#f6ae22" }} /></InputAdornment> }}
                    InputLabelProps={{ sx: labelEffect }}
                    variant="outlined" sx={textFieldStyle} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" value={form.email} onChange={handleChange("email")}
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "#f6ae22" }} /></InputAdornment> }}
                    InputLabelProps={{ sx: labelEffect }}
                    variant="outlined" sx={textFieldStyle} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Mobile" value={form.mobile} onChange={handleChange("mobile")}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "#f6ae22" }} /></InputAdornment> }}
                    variant="outlined" sx={textFieldStyle} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={radioStyle}>
                    <RadioGroup row value={form.gender} onChange={handleChange("gender")}>
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      <FormControlLabel value="Other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="DOB" type="date" value={form.dob} onChange={handleChange("dob")}
                    InputLabelProps={{ shrink: true, sx: labelEffect }}
                    variant="outlined" sx={textFieldStyle} />
                </Grid>
              </Grid>
            )}

            {/* Step 1: Education */}
            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="College" value={form.college} onChange={handleChange("college")}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SchoolIcon sx={{ color: "#f6ae22" }} /></InputAdornment> }}
                    InputLabelProps={{ sx: labelEffect }} variant="outlined" sx={textFieldStyle} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Department" value={form.department} onChange={handleChange("department")}
                    InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon sx={{ color: "#f6ae22" }} /></InputAdornment> }}
                    InputLabelProps={{ sx: labelEffect }} variant="outlined" sx={textFieldStyle} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select fullWidth label="Status" value={form.pursuingYear} onChange={handleChange("pursuingYear")}
                    SelectProps={{ native: true }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><NumbersIcon sx={{ color: "#f6ae22" }} /></InputAdornment> }}
                    InputLabelProps={{ sx: labelEffect }} variant="outlined" sx={textFieldStyle}>
                    <option value="">Select</option>
                    <option value="Completed">Completed</option>
                    <option value="Pursuing">Pursuing</option>
                  </TextField>
                </Grid>
                {(form.pursuingYear === "Completed" || form.pursuingYear === "Pursuing") && (
                  <Grid item xs={12} sm={6}>
                    <TextField select fullWidth
                      label={form.pursuingYear === "Completed" ? "Completed Year" : "Current Year"}
                      value={form.whichYear || ""} onChange={handleChange("whichYear")}
                      SelectProps={{ native: true }}
                      InputLabelProps={{ sx: labelEffect }}
                      variant="outlined"
                      sx={textFieldStyle}>
                      <option value=""></option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                    </TextField>
                  </Grid>
                )}
              </Grid>
            )}

            {/* Step 2: Address */}
            {activeStep === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="PIN Code" value={form.pincode} onChange={handlePinChange}
                    InputProps={{ startAdornment: <InputAdornment position="start"><NumbersIcon sx={{ color: "#f6ae22" }} /></InputAdornment> }}
                    variant="outlined" sx={textFieldStyle} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="City" value={form.city} InputProps={{
                    startAdornment: <InputAdornment position="start"><LocationCityIcon sx={{ color: "#f6ae22" }} /></InputAdornment>,
                    readOnly: true,
                  }} variant="outlined" sx={textFieldStyle} />
                </Grid>
              </Grid>
            )}

            {/* Step 3: Security */}
            {activeStep === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Password" type="password" value={form.password} onChange={handleChange("password")}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "#f6ae22" }} /></InputAdornment> }}
                    InputLabelProps={{ sx: labelEffect }} variant="outlined" sx={textFieldStyle} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Confirm Password" type="password" value={form.confirmPassword} onChange={handleChange("confirmPassword")}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "#f6ae22" }} /></InputAdornment> }}
                    InputLabelProps={{ sx: labelEffect }} variant="outlined" sx={textFieldStyle} />
                </Grid>
              </Grid>
            )}

            {/* Navigation */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ bgcolor: "#f6ae22", color: "#272425", "&:hover": { bgcolor: "#e59f1f" } }}>Back</Button>
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" disabled={!isStepValid()} onClick={handleNext} sx={{ bgcolor: "#f6ae22", color: "#272425", "&:hover": { bgcolor: "#e59f1f" } }}>Next</Button>
              ) : (
                <Button variant="contained" disabled={!isStepValid()} onClick={handleSubmit} sx={{ bgcolor: "#f6ae22", color: "#272425", "&:hover": { bgcolor: "#e59f1f" } }}>Register</Button>
              )}
            </Box>

          </Box>

          <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
            <Alert severity={snack.severity}>{snack.message}</Alert>
          </Snackbar>
        </Box>
      </Paper>
    </Box>
  );
}

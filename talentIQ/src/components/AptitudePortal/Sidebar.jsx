import React from "react";
import { Box, Typography, Button, Avatar, Divider, LinearProgress, Stack, Chip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/studentSlice";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const dispatch = useDispatch();
  const student = useSelector((state) => state.student.student);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        width: 200,
        height: "100vh",
         background: "linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)",
        color: "white",
        p: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        borderRadius: 3,
      }}
    >
      {/* Profile Section */}
      <Box sx={{ textAlign: "center" }}>
        <Avatar
          alt={student?.fullName || "Student"}
          src="/profile.png"
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            mb: 2,
            border: "4px solid white",
            boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {student?.fullName || "Student Name"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {student?.email || "email@example.com"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
          🎓 {student?.college || "College Name"}
        </Typography>

        {/* Status */}
        <Chip
          label="Active"
          sx={{
            mt: 1,
            bgcolor: "green",
            color: "white",
            fontWeight: "bold",
          }}
        />

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", my: 3 }} />

        {/* Quick Stats */}
        {/* <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Profile Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={70} // dynamic value
            sx={{
              height: 8,
              borderRadius: 5,
              bgcolor: "rgba(255,255,255,0.3)",
              "& .MuiLinearProgress-bar": { bgcolor: "#fff" },
            }}
          />
        </Box> */}

        {/* <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="body2">
            ✅ Aptitude Completed: <strong>3/5</strong>
          </Typography>
          <Typography variant="body2">
            💻 Machine Coding Score: <strong>85%</strong>
          </Typography>
          <Typography variant="body2">
            🗣 Group Discussion: <strong>Pending</strong>
          </Typography>
        </Stack> */}

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", my: 2 }} />

        {/* Navigation */}
        {/* <Stack spacing={1}>
          <Button component={Link} to="/dashboard" variant="outlined" sx={{ color: "white", borderColor: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
            Dashboard
          </Button>
          <Button component={Link} to="/apti" variant="outlined" sx={{ color: "white", borderColor: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
            Aptitude
          </Button>
          <Button component={Link} to="/gd" variant="outlined" sx={{ color: "white", borderColor: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
            Group Discussion
          </Button>
          <Button component={Link} to="/machine" variant="outlined" sx={{ color: "white", borderColor: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
            Machine Coding
          </Button>
        </Stack> */}
      </Box>

      {/* Logout */}
      <Button
        variant="contained"
        onClick={handleLogout}
        sx={{
          mt: 2,
          py: 1.2,
          borderRadius: 3,
          fontWeight: "bold",
          bgcolor: "#ff4b5c",
          "&:hover": { bgcolor: "#ff2e44" },
          transition: "0.3s",
        }}
        fullWidth
      >
        Logout
      </Button>
    </Box>
  );
}

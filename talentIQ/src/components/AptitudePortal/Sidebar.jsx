import React from "react";
import { Box, Typography, Button, Avatar, Divider, Chip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/studentslice";

export default function Sidebar({ open = true }) {
  const dispatch = useDispatch();
  const student = useSelector((state) => state.student.student);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <Box
      sx={{
        width: { xs: open ? "70%" : 0, sm: 200 }, // collapsible on mobile
        minWidth: { xs: 0, sm: 200 },
        height: "110vh",
        background: "linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)",
        color: "white",
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        borderRadius: { xs: 0, sm: 3 },
        transition: "all 0.3s",
        overflowX: "hidden",
      }}
    >
      {/* Profile Section */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Avatar
          alt={student?.fullName || "Student"}
          src="/profile.png"
          sx={{
            width: { xs: 80, sm: 100 },
            height: { xs: 80, sm: 100 },
            mx: "auto",
            mb: 1,
            border: "4px solid white",
            boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: { xs: 14, sm: 16 } }}>
          {student?.fullName || "Student Name"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: 12, sm: 14 } }}>
          {student?.email || "email@example.com"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5, fontSize: { xs: 12, sm: 14 } }}>
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
            fontSize: { xs: 10, sm: 12 },
          }}
        />

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", my: 2 }} />
      </Box>

      {/* Logout */}
      <Button
        variant="contained"
        onClick={handleLogout}
        sx={{
          mt: 2,
          py: { xs: 0.8, sm: 1.2 },
          borderRadius: { xs: 1.5, sm: 3 },
          fontWeight: "bold",
          bgcolor: "#ff4b5c",
          fontSize: { xs: 12, sm: 14 },
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

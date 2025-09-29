import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function AptitudeInstructions() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const [startClicked, setStartClicked] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Countdown logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && startClicked) {
      navigate("../apti");
    }
  }, [countdown, startClicked, navigate]);

  // Track mouse position
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleStart = () => {
    setStartClicked(true);
    setCountdown(3); // 3-second countdown
  };

  return (
    <Box
      onMouseMove={handleMouseMove}
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #2193b0, #6dd5ed)",
        position: "relative",
      }}
    >
      {/* Interactive particles */}
      {[...Array(20)].map((_, i) => {
        const size = Math.random() * 10 + 5;
        const offsetX = (Math.random() - 0.5) * 200;
        const offsetY = (Math.random() - 0.5) * 200;
        return (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.3)",
              top: mousePos.y + offsetY,
              left: mousePos.x + offsetX,
              transition: "top 0.2s ease, left 0.2s ease",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Paper Container */}
      <Paper
        elevation={12}
        sx={{
          maxWidth: 650,
          width: "100%",
          p: 5,
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.97)",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
          sx={{
            background: "linear-gradient(90deg, #ff8a00, #e52e71)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📝 Aptitude Test Instructions
        </Typography>

        <Typography variant="body1" mb={3} sx={{ fontSize: 16, color: "#555" }}>
          Please read the following instructions carefully before starting the test:
        </Typography>

        <List sx={{ textAlign: "left", mb: 4 }}>
          {[
            "The test contains multiple-choice questions only.",
            "Do not refresh the page or switch tabs during the test,after 3 Warning test Will automatically Submit.",
            "Each question has a time limit. Try to answer within the time.",
            "Click 'Start Test' when you are ready.",
          ].map((text, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircleOutline sx={{ color: "#1976d2" }} />
              </ListItemIcon>
              <ListItemText primary={`${index + 1}. ${text}`} />
            </ListItem>
          ))}
        </List>

        {countdown > 0 ? (
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: "#e52e71", mb: 2 }}
          >
            {countdown}
          </Typography>
        ) : null}

        <Button
          variant="contained"
          size="large"
          sx={{
            background: "linear-gradient(90deg, #ff8a00, #e52e71)",
            color: "#fff",
            fontWeight: "bold",
            px: 5,
            py: 1.5,
            borderRadius: 3,
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
            },
          }}
          onClick={handleStart}
          disabled={startClicked}
        >
          {startClicked ? "Get Ready..." : "Start Test 🚀"}
        </Button>
      </Paper>
    </Box>
  );
}

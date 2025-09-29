import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent, Divider, CircularProgress } from "@mui/material";
import Sidebar from "../AptitudePortal/Sidebar";
import { Outlet, useLocation, Link } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const location = useLocation();
  const student = useSelector((state) => state.student.student);
  const [loading, setLoading] = useState(true);
  const [modulesStatus, setModulesStatus] = useState({
    apti: false,
    gd: false,
    machine: false,
  });
  const [aptiCompleted, setAptiCompleted] = useState(
    localStorage.getItem("aptiCompleted") === "true"
  );

  // Hide sidebar on Aptitude route
  const isAptitudeRoute = location.pathname.includes("aptii");

  // Fetch status
  const fetchStatus = async () => {
    if (!student?._id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/results/check/${student._id}`);
      const data = await res.json();
      setModulesStatus({
        apti: !data.allowed,
        gd: !data.allowed,
        machine: !data.allowed,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [student]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAptiCompleted(localStorage.getItem("aptiCompleted") === "true");
      fetchStatus();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f0f2f5",
        }}
      >
        <CircularProgress
          size={80}
          thickness={4.5}
          sx={{ color: "#667eea", mb: 2 }}
        />
        <Typography variant="h6" sx={{ color: "#555" }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafe" }}>
      {!isAptitudeRoute && <Sidebar />} {/* Hide sidebar on aptitude */}

      <Box sx={{ flex: 1, p: isAptitudeRoute ? 0 : 3 }}>
        {isAptitudeRoute ? <Outlet /> : (
          <>
            {/* Header */}
            <Box
              sx={{
                mb: 3,
                p: 3,
                borderRadius: 4,
                textAlign: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                Aptitude Portal
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                Prepare, Practice & Ace All Rounds 🚀
              </Typography>
            </Box>

            {/* Modules */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                mt: 4,
                width: "100%",
              }}
            >
              {/* Aptitude */}
              <Card
                sx={{
                  width: { xs: "95%", sm: "450px" },
                  borderRadius: 4,
                  backdropFilter: "blur(12px)",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                {aptiCompleted && (
                  <CheckCircleIcon
                    sx={{
                      color: "#4caf50",
                      position: "absolute",
                      top: 14,
                      right: 14,
                      fontSize: 34,
                      background: "#fff",
                      borderRadius: "50%",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    }}
                  />
                )}
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Aptitude
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Button
                    component={Link}
                    to="aptii"
                    fullWidth
                    sx={{
                      mt: 2,
                      borderRadius: 3,
                      py: 1.2,
                      textTransform: "none",
                      fontSize: "16px",
                      background: "linear-gradient(90deg,#ff9966,#ff5e62)",
                    }}
                    variant="contained"
                  >
                    Start
                  </Button>
                </CardContent>
              </Card>

              {/* Group Discussion */}
              <Card
                sx={{
                  width: { xs: "95%", sm: "450px" },
                  borderRadius: 4,
                  backdropFilter: "blur(12px)",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                  position: "relative",
                  transition: "all 0.3s ease",
                  opacity: modulesStatus.apti ? 1 : 0.6,
                  pointerEvents: modulesStatus.apti ? "auto" : "none",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                {!modulesStatus.apti && (
                  <LockIcon sx={{ position: "absolute", top: 14, right: 14, color: "gray" }} />
                )}
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Group Discussion
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {modulesStatus.apti ? (
                    <Button
                      component={Link}
                      to="gd"
                      fullWidth
                      sx={{
                        mt: 2,
                        borderRadius: 3,
                        py: 1.2,
                        textTransform: "none",
                        fontSize: "16px",
                        background: "linear-gradient(90deg,#43cea2,#185a9d)",
                      }}
                      variant="contained"
                    >
                      Start
                    </Button>
                  ) : (
                    <Typography sx={{ mt: 2, fontSize: 14, color: "gray" }}>
                      🔒 Unlock after Aptitude
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Machine Coding */}
              <Card
                sx={{
                  width: { xs: "95%", sm: "450px" },
                  borderRadius: 4,
                  backdropFilter: "blur(12px)",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                  position: "relative",
                  transition: "all 0.3s ease",
                  opacity: modulesStatus.apti ? 1 : 0.6,
                  pointerEvents: modulesStatus.apti ? "auto" : "none",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                {!modulesStatus.apti && (
                  <LockIcon sx={{ position: "absolute", top: 14, right: 14, color: "gray" }} />
                )}
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Machine Coding Round
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {modulesStatus.apti ? (
                    <Button
                      component={Link}
                      to="machine"
                      fullWidth
                      sx={{
                        mt: 2,
                        borderRadius: 3,
                        py: 1.2,
                        textTransform: "none",
                        fontSize: "16px",
                        background: "linear-gradient(90deg,#00b09b,#96c93d)",
                      }}
                      variant="contained"
                    >
                      Start
                    </Button>
                  ) : (
                    <Typography sx={{ mt: 2, fontSize: 14, color: "gray" }}>
                      🔒 Unlock after Aptitude
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

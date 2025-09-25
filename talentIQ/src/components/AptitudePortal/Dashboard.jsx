import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import Sidebar from "../AptitudePortal/Sidebar";
import ModuleCard from "../AptitudePortal/ModuleCard";
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
  useEffect(() => {
    const fetchStatus = async () => {
      if (!student?._id) return;

      try {
        // Check Aptitude test status from backend
        const res = await fetch(`http://localhost:5000/api/results/check/${student._id}`);
        const data = await res.json();

        setModulesStatus({
          apti: !data.allowed,       // if not allowed → test completed
          gd: !data.allowed,         // unlock GD after Aptitude
          machine: !data.allowed,    // unlock Machine Coding after Aptitude
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [student]);

  const isDashboardHome = location.pathname === "/dashboard";

  if (loading) return <Typography>Loading Dashboard...</Typography>;

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        {/* Header */}
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            textAlign: "center",
            background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
            color: "white",
            boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Aptitude Portal
          </Typography>
          <Typography variant="body2">
            Prepare & Test Yourself Across All Rounds 🚀
          </Typography>
        </Box>

        {/* Modules */}
        {isDashboardHome ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              mt: 3,
              width: "100%",
            }}
          >
            {/* Aptitude Module */}
  <Box sx={{ width: "500px", position: "relative" }}>
  <ModuleCard title="Aptitude" route="apti" />
  {aptiCompleted && (
    <CheckCircleIcon
      sx={{
        color: "green",
        position: "absolute",
        top: -10,
        right: -10,
        fontSize: 30,
      }}
    />
  )}
</Box>

            {/* GD Module */}
            <Card
              sx={{
                width: "500px",
                borderRadius: 3,
                boxShadow: 3,
                position: "relative",
                transition: "0.3s",
                opacity: modulesStatus.apti ? 1 : 0.5,
                pointerEvents: modulesStatus.apti ? "auto" : "none",
              }}
            >
              {!modulesStatus.apti && (
                <LockIcon
                  sx={{ position: "absolute", top: 10, right: 10, color: "gray" }}
                />
              )}
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight="600">
                  Group Discussion
                </Typography>
                {modulesStatus.apti ? (
                  <Button
                    component={Link}
                    to="gd"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 2 }}
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

            {/* Machine Coding Module */}
            <Card
              sx={{
                width: "500px",
                borderRadius: 3,
                boxShadow: 3,
                position: "relative",
                transition: "0.3s",
                opacity: modulesStatus.apti ? 1 : 0.5,
                pointerEvents: modulesStatus.apti ? "auto" : "none",
              }}
            >
              {!modulesStatus.apti && (
                <LockIcon
                  sx={{ position: "absolute", top: 10, right: 10, color: "gray" }}
                />
              )}
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight="600">
                  Machine Coding Round
                </Typography>
                {modulesStatus.apti ? (
                  <Button
                    component={Link}
                    to="machine"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 2 }}
                    variant="contained"
                    color="success"
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
        ) : (
          <Outlet />
        )}
      </Box>
    </Box>
  );
}

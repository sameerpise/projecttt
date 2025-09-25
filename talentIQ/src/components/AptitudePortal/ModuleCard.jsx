import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function ModuleCard({ title, route }) {
  return (
    <Link
      to={route || "#"}
      style={{ textDecoration: "none", flex: 1 }}
    >
      <Card
        sx={{
          cursor: "pointer",
          borderRadius: 2,
          boxShadow: 3,
          "&:hover": { boxShadow: 6, transform: "scale(1.03)" },
          transition: "0.3s",
        }}
      >
        <CardContent>
          <Typography variant="h6" align="center">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

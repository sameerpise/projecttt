const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const studentRoutes = require("./routes/studentRoutess");
const questionsRoute = require("./routes/QuestionsRoutes");
const adminRoutes = require("./routes/adminroute");
const resultsRouter = require('./routes/result');
 
dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/questions",questionsRoute);
app.use("/api/admin",adminRoutes);
app.use('/api/results', resultsRouter);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

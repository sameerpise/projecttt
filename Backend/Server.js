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
const allowedOrigins = [
  "http://localhost:5173",               // local dev
  "https://projecttt-1611.onrender.com"  // your deployed frontend
];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
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

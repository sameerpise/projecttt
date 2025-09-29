const express = require("express");
const Student = require("../Models/studentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authmiddlewaree");

const router = express.Router();

// Register student
router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    const existing = await Student.findOne({ email: data.email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const student = new Student(data);
    await student.save();

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "Student registered successfully", student, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login student
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", student, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected route example
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);
    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ fullName: 1 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});
module.exports = router;

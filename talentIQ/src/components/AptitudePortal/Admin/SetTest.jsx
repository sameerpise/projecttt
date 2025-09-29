import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
  Alert,
  MenuItem,
} from "@mui/material";

export default function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: "easy",
  });
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    const res = await fetch("http://localhost:5000/api/questions");
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ✅ Validation function
  const validateForm = () => {
    if (!form.question.trim()) {
      setError("Question text is required.");
      return false;
    }
    if (form.options.some((opt) => !opt.trim())) {
      setError("All options must be filled in.");
      return false;
    }
    if (!form.correctAnswer.trim()) {
      setError("Correct answer is required.");
      return false;
    }
    if (!form.difficulty.trim()) {
      setError("Difficulty must be selected.");
      return false;
    }
    setError(""); // clear error
    return true;
  };

  const handleAddQuestion = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:5000/api/questions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(data.message);

      setForm({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        difficulty: "easy",
      });
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
      >
        Question Manager
      </Typography> */}

      <Paper
        elevation={4}
        sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: "background.paper" }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: "bold", color: "text.secondary" }}
        >
          Add New Question
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Question Text"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={2}>
          {form.options.map((opt, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <TextField
                fullWidth
                label={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOptions = [...form.options];
                  newOptions[i] = e.target.value;
                  setForm({ ...form, options: newOptions });

                  // If current correct answer is empty or invalid, reset it
                  if (!newOptions.includes(form.correctAnswer)) {
                    setForm((prev) => ({ ...prev, correctAnswer: "" }));
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={8}>
            <TextField
              select
              fullWidth
              label="Correct Answer"
              value={form.correctAnswer}
              onChange={(e) =>
                setForm({ ...form, correctAnswer: e.target.value })
              }
                sx={{ minWidth: 200 }}
            >
              {form.options.map((opt, i) => (
                <MenuItem key={i} value={opt}>
                  {opt || `Option ${i + 1}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Difficulty"
              value={form.difficulty}
              onChange={(e) =>
                setForm({ ...form, difficulty: e.target.value })
              }
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3, borderRadius: 2, px: 4 }}
          onClick={handleAddQuestion}
        >
          Add Question
        </Button>
      </Paper>
    </Box>
  );
}

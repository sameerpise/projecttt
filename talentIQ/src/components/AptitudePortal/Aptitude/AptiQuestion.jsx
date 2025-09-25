import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  LinearProgress,
  Button,
  Modal,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchQuestions,
  setAnswer,
  nextQuestion,
  prevQuestion,
  decrementTimer,
  saveResult,
} from "../../Redux/questionSlice";
import { useNavigate } from "react-router-dom";

export default function AptitudePortal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const student = useSelector((state) => state.student.student);
  const { questions, answers, currentQuestion, timer, status } = useSelector(
    (state) => state.quiz
  );

  const [checked, setChecked] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
const testCompleted = localStorage.getItem("aptiCompleted") === "true";

useEffect(() => {
  if (!student?._id) return;

  const checkEligibility = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/results/check/${student._id}`);
      const data = await res.json();
      if (!data.allowed) {
        alert("You have already submitted the test. Wait for admin to allow retest.");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  checkEligibility();
}, [student, navigate]);





  // Fetch questions on mount
  useEffect(() => {
    if (status === "idle") dispatch(fetchQuestions());
  }, [status, dispatch]);

  // Timer
  const handleFinish = useCallback(async () => {
    if (!student?._id) return alert("Student not logged in");

    const questionIds = questions.map((q) => q._id ?? q.id);
    const answersArray = questions.map((_, idx) => answers[idx] ?? "");

    try {
      await dispatch(
        saveResult({ studentId: student._id, questionIds, answers: answersArray })
      ).unwrap();

      localStorage.setItem("aptiCompleted", "true");
      window.dispatchEvent(new Event("storage"));
      setOpenModal(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to save result");
    }
  }, [answers, dispatch, navigate, questions, student]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer <= 0) handleFinish();
      else dispatch(decrementTimer());
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, dispatch, handleFinish]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (tabSwitchCount < 3) {
          const warningNumber = tabSwitchCount + 1;
          setSnackbarMsg(`⚠ Warning ${warningNumber}: Don't switch tabs!`);
          setOpenSnackbar(true);
          setTabSwitchCount((prev) => prev + 1);
        } else {
          setSnackbarMsg("❌ Maximum warnings reached. Submitting test...");
          setOpenSnackbar(true);
          setTimeout(() => {
            handleFinish();
          }, 1000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tabSwitchCount, handleFinish]);

  if (status === "loading") return <Typography>Loading Questions...</Typography>;
  if (status === "failed") return <Typography>Error loading questions</Typography>;
  if (!questions.length) return <Typography>No questions found</Typography>;

  const q = questions[currentQuestion];
  const userAnswer = answers[currentQuestion];

  const handleSelect = (value) => {
    dispatch(setAnswer({ questionIndex: currentQuestion, answer: value }));
  };

  const handleNext = () => {
    setChecked(false);
    if (currentQuestion < questions.length - 1) dispatch(nextQuestion());
    else handleFinish();
  };

  const handlePrev = () => {
    setChecked(false);
    dispatch(prevQuestion());
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        bgcolor: "#f6f7f8ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        position: "relative",
        top: "-30px",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 3,
          boxShadow: 4,
          p: 2,
          height: "490px",
        }}
      >
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle2" color="textSecondary">
              Question {currentQuestion + 1} / {questions.length}
            </Typography>
            <Typography variant="subtitle2" color="primary" fontWeight="bold">
              ⏱ {formatTime(timer)}
            </Typography>
          </Box>

          {/* Progress */}
          <LinearProgress
            variant="determinate"
            value={((currentQuestion + 1) / questions.length) * 100}
            sx={{ mb: 2, height: 8, borderRadius: 5 }}
            color="success"
          />

          {/* Question */}
          <Typography variant="body1" sx={{ mb: 2 }}>
            {q.question}
          </Typography>

          {/* Options */}
          <RadioGroup value={userAnswer || ""} onChange={(e) => handleSelect(e.target.value)}>
            {q.options.map((opt, i) => (
              <FormControlLabel
                key={i}
                value={opt}
                control={<Radio />}
                label={opt}
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: 1.5,
                  border:
                    checked && opt === q.answer
                      ? "2px solid green"
                      : checked && userAnswer === opt && opt !== q.answer
                      ? "2px solid red"
                      : "1px solid #ccc",
                  bgcolor:
                    checked && opt === q.answer
                      ? "#e0f7e9"
                      : checked && userAnswer === opt && opt !== q.answer
                      ? "#ffe3e3"
                      : "#fff",
                  transition: "0.2s",
                  "&:hover": { bgcolor: "#f5f5f5" },
                  fontSize: "0.9rem",
                }}
              />
            ))}
          </RadioGroup>

          <Divider sx={{ my: 2 }} />

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" onClick={handlePrev} disabled={currentQuestion === 0} size="small">
              Previous
            </Button>
            <Button variant="contained" color="success" onClick={handleNext} disabled={!userAnswer} size="small">
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>

          {/* Submit Test */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="contained" color="error" onClick={handleFinish} disabled={testCompleted}>
              🚪 Submit Test
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Completion Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper
          sx={{
            width: 350,
            p: 3,
            borderRadius: 3,
            mx: "auto",
            mt: "15%",
            textAlign: "center",
            boxShadow: 8,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: "primary.main" }}>
            🎉 Test Completed!
          </Typography>
          <Typography sx={{ color: "gray", fontSize: "0.9rem" }}>
            Redirecting to Dashboard...
          </Typography>
        </Paper>
      </Modal>

      {/* Tab-switch Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
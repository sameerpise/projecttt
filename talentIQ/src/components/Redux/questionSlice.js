import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all questions from API
export const fetchQuestions = createAsyncThunk(
  "quiz/fetchQuestions",
  async () => {
    const res = await fetch("https://projecttt-15.onrender.com/api/questions");
    if (!res.ok) throw new Error("Failed to fetch questions");
    return res.json();
  }
);

// Save results
export const saveResult = createAsyncThunk(
  "quiz/saveResult",
  async ({ studentId, questionIds, answers }, { rejectWithValue }) => {
    try {
      const res = await fetch("https://projecttt-15.onrender.com/api/results/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, questionIds, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save result");
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Save failed");
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    questions: [],
    answers: [], // Will hold answer for each question
    currentQuestion: 0,
    timer: 60 * 60,
    status: "idle",
    error: null,
  },
  reducers: {
    setAnswer: (state, action) => {
      const { questionIndex, answer } = action.payload;
      state.answers[questionIndex] = answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuestion < state.questions.length - 1)
        state.currentQuestion += 1;
    },
    prevQuestion: (state) => {
      if (state.currentQuestion > 0) state.currentQuestion -= 1;
    },
    decrementTimer: (state) => {
      if (state.timer > 0) state.timer -= 1;
    },
    resetQuiz: (state) => {
      state.answers = [];
      state.currentQuestion = 0;
      state.timer = 60 * 60;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.questions = action.payload;
        // Pre-initialize answers array for all questions
        state.answers = Array(action.payload.length).fill("");
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveResult.pending, (state) => {
        state.status = "saving";
        state.error = null;
      })
      .addCase(saveResult.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(saveResult.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setAnswer, nextQuestion, prevQuestion, decrementTimer, resetQuiz } =
  quizSlice.actions;

export default quizSlice.reducer;

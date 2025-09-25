import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "./studentslice";
import quizReducer from "./questionSlice";
export const store = configureStore({
  reducer: {
    student: studentReducer,
    quiz: quizReducer,
  },
});

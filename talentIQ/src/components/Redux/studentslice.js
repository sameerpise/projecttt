import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  student: JSON.parse(localStorage.getItem("student")) || null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudent: (state, action) => {
      state.student = action.payload;
      localStorage.setItem("student", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.student = null;
      localStorage.removeItem("student");
    },
  },
});

export const { setStudent, logout } = studentSlice.actions;
export default studentSlice.reducer;

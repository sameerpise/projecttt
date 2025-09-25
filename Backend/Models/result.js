const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }],
    answers: [{ type: String, required: false }],
    score: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    notAnswered: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent model overwrite on hot-reload
module.exports = mongoose.models.Result || mongoose.model("Result", resultSchema);

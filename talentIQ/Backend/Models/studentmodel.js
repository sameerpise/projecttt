const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  department: { type: String, required: true },
  pursuingYear: { type: String, required: true },
  college: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String },
  dob: { type: Date, required: true },
  password: { type: String, required: true },
  testGiven: { type: Boolean, default: false },
  retestCount: { type: Number, default: 0 },
}, { timestamps: true });

// Hash password before saving
studentSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);

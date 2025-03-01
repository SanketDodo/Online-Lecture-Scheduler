const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  meetingLink: String,
});

module.exports = mongoose.model("Lecture", LectureSchema);

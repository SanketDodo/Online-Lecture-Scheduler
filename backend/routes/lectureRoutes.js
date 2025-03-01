const express = require("express");
const Lecture = require("../models/Lecture");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// 🔹 Create a Lecture (Only Teacher/Admin)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, date, time, teacher, students, meetingLink } = req.body;

    // Check if the user has permission to create
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized: Only teachers or admins can create lectures" });
    }

    const lecture = new Lecture({ title, date, time, teacher, students, meetingLink });
    await lecture.save();
    res.json({ message: "Lecture created successfully", lecture });
  } catch (error) {
    console.error("Error creating lecture:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Get all lectures (Anyone can view)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const lectures = await Lecture.find().populate("teacher students");
    res.json(lectures);
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Update a Lecture (Only Teacher/Admin)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, date, time, meetingLink } = req.body;
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    // Check if user has permission
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized: Only teachers or admins can update lectures" });
    }

    // Update fields
    lecture.title = title || lecture.title;
    lecture.date = date || lecture.date;
    lecture.time = time || lecture.time;
    lecture.meetingLink = meetingLink || lecture.meetingLink;

    await lecture.save();
    res.json({ message: "Lecture updated successfully", lecture });
  } catch (error) {
    console.error("Error updating lecture:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Delete a Lecture (Only Teacher/Admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    // Check if user has permission
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized: Only teachers or admins can delete lectures" });
    }

    await lecture.deleteOne();
    res.json({ message: "Lecture deleted successfully" });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

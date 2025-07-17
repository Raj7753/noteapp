const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Note = require("../models/Note");

// ✅ Test route
router.get("/test", (req, res) => {
  res.send("✅ Notes route is working");
});

// ✅ Create a new note
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const newNote = new Note({
      title,
      content,
      user: req.user.id,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("❌ Error creating note:", error);
    res.status(500).json({ message: "Server error while creating note" });
  }
});

// ✅ Get all notes for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("❌ Error fetching notes:", error);
    res.status(500).json({ message: "Server error while fetching notes" });
  }
});

// ✅ Get a single note by ID
router.get("/:id", authMiddleware, async (req, res) => {
  const noteId = req.params.id;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({ message: "Invalid note ID" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, user: req.user.id });

    if (!note) {
      return res.status(404).json({ message: "Note not found or not authorized" });
    }

    res.json(note);
  } catch (error) {
    console.error("❌ Error while fetching note:", error);
    res.status(500).json({ message: "Server error while fetching note" });
  }
});

// ✅ Delete a note by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  const noteId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({ message: "Invalid note ID" });
  }

  try {
    const note = await Note.findOneAndDelete({ _id: noteId, user: req.user.id });

    if (!note) {
      return res.status(404).json({ message: "Note not found or not authorized" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting note:", error);
    res.status(500).json({ message: "Server error while deleting note" });
  }
});

// ✅ Update a note by ID
router.put("/:id", authMiddleware, async (req, res) => {
  const noteId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({ message: "Invalid note ID" });
  }

  const { title, content } = req.body;

  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: req.user.id },
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found or not authorized" });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error("❌ Error updating note:", error);
    res.status(500).json({ message: "Server error while updating note" });
  }
});

module.exports = router;

const express = require("express");

const {
  getMessages,
  createMessage,
} = require("../controllers/messageController");

const router = express.Router();

// GET /api/messages
router.get("/", getMessages);

// POST /api/messages
router.post("/", createMessage);

module.exports = router;
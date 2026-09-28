const Message = require("../models/Message");

// Get chat history
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};

// Send a message
const createMessage = async (req, res) => {
  try {
    const { username, text } = req.body;

    if (!username || !text) {
      return res.status(400).json({
        message: "Username and message are required",
      });
    }

    const message = await Message.create({
      username,
      text,
    });

    // Broadcast the message to all connected clients
    req.io.emit("newMessage", message);

    res.status(201).json(message);
  } catch (error) {
    console.error("Create message error:", error);

    res.status(500).json({
      message: "Failed to send message",
    });
  }
};

module.exports = {
  getMessages,
  createMessage,
};
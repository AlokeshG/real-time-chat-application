const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Real-Time Chat API is running",
  });
});
app.use("/api/messages", messageRoutes);
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
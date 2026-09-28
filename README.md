# Real-Time Chat Application

A real-time chat application built with React Native (Expo), Node.js, Express.js, Socket.io, and MongoDB.

## Features

- Real-time messaging using Socket.io
- REST API for sending and fetching messages
- MongoDB message persistence
- Username-based chat
- Message timestamps
- Previous messages loaded after refresh
- Online/offline connection status
- Multiple users can communicate in real time
- Clean and responsive chat interface

## Tech Stack

### Frontend
- React Native
- Expo
- TypeScript
- Axios
- Socket.io Client

### Backend
- Node.js
- Express.js
- Socket.io
- Mongoose
- MongoDB

## Project Structure

```text
realtime-chat-app/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md

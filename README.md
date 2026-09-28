# Real-Time Chat Application

A real-time chat application built using React Native (Expo), Node.js, Express.js, Socket.io, and MongoDB.

## Features

- Real-time messaging using Socket.io
- REST API for sending messages
- REST API for fetching previous messages
- MongoDB message persistence
- Username-based chat
- Message timestamps
- Online/offline connection status
- Multiple users can communicate in real time
- Previous messages are restored after refreshing the application
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
- MongoDB
- Mongoose

## Project Structure

```text
real-time-chat-application/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── messageController.js
│   │   ├── models/
│   │   │   └── Message.js
│   │   ├── routes/
│   │   │   └── messageRoutes.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   └── config/
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md

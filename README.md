# Real-Time Chat Application

A full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io.

## Features

- **Real-Time Messaging**: Send and receive messages instantly using Socket.io.
- **Message Persistence**: All messages are stored in MongoDB.
- **Delete Functionality**:
  - **Delete for Me**: Hides the message only for the current user.
  - **Delete for Everyone**: Marks the message as deleted globally and replaces its content.
- **Pin Messages**: Pin/unpin messages to highlight important information.
- **Static User System**: Switch between different users to simulate a multi-user environment.
- **Modern UI**: Clean, responsive interface styled with Tailwind CSS and Lucide icons.

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide React, Axios, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, Mongoose.
- **Database**: MongoDB.

## Project Structure

```text
├── backend/
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── sockets/          # Socket.io event handlers
│   ├── server.js         # Entry point
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── services/     # API services
│   │   ├── App.jsx       # Main app component
│   │   ├── socket.js     # Socket.io configuration
│   │   └── index.css     # Global styles (Tailwind)
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd real-time-chat-app
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/chat-app
   ```
   Start the backend server:
   ```bash
   npm start
   ```

3. **Seed Database (Optional)**:
   If you want to populate the database with initial sample data:
   ```bash
   cd backend
   npm run seed
   ```

4. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Messages

- **GET `/api/messages`**: Fetch all messages.
- **POST `/api/messages`**: Send a new message.
- **DELETE `/api/messages/:id`**: Delete a message.
  - Body: `{ "type": "me" | "everyone", "userId": "string" }`
- **PATCH `/api/messages/:id/pin`**: Toggle pin status of a message.

## Design Decisions

- **Socket.io vs Polling**: Socket.io was chosen for real-time updates as it provides lower latency and bidirectional communication compared to traditional HTTP polling.
- **Pin UX**: Only one message is highlighted at a time in the header for better focus, although multiple messages can be marked as pinned in the chat history.
- **Static Auth**: To focus on the core chat features, a simple static user selection system was implemented instead of a full authentication system.

## Deployment Guide

### Frontend (Vercel)
1. Push the code to GitHub.
2. Connect your repository to Vercel.
3. Set the root directory to `frontend`.
4. Add environment variables: `VITE_API_URL` and `VITE_SOCKET_URL`.

### Backend (Render)
1. Connect your repository to Render.
2. Choose "Web Service".
3. Set the root directory to `backend`.
4. Set the build command to `npm install`.
5. Set the start command to `node server.js`.
6. Add environment variables: `MONGODB_URI` and `PORT`.

### MongoDB (Atlas)
1. Create a free cluster on MongoDB Atlas.
2. Whitelist your IP and create a database user.
3. Get the connection string and use it in your backend `.env`.

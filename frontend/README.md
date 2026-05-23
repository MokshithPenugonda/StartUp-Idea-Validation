# StartupScope - Startup Idea Validation Platform

A production-ready MERN stack application for founders to validate ideas and users to provide structured feedback.

## Features
- **User Roles**: Separate permissions for Users, Founders, and Admins.
- **Idea Management**: Founders can post detailed startup concepts.
- **Community Interaction**: Voting (one per user), commenting, and waiting lists.
- **Notifications**: Real-time alerts for engagement on your ideas.
- **Analytics**: Beautiful charts visualizing interest over time.

## Tech Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, JWT Authentication, Bcrypt.
- **Database**: MongoDB (Mongoose).

## Setup & Run

### 1. Prerequisites
- Node.js installed.
- MongoDB Atlas URI.

### 2. Backend Setup
```bash
cd backend
npm install
```
Edit `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```
Start Backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Production Architecture
- **MVC Structure**: Backend controllers separated from routes and models.
- **RBAC**: Middleware-based role authorization for all sensitive endpoints.
- **Security**: Password hashing with salt, JWT protected routes.

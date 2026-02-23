# BrightBolt - Quiz Management System

**BrightBolt** is a full-stack MERN application designed for creating, managing, and taking quizzes. It features separate Admin and User interfaces, role-based authentication, real-time timers, and result tracking.

## Author

**Rahul Gupta**
- GitHub: [rahulg8454](https://github.com/rahulg8454)
- Email: rahul01.org@gmail.com

---

## Features

### Admin Interface
- **Quiz Management:** Create, update, and delete quizzes
- **Question Management:** Add and manage quiz questions with categories
- **Time Limit Settings:** Set custom time limits for each quiz
- **User Management:** Add, edit, and delete users
- **Analytics Dashboard:** View user progress and quiz results

### User Interface
- **Quiz Participation:** Browse and take quizzes with passcode protection
- **Real-time Timer:** Countdown timer for each quiz session
- **Result Tracking:** View scores and leaderboard after quiz completion
- **Authentication:** Secure login and registration

---

## Tech Stack

- **Frontend:** React.js, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

---

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/rahulg8454/BrightBolt.git
cd BrightBolt
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder (copy from `.env.example`):

```env
MONGODB_URI=mongodb://localhost:27017/brightbolt
PORT=4000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The backend runs on **http://localhost:4000**

### 3. User Frontend Setup

```bash
cd userFrontend
npm install
```

Create a `.env` file in the `userFrontend` folder (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:4000
```

Start the user frontend:

```bash
npm run dev
```

The user frontend runs on **http://localhost:5173**

### 4. Admin Frontend Setup

```bash
cd AdminFrontend
npm install
```

Create a `.env` file in the `AdminFrontend` folder (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:4000
```

Start the admin frontend:

```bash
npm run dev
```

The admin frontend runs on **http://localhost:5174**

---

## Running All Services

You need **3 terminal windows** running simultaneously:

| Terminal | Directory | Command | URL |
|----------|-----------|---------|-----|
| 1 | `Backend` | `npm run dev` | http://localhost:4000 |
| 2 | `userFrontend` | `npm run dev` | http://localhost:5173 |
| 3 | `AdminFrontend` | `npm run dev` | http://localhost:5174 |

---

## Project Structure

```
BrightBolt/
├── Backend/          # Express.js API server
│   ├── controllers/  # Route handlers
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   ├── index.js      # Entry point
│   └── .env.example  # Environment variables template
├── userFrontend/     # React user-facing app (port 5173)
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── .env.example
└── AdminFrontend/    # React admin dashboard (port 5174)
    ├── src/
    │   ├── components/
    │   └── pages/
    └── .env.example
```

---

## License

MIT License - Created by Rahul Gupta

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
- **Take Quizzes:** Access quizzes assigned by the admin
- **Real-time Timer:** Countdown timer while taking quizzes
- **Result Tracking:** View scores and performance after each quiz

### Authentication & Security
- **Role-based Auth:** Separate Admin and User login flows
- **JWT Tokens:** Secure token-based authorization
- **Bcrypt:** Passwords hashed securely

---

## Tech Stack

### Frontend
- **React.js** + **Vite** - UI framework and build tool
- **Material-UI** - Component library
- **Axios** - HTTP requests
- **React Router v7** - Client-side routing

### Backend
- **Node.js** + **Express.js** - Server and REST API
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing

---

## Project Structure

```
BrightBolt/
├── Backend/              # Node.js + Express REST API
│   ├── controllers/      # Route handler logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── index.js          # Server entry point
│   └── .env              # Environment variables (not committed)
├── AdminFrontend/        # React + Vite (Admin UI)
│   └── src/
│       ├── components/   # Reusable components
│       ├── pages/        # Dashboard, Quiz, User management pages
│       └── styles/       # CSS files
├── userFrontend/         # React + Vite (User UI)
│   └── src/
│       ├── components/   # Reusable components
│       ├── pages/        # Home, Login, Quiz, Result pages
│       └── styles/       # CSS files
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/rahulg8454/BrightBolt.git
cd BrightBolt
```

### 2. Set Up Environment Variables

**Backend/.env** (create this file):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=4000
CLIENT_URL=http://localhost:5173
```

**userFrontend/.env** (create this file):
```
VITE_API_URL=http://localhost:4000
```

**AdminFrontend/.env** (create this file):
```
VITE_API_URL=http://localhost:4000
```

### 3. Install Dependencies

```bash
# Backend
cd Backend && npm install

# User Frontend
cd ../userFrontend && npm install

# Admin Frontend
cd ../AdminFrontend && npm install
```

### 4. Run Development Servers

Open **3 terminals**:

```bash
# Terminal 1 - Backend (http://localhost:4000)
cd Backend
npm run dev

# Terminal 2 - User Frontend (http://localhost:5173)
cd userFrontend
npm run dev

# Terminal 3 - Admin Frontend (http://localhost:5174)
cd AdminFrontend
npm run dev
```

### 5. Access the App

| Service | URL |
|---|---|
| User App | http://localhost:5173 |
| Admin App | http://localhost:5174 |
| Backend API | http://localhost:4000 |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/users/login | User login |
| POST | /api/login | Admin login |
| POST | /api/register | Admin signup |
| GET | /api/quizzes | Get all quizzes |
| POST | /api/create-quiz | Create a quiz |
| GET | /api/categories | Get all categories |
| GET | /api/users | Get all users |
| GET | /api/dashboard-stats | Dashboard statistics |

---

## License

This project is licensed under the MIT License.

---

Built with MERN Stack by **Rahul Gupta**

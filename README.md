# BrightBolt

A quiz platform I built as a personal project to learn full-stack development. It has two separate frontends — one for users to take quizzes and one for admins to manage everything.

Built with the MERN stack (MongoDB, Express, React, Node.js).

## What it does

**Admin side:**
- Create and manage quizzes with passcodes and time limits
- Add questions with 4 options and select which one is the correct answer
- Add users and set individual passwords for each user
- View quiz results and attempt stats on the dashboard

**User side:**
- Login and browse available quizzes
- Enter passcode to start a quiz, timer runs during the attempt
- After submitting, see score with correct/wrong breakdown
- Quiz history is saved so you can track past attempts

## Tech used

- React (Vite)
- Node.js + Express
- MongoDB (Atlas)
- JWT for auth
- Deployed on Vercel

## Running locally

You need 3 terminals open at the same time.

```bash
# Terminal 1 - Backend
cd Backend
npm install
npm run dev
# runs on http://localhost:4000

# Terminal 2 - User frontend
cd userFrontend
npm install
npm run dev
# runs on http://localhost:5173

# Terminal 3 - Admin frontend
cd AdminFrontend
npm install
npm run dev
# runs on http://localhost:5174
```

### Environment variables

Copy `.env.example` to `.env` in each folder and fill in your values.

**Backend `.env`:**
```
MONGODB_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=anything_random_here
CLIENT_URL=http://localhost:5173,http://localhost:5174
```

**userFrontend and AdminFrontend `.env`:**
```
VITE_API_URL=http://localhost:4000
```

## Notes

- Admin account is created directly in the database (no public signup for admin)
- Users are created by the admin only — each user gets their own password
- Contact/support page has admin email for any issues

## Author

Rahul Gupta
rahul01.org@gmail.com
https://www.linkedin.com/in/rahul-gupta-077526277/


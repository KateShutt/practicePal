# 🎶 PracticePal

## App in development! Functionality is there, but styling still to be applied!

PracticePal is a full-stack web application that helps musicians track their practice sessions, manage instruments, and monitor progress over time.

The app allows users to register, log in securely, add instruments, and log structured practice entries including duration, category, and date.

This project demonstrates a complete production-ready setup with a deployed frontend, backend API, and cloud-hosted database.

## 🌍 Live Demo

Frontend: https://practice-pal-sooty.vercel.app <br>
Backend API: https://practicepal-85r6.onrender.com/api/health

## 🛠️ Tech Stack

### Frontend

- React (Vite)
- React Router
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication

### Database

- MySQL (hosted on Railway)

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: Railway

## ✨ Features

- User authentication (register & login with JWT)
- Protected routes for authenticated users
- Add and manage instruments
- Log practice sessions with:
  - date
  - duration
  - category
  - instrument
  - piece title
  - notes
- Relational database structure with foreign keys
- Full CRUD functionality for practice entries
- Responsive frontend UI

## 🧩 Architecture

- React frontend communicates with Express API
- Express server handles authentication and business logic
- MySQL database stores users, instruments, and practice entries
- JWT used for secure authentication
- Deployed across multiple services (Vercel, Render, Railway)

## ⚙️ Environment Variables

### Backend (.env)

- DB_HOST - database host
- DB_PORT - database port
- DB_USER - database username
- DB_PASSWORD - database password
- DB_NAME - database name
- JWT_SECRET - secret key for authentication

### Frontend (.env)

- VITE_API_URL

## 🚀 Running Locally

### 1. Clone repo

git clone https://github.com/your-username/practicePal.git

### 2. Backend

cd backend  
npm install  
npm run dev

### 3. Frontend

cd frontend  
npm install  
npm run dev

## ⚠️ Known Limitations

- Backend may take time to wake up due to free hosting (Render cold starts)
- No password reset functionality yet

## 📈 Future Improvements

- CSS STYLING!!
- Password reset / email authentication
- Dashboard - ability to display optional practice entry fields piece_title and notes
- Dashboard - ability to access all practice entries, not just the last week that is visible currently
- Ability for user to set practice goals and display progress using progress bar or similar.
- Data visualisation (charts for practice trends)
- Improved UI/UX and mobile responsiveness
- Role-based access (teacher/student features)
- Deployment optimisation (remove cold starts)

## 🧠 Key Learning Outcomes

- Implemented JWT-based authentication and protected routes
- Designed a relational database schema with foreign key relationships
- Built and deployed a full-stack app across multiple cloud platforms
- Managed environment variables and secure configuration

## 🧑‍💻 Author

Kate Shuttleworth  
GitHub: https://github.com/KateShutt

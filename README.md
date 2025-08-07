# Calendar.io - Modern MERN Calendar App

A full-featured, production-ready calendar application built with the MERN stack (MongoDB, Express.js, React, Node.js). Includes JWT authentication, email reminders, event filtering, and a beautiful, responsive UI.

---

## 🚀 Features
- **React Big Calendar** for interactive scheduling
- **JWT Authentication** (secure, stateless sessions)
- **MongoDB Atlas** for cloud data storage
- **Email Reminders** with Nodemailer & node-cron
- **Event Filtering** by date, category, and search
- **Recurring Events** (daily, weekly, monthly, yearly)
- **User Profiles** and preferences
- **Responsive UI** with Tailwind CSS
- **RESTful API** with Express.js
- **Security**: Helmet, CORS, rate limiting, bcrypt
- **Modern Codebase**: ES6+, React Context, hooks, modular structure

---

## 🛠️ Tech Stack
- **Frontend**: React 18, React Big Calendar, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcrypt, Nodemailer, node-cron
- **Database**: MongoDB Atlas
- **Dev Tools**: ESLint, Prettier, VSCode, npm scripts

---

## 📦 Folder Structure
```
Calendar.io_MERN_App/
├── Backend/      # Express API, MongoDB models, controllers, routes
├── Frontend/     # React app, components, pages, contexts, styles
├── .gitignore    # Git ignore rules
├── README.md     # This file
```

---

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/calendar.io.git
cd calendar.io
```

### 2. Install dependencies
```bash
cd Backend && npm install
cd ../Frontend && npm install
```

### 3. Configure environment variables
- **Backend**: Edit `Backend/config.env` with your MongoDB URI, JWT secret, and email credentials.
- **Frontend**: (Optional) Edit `Frontend/.env` for custom API URL.

### 4. Start the app
- **Backend**:
  ```bash
  cd Backend
  npm run dev
  ```
- **Frontend**:
  ```bash
  cd Frontend
  npm start
  ```

### 5. Open in browser
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Environment Variables

### Backend (`Backend/config.env`)
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM=your_email@gmail.com
NODE_ENV=development
```

### Frontend (`Frontend/.env`)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

---

## 📜 Scripts
- `npm run dev` (Backend): Start Express server with nodemon
- `npm start` (Frontend): Start React development server
- `npm run build` (Frontend): Build React app for production

---

## 🛡️ Security & Best Practices
- Passwords hashed with bcrypt
- JWT for stateless authentication
- Helmet for HTTP headers
- CORS and rate limiting
- Input validation with express-validator
- Environment variables for secrets

---

## 🚀 Deployment
- Deploy backend to Heroku, Render, or any Node.js host
- Deploy frontend to Vercel, Netlify, or static hosting
- Use MongoDB Atlas for managed database
- Set environment variables in your deployment platform

---

## 🤝 Contributing
1. Fork the repo and create your branch
2. Commit your changes with clear messages
3. Add tests if applicable
4. Open a pull request

---

## 📄 License
MIT License

---

## 🙏 Acknowledgments
- [React Big Calendar](https://github.com/jquense/react-big-calendar)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Nodemailer](https://nodemailer.com/)

---

**Happy Scheduling!** 
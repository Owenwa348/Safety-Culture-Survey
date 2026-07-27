// server.js (ส่วนที่เกี่ยวข้อง)

const express = require('express');
const cors = require('cors');
const registerRoutes = require('./routes'); // Import the central route registrar


const app = express();
require('dotenv').config(); // Load environment variables

// CORS - รองรับทั้ง Development และ Docker
const allowedOrigins = [
  'http://localhost:5173',   // Vite dev server (เดิม)
  'http://localhost:5174',   // Vite dev server (ตาม vite.config.ts ปัจจุบัน)
  'http://localhost',        // Docker frontend (port 80)
  'http://localhost:80',     // Docker frontend (explicit port)
  'http://72.61.114.233',    // Production server (nginx port 80)
  'http://72.61.114.233:80'  // Production server (explicit port)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes
registerRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
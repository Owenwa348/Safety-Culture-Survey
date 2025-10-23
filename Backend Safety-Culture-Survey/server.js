// server.js (ส่วนที่เกี่ยวข้อง)
const express = require('express');
const cors = require('cors');
const registerRoutes = require('./routes'); // Import the central route registrar

const app = express();

// CORS - ต้องอยู่ก่อน routes
app.use(cors({
  origin: 'http://localhost:5173', // URL ของ Vue (ตรวจสอบ port)
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
// server.js (ส่วนที่เกี่ยวข้อง)
const express = require('express');
const cors = require('cors');
const excelUploadRouter = require('./routes/UploadExcel/excelUploadRoutes'); // ตรวจสอบ path
const adminAuthRoutes = require('./routes/Admin/adminAuthRoutes'); // Import admin routes

// เพิ่ม routes ใหม่
const departmentRoutes = require('./routes/Department/departmentRoutes');
const experienceRoutes = require('./routes/Experience/experienceRoutes');
const positionRoutes = require('./routes/Position/positionRoutes');
const workGroupRoutes = require('./routes/Workgroup/workGroupRoutes');

// เพิ่มตัวคำถาม
const categoryRoutes = require('./routes/Category/categoryRoutes');
const questionRoutes = require('./routes/Questions/questionRoutes');

const app = express();

// CORS - ต้องอยู่ก่อน routes
app.use(cors({
  origin: 'http://localhost:5173', // URL ของ Vue (ตรวจสอบ port)
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Existing routes
app.use('/excel-upload', excelUploadRouter);
app.use('/api/admin', adminAuthRoutes);

// --- custom routes สำหรับหน้าจัดการข้อมูล ---
app.use('/api/departments', departmentRoutes)
app.use('/api/experiences', experienceRoutes)
app.use('/api/positions', positionRoutes)
app.use('/api/workgroups', workGroupRoutes)

// Routes สำหรับคำถาม
app.use('/api/categories', categoryRoutes)
app.use('/api/questions', questionRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

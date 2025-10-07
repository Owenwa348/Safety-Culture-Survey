const express = require('express');
const cors = require('cors');
const excelUploadRouter = require('./routes/excelUploadRoutes'); // ตรวจสอบ path

const app = express();

// CORS - ต้องอยู่ก่อน routes
app.use(cors({
  origin: 'http://localhost:5173', // URL ของ Vue (ตรวจสอบ port)
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/excel-upload', excelUploadRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
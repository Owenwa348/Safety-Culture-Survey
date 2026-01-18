// src/index.js
import express from 'express';
import cors from 'cors';
import excelUploadRouter from './excelUpload.js';
import departmentRoutes from './routes/departmentRoutes.js'
import experienceRoutes from './routes/experienceRoutes.js'
import positionRoutes from './routes/positionRoutes.js'
import workGroupRoutes from './routes/workGroupRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import questionRoutes from './routes/questionRoutes.js'

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/excel-upload', excelUploadRouter);
app.use('/api/departments', departmentRoutes)
app.use('/api/experiences', experienceRoutes)
app.use('/api/positions', positionRoutes)
app.use('/api/workgroups', workGroupRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/questions', questionRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

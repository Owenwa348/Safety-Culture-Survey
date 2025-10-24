const excelUploadRouter = require('./UploadExcel/excelUploadRoutes');
const adminAuthRoutes = require('./Admin/adminAuthRoutes');
const superAdminRoutes = require('./SuperAdmin/superAdminRoutes');
const departmentRoutes = require('./Department/departmentRoutes');
const experienceRoutes = require('./Experience/experienceRoutes');
const positionRoutes = require('./Position/positionRoutes');
const workGroupRoutes = require('./Workgroup/workGroupRoutes');
const categoryRoutes = require('./Category/categoryRoutes');
const questionRoutes = require('./Questions/questionRoutes');
const userRoutes = require('./User/userRoutes');


const registerRoutes = (app) => {
  app.use('/excel-upload', excelUploadRouter);
  app.use('/api/admin', adminAuthRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/experiences', experienceRoutes);
  app.use('/api/positions', positionRoutes);
  app.use('/api/workgroups', workGroupRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/questions', questionRoutes);
  app.use('/api/super-admins', superAdminRoutes);
  app.use('/api/users', userRoutes);
};

module.exports = registerRoutes;

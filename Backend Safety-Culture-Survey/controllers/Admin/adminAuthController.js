// controllers/Admin/adminAuthController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getMatchedCompanyIds } = require('../../services/companyService');

// 1. SuperAdmin adds a new Admin
const addAdmin = async (req, res) => {
  const { email, companyName } = req.body;

  if (!email || !companyName) {
    return res.status(400).json({ message: 'Email and company name are required.' });
  }

  try {
    const existingAdmin = await prisma.admin_list.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this email already exists.' });
    }

    const newAdmin = await prisma.admin_list.create({
      data: {
        email,
        companyName,
        role: 'Admin',
        status: 'PENDING',
      },
    });

    res.status(201).json({ message: 'Admin created successfully. Awaiting verification.', admin: newAdmin });
  } catch (error) {
    console.error('Add admin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// For SuperAdminList.vue to display admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin_list.findMany({
      select: {
        id: true,
        email: true,
        companyName: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        joinedAt: true,
      },
    });
    res.status(200).json(admins);
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 2. Admin checks email for first-time setup
const checkAdminEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const admin = await prisma.admin_list.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    if (admin.status !== 'PENDING') {
      return res.status(403).json({ message: 'This account has already been set up. Please log in.' });
    }

    res.status(200).json({
      email: admin.email,
      companyName: admin.companyName,
    });
  } catch (error) {
    console.error('Check admin email error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin completes setup (SetPasswordAdmin.vue)
const setupAdminAccount = async (req, res) => {
  const { email, firstName, lastName, phone, password } = req.body;

  if (!email || !firstName || !lastName || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const admin = await prisma.admin_list.findUnique({ where: { email } });

    if (!admin || admin.status !== 'PENDING') {
      return res.status(404).json({ message: 'Account not found or already activated.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.admin_list.update({
      where: { email },
      data: {
        firstName,
        lastName,
        phone,
        password: hashedPassword,
        status: 'ACTIVE',
        joinedAt: new Date(),
      },
    });

    res.status(200).json({ message: 'Account setup successful. You can now log in.' });
  } catch (error) {
    console.error('Setup admin account error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 3. Admin Management
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, companyName } = req.body;

  try {
    const updatedAdmin = await prisma.admin_list.update({
      where: { id: parseInt(id) },
      data: { firstName, lastName, phone, companyName },
    });
    res.status(200).json({ message: 'Admin updated successfully', admin: updatedAdmin });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const toggleAdminStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['ACTIVE', 'INACTIVE'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  try {
    const admin = await prisma.admin_list.findUnique({ where: { id: parseInt(id) } });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    const updatedAdmin = await prisma.admin_list.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.status(200).json({ message: `Admin status set to ${status}`, admin: updatedAdmin });
  } catch (error) {
    console.error('Toggle admin status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── Download Excel Template ───────────────────────────────────────────────────
const ExcelJS = require('exceljs');

const downloadAdminTemplate = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Safety Culture Survey';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Admin Template', {
      views: [{ state: 'frozen', ySplit: 3 }],
    });

    // ── แถว 1: Title ──────────────────────────────────────────────────────────
    sheet.mergeCells('A1:B1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = '📋  แม่แบบนำเข้าข้อมูล Admin  |  กรอกข้อมูลตั้งแต่แถวที่ 4 เป็นต้นไป';
    titleCell.font      = { bold: true, size: 12, color: { argb: 'FF1E3A5F' } };
    titleCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.border    = {
      top:    { style: 'medium', color: { argb: 'FF2563EB' } },
      left:   { style: 'medium', color: { argb: 'FF2563EB' } },
      right:  { style: 'medium', color: { argb: 'FF2563EB' } },
      bottom: { style: 'thin',   color: { argb: 'FF93C5FD' } },
    };
    sheet.getRow(1).height = 30;

    // ── แถว 2: Header columns ─────────────────────────────────────────────────
    sheet.columns = [
      { key: 'email',       width: 38 },
      { key: 'companyName', width: 80 },
    ];

    // บังคับ column A (Email) เป็น Text format
    // เพื่อป้องกัน Excel auto-convert email เป็น hyperlink
    sheet.getColumn(1).numFmt = '@';

    const headerRow = sheet.getRow(2);
    headerRow.values = ['Email *', 'Company Name *'];
    headerRow.eachCell((cell) => {
      cell.font      = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border    = {
        top:    { style: 'medium', color: { argb: 'FF1E40AF' } },
        left:   { style: 'thin',   color: { argb: 'FF3B82F6' } },
        bottom: { style: 'medium', color: { argb: 'FF1E40AF' } },
        right:  { style: 'thin',   color: { argb: 'FF3B82F6' } },
      };
    });
    headerRow.height = 24;

    // ── แถว 3: คำอธิบาย ───────────────────────────────────────────────────────
    const descRow = sheet.getRow(3);
    descRow.getCell(1).value =
      'กรอก Email ของ Admin เช่น somchai@vertegroup.com';
    descRow.getCell(2).value =
      'กรอกชื่อบริษัท เช่น "Verte Group Thailand"  |  ⚠️ ชื่อด้านหน้าต้องตรงกับที่อัปโหลดรายชื่อผู้ประเมินไว้ในระบบทุกตัวอักษร เช่น ถ้าอัปโหลดว่า "Verte Group Thailand" ให้พิมพ์ขึ้นต้นด้วย "Verte ..." เสมอ  |  ส่วนด้านหลังจะเป็นสาขา/หน่วยงานอะไรก็ได้ เช่น Verte Thailand / Verte Rayong  |  ระบบจะจับคู่เฉพาะคำแรก (word แรกก่อน space) ว่าตรงกับชื่อบริษัทในระบบหรือไม่ เพื่อแสดงบริษัทในเครือทั้งหมดที่ขึ้นต้นด้วยคำเดียวกัน';
    descRow.eachCell((cell) => {
      cell.font      = { size: 9, italic: true, color: { argb: 'FF6B7280' } };
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF7ED' } };
      cell.alignment = { vertical: 'middle', wrapText: true };
      cell.border    = {
        top:    { style: 'thin', color: { argb: 'FFFDE68A' } },
        left:   { style: 'thin', color: { argb: 'FFFDE68A' } },
        bottom: { style: 'thin', color: { argb: 'FFFDE68A' } },
        right:  { style: 'thin', color: { argb: 'FFFDE68A' } },
      };
    });
    descRow.height = 52;

    // ── แถว 4–104: data rows ──────────────────────────────────────────────────
    for (let r = 4; r <= 104; r++) {
      const row = sheet.getRow(r);
      const bgColor = r % 2 === 0 ? 'FFF0F9FF' : 'FFFFFFFF';
      const borderStyle = {
        top:    { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left:   { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right:  { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
      [1, 2].forEach((col) => {
        const cell = row.getCell(col);
        cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
        cell.border = borderStyle;
        // บังคับทุก cell ใน column A เป็น Text ไม่ให้กลายเป็น hyperlink
        if (col === 1) cell.numFmt = '@';
      });
      row.height = 20;
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="admin_template.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Download template error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// ─── Upload Admin Excel ────────────────────────────────────────────────────────
const uploadAdminExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'กรุณาแนบไฟล์ Excel' });
  }

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const sheet = workbook.worksheets[0];
    if (!sheet) {
      return res.status(400).json({ message: 'ไม่พบ Sheet ในไฟล์ Excel' });
    }

    const results = { added: 0, skipped: 0, errors: [] };
    // ──────────────────────────────────────────────────────────────────────────
    // template มีโครงสร้าง:
    //   row 1 = title bar
    //   row 2 = header (Email *, Company Name *)
    //   row 3 = แถวคำอธิบาย (สีส้มอ่อน — ไม่ใช่ข้อมูลจริง)
    //   row 4+ = ข้อมูลจริงที่ผู้ใช้กรอก
    // เริ่มวนจากแถวที่ 4 เลย ไม่ต้องเช็ค example@ อีกต่อไป
    // ──────────────────────────────────────────────────────────────────────────

    for (let rowNumber = 4; rowNumber <= sheet.rowCount; rowNumber++) {
      const row = sheet.getRow(rowNumber);

      // รองรับทั้ง string ปกติ และ hyperlink object
      // (กรณีที่ผู้ใช้กรอก email ในไฟล์เก่าก่อนแก้ หรือ Excel auto-convert)
      const rawEmail = row.getCell(1).value;
      const email = (
        rawEmail && typeof rawEmail === 'object' && rawEmail.text
          ? rawEmail.text        // hyperlink object → ดึง .text
          : rawEmail?.toString() // string ปกติ
      )?.trim();

      const companyName = row.getCell(2).value?.toString().trim();

      if (!email && !companyName) continue;

      if (!email || !companyName) {
        results.errors.push(`แถวที่ ${rowNumber}: Email หรือ Company Name ไม่ครบ`);
        continue;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        results.errors.push(`แถวที่ ${rowNumber}: รูปแบบ Email ไม่ถูกต้อง (${email})`);
        continue;
      }

      try {
        await prisma.admin_list.upsert({
          where:  { email },
          update: { companyName },
          create: {
            email,
            companyName,
            role:   'Admin',
            status: 'PENDING',
          },
        });
        results.added++;
      } catch (dbError) {
        results.errors.push(`แถวที่ ${rowNumber}: บันทึกข้อมูลล้มเหลว (${email})`);
      }
    }

    res.status(200).json({
      message: `นำเข้าสำเร็จ ${results.added} รายการ, ข้ามหรือมีข้อผิดพลาด ${results.errors.length} รายการ`,
      ...results,
    });
  } catch (error) {
    console.error('Upload Excel error:', error);
    res.status(500).json({ message: 'อ่านไฟล์ Excel ล้มเหลว กรุณาตรวจสอบรูปแบบไฟล์' });
  }
};
const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.admin_list.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Admin deleted successfully.' });
  } catch (error) {
    console.error('Delete admin error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 4. Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const admin = await prisma.admin_list.findUnique({
      where: { email },
    });

    if (!admin || admin.status !== 'ACTIVE') {
      return res.status(401).json({ message: 'Authentication failed. Account not found or not active.' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
    }

    const matchedCompanyIds = await getMatchedCompanyIds(admin.companyName);

    const token = jwt.sign(
      {
        adminId: admin.id,
        email:   admin.email,
        role:    admin.role,
        companyName: admin.companyName,
        matchedCompanyIds,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      email:      admin.email,
      firstName:  admin.firstName,
      lastName:   admin.lastName,
      role:       admin.role,
      companyName: admin.companyName,
      matchedCompanyIds,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyAdminForPasswordReset = async (req, res) => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ message: 'Email and phone number are required.' });
  }

  try {
    const admin = await prisma.admin_list.findUnique({ where: { email } });

    if (!admin || admin.status !== 'ACTIVE' || admin.phone !== phone) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ดูแลระบบในระบบ กรุณาตรวจสอบอีเมลและเบอร์โทร' });
    }

    res.status(200).json({ message: 'Admin verified successfully.' });
  } catch (error) {
    console.error('Verify admin for password reset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetAdminPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }

  try {
    const admin = await prisma.admin_list.findUnique({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin_list.update({
      where: { email },
      data:  { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset admin password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addAdmin,
  getAllAdmins,
  checkAdminEmail,
  setupAdminAccount,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
  adminLogin,
  verifyAdminForPasswordReset,
  resetAdminPassword,
  downloadAdminTemplate,
  uploadAdminExcel,
};
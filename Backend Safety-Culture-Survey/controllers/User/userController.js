const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// ========================================================
// Helper: แปลง user record จาก DB → format สำหรับ frontend
// ========================================================
const formatRegisteredUser = (user, excelIndex = 0) => {
  // Derive 4 states from registration_status + survey_status
  // 1. not_registered (ยังไม่ได้ลงทะเบียน)
  // 2. done (ทำแล้ว)
  // 3. in_progress (กำลังทำ)
  // 4. not_started (ยังไม่เริ่ม)
  const mappedStatus =
    user.registration_status === 'pending' ? 'not_registered' :
    user.survey_status === 'done' ? 'done' :
    user.survey_status === 'in_progress' ? 'in_progress' :
    'not_started';

  return {
    id: user.id,
    title_user: user.title_user || '-',
    name_user: user.name_user || '-',
    email_user: user.email_user,
    company_user: user.company?.name || '-',          // ✅ ใช้ relation
    phone_user: user.phone_user || '-',
    position_user: user.position?.name || '-',       // ✅ ใช้ relation
    job_field_user: user.department?.name || '-',    // ✅ ใช้ relation
    work_group_user: user.work_group?.name || '-',   // ✅ ใช้ relation
    years_of_service: user.experience?.name || '-', // ✅ ใช้ relation
    section_user: user.section_user || '-',
    status: mappedStatus,                            // ✅ ใช้ survey_status เป็น status
    survey_status: user.survey_status,
    createdAt: user.createdAt,
    statusPriority: getStatusPriority(mappedStatus),
    sortOrder: excelIndex,
  };
};

const getStatusPriority = (status) => {
  const map = { 'done': 0, 'in_progress': 1, 'not_started': 2, 'not_registered': 3 };
  return map[status] !== undefined ? map[status] : 999;
};

// ========================================================
// GET /api/users/users — ดึงรายชื่อผู้ใช้ทั้งหมด
// ========================================================
const getAllUsers = async (req, res) => {
  try {
    // ดึงข้อมูลผู้ใช้ทั้งหมด (ทั้งที่อัปโหลดและลงทะเบียนแล้ว)
    const allUsers = await prisma.user.findMany({
      include: {
        company: true,
        position: true,
        department: true,
        work_group: true,
        experience: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    // จัดรูปแบบและเรียงลำดับ
    const formattedUsers = allUsers.map((u, idx) => formatRegisteredUser(u, idx));

    formattedUsers.sort((a, b) =>
      a.statusPriority !== b.statusPriority
        ? a.statusPriority - b.statusPriority
        : a.sortOrder - b.sortOrder
    );

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ========================================================
// POST /api/users/check-email
// ========================================================
const checkUserEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  try {
    const user = await prisma.user.findUnique({ 
      where: { email_user: email },
      include: { company: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'Email not found in system.' });
    }

    // ตรวจสอบว่าเป็นผู้ใช้ที่อัปโหลดจาก Excel หรือลงทะเบียนแล้ว
    const isRegistered = user.registration_status === 'completed' && user.name_user !== null;

    if (isRegistered) {
      return res.status(200).json({
        message: 'User already registered.',
        email,
        isRegistered: true,
        company: user.company?.name || '-',
        division: user.section_user || '-',
        surveyStatus: user.survey_status,
        userId: user.id,
      });
    }

    res.status(200).json({
      message: 'Email found. Ready for registration.',
      email,
      isRegistered: false,
      company: user.company?.name || '-',
      division: user.section_user || '-',
    });
  } catch (error) {
    console.error('Check user email error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ========================================================
// POST /api/users/register
// ========================================================
const registerUser = async (req, res) => {
  const { title, fullName, email, phone, company, position, department, workGroup, workExperience, password } = req.body;

  if (!title || !fullName || !email || !phone || !company || !position || !department || !workGroup || !workExperience) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบแล้ว
    const existingUser = await prisma.user.findUnique({ where: { email_user: email } });
    if (!existingUser) {
      return res.status(404).json({ message: 'Email not found in system. Please upload Excel file first.' });
    }

    // ตรวจสอบว่าลงทะเบียนแล้วหรือไม่
    if (existingUser.registration_status === 'completed' && existingUser.name_user !== null) {
      return res.status(409).json({ message: 'User already registered.' });
    }

    // หา relation IDs จากชื่อที่รับมา
    const [companyRecord, positionRecord, departmentRecord, workGroupRecord, experienceRecord] = await Promise.all([
      prisma.company.findFirst({ where: { name: company } }),
      prisma.position.findFirst({ where: { name: position } }),
      prisma.department.findFirst({ where: { name: department } }),
      prisma.work_group.findFirst({ where: { name: workGroup } }),
      prisma.experience.findFirst({ where: { name: workExperience } }),
    ]);

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // อัปเดตผู้ใช้ที่ได้จาก Excel ให้เป็นผู้ใช้ที่ลงทะเบียนแล้ว
    const updatedUser = await prisma.user.update({
      where: { email_user: email },
      data: {
        title_user: title,
        name_user: fullName,
        phone_user: phone,
        company_id: companyRecord?.id || null,
        position_id: positionRecord?.id || null,
        department_id: departmentRecord?.id || null,
        work_group_id: workGroupRecord?.id || null,
        experience_id: experienceRecord?.id || null,
        password_user: hashedPassword,
        status: 'active',
        registration_status: 'completed',
        survey_status: 'not_started',
      },
      include: { company: true, position: true, department: true, work_group: true, experience: true }
    });

    res.status(201).json({
      message: 'User registered successfully.',
      user: formatRegisteredUser(updatedUser)
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ========================================================
// POST /api/users/login
// ========================================================
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const user = await prisma.user.findUnique({
      where: { email_user: email },
      include: { company: true, position: true, department: true, work_group: true, experience: true }
    });

    if (!user) return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    const isPasswordValid = await bcrypt.compare(password, user.password_user);
    if (!isPasswordValid) return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    res.status(200).json({
      message: 'Login successful.',
      user: formatRegisteredUser(user)
    });
  } catch (error) {
    console.error('Login user error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ========================================================
// DELETE /api/users/by-email/:email
// ========================================================
const deleteUser = async (req, res) => {
  const { email } = req.params;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  try {
    // ลบ survey_answers ก่อน (foreign key constraint)
    const userRecord = await prisma.user.findUnique({ where: { email_user: email } });
    if (userRecord) {
      await prisma.survey_answer.deleteMany({ where: { userId: userRecord.id } });
      await prisma.user.delete({ where: { email_user: email } });
      return res.status(200).json({ message: 'User deleted successfully.' });
    }

    res.status(404).json({ message: 'User not found.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ========================================================
// POST /api/users/forgot-password
// ========================================================
const forgotPassword = async (req, res) => {
  const { email, phone } = req.body;
  if (!email || !phone) return res.status(400).json({ message: 'Email and phone are required.' });

  try {
    const cleanedPhone = phone.replace(/\D/g, '');
    const user = await prisma.user.findFirst({
      where: { email_user: email, phone_user: cleanedPhone },
      select: { id: true, email_user: true, name_user: true, phone_user: true }
    });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    res.status(200).json({
      message: 'OTP sent.',
      success: true,
      email: user.email_user,
      phone: user.phone_user,
      userId: user.id,
      otp, // TODO: ลบออกใน production และส่งผ่าน SMS แทน
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ========================================================
// POST /api/users/reset-password
// ========================================================
const resetPassword = async (req, res) => {
  const { email, phone, newPassword } = req.body;
  if (!email || !phone || !newPassword) return res.status(400).json({ message: 'All fields required.' });

  try {
    const cleanedPhone = phone.replace(/\D/g, '');
    const user = await prisma.user.findFirst({ where: { email_user: email, phone_user: cleanedPhone } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password_user: hashed } });

    res.status(200).json({ message: 'Password reset successfully.', success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  checkUserEmail,
  registerUser,
  loginUser,
  deleteUser,
  forgotPassword,
  resetPassword,
};
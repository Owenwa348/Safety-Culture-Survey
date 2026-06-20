// controllers/SuperAdmin/superAdminController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// 1. Add SuperAdmin Email (from AddSuperAdminForm.vue)
const addSuperAdmin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existingSuperAdmin = await prisma.super_admin_list.findUnique({
      where: { email },
    });

    if (existingSuperAdmin) {
      return res.status(409).json({ message: 'This email is already in the system.' });
    }

    const newSuperAdmin = await prisma.super_admin_list.create({
      data: {
        email,
      },
    });

    res.status(201).json({ message: 'Super Admin added successfully.', superAdmin: newSuperAdmin });
  } catch (error) {
    console.error('Error adding Super Admin:', error);
    res.status(500).json({ message: 'An error occurred while adding the Super Admin.' });
  }
};

// 2. Get All SuperAdmins (for SuperAdminList.vue)
const getAllSuperAdmins = async (req, res) => {
  try {
    const superAdmins = await prisma.super_admin_list.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(superAdmins);
  } catch (error) {
    console.error('Error fetching Super Admins:', error);
    res.status(500).json({ message: 'An error occurred while fetching data.' });
  }
};

// 3. Check Email for Password Setup (from LoginAll.vue)
const checkEmailAndStatus = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }
    try {
        const superAdmin = await prisma.super_admin_list.findUnique({
            where: { email },
        });

        if (!superAdmin) {
            return res.status(404).json({ message: 'Email not found.' });
        }

        if (superAdmin.status === 'ACTIVE') {
            return res.status(409).json({ message: 'This account has already been activated.' });
        }
        
        // Email exists and status is PENDING
        res.status(200).json({ message: 'Email is valid for setup.', email: superAdmin.email });

    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: 'An error occurred while checking the email.' });
    }
};


// 4. Setup SuperAdmin Account (from SetPasswordSuperAdmin.vue)
const setupAccount = async (req, res) => {
  const { email, phone, pin, password } = req.body;

  if (!email || !phone || !pin || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    return res.status(400).json({ message: 'PIN must be 6 digits.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPin = await bcrypt.hash(pin, salt);

    const updatedSuperAdmin = await prisma.super_admin_list.update({
      where: { email },
      data: {
        phone,
        pin: hashedPin,
        password: hashedPassword,
        status: 'ACTIVE',
      },
    });

    res.status(200).json({ message: 'Account setup successful. You can now log in.' });
  } catch (error) {
    console.error('Error setting up account:', error);
    if (error.code === 'P2025') { // Prisma code for record not found
        return res.status(404).json({ message: 'Super Admin with this email not found.' });
    }
    res.status(500).json({ message: 'An error occurred during account setup.' });
  }
};
const jwt = require('jsonwebtoken');
// 5. SuperAdmin Login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const superAdmin = await prisma.super_admin_list.findUnique({
            where: { email },
        });

        if (!superAdmin || superAdmin.status !== 'ACTIVE') {
            return res.status(401).json({ message: 'Invalid credentials or account not activated.' });
        }

        const isMatch = await bcrypt.compare(password, superAdmin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        await prisma.super_admin_list.update({
            where: { email },
            data: { lastLogin: new Date() },
        });

        // ✅ ออก JWT token
        const token = jwt.sign(
            {
                adminId: superAdmin.id,
                email: superAdmin.email,
                role: superAdmin.role || 'Super Admin',
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        res.status(200).json({
            message: 'Login successful.',
            token,                              // ✅ ส่ง token กลับ
            role: superAdmin.role || 'Super Admin',
            email: superAdmin.email,
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
};

// 6. Update SuperAdmin (for management)
const updateSuperAdmin = async (req, res) => {
    const { id } = req.params;
    const { email, phone } = req.body; // Example: allow updating email and phone

    try {
        const updatedSuperAdmin = await prisma.super_admin_list.update({
            where: { id: parseInt(id) },
            data: { email, phone },
        });
        res.status(200).json({ message: 'Super Admin updated successfully.', superAdmin: updatedSuperAdmin });
    } catch (error) {
        console.error('Error updating Super Admin:', error);
        res.status(500).json({ message: 'An error occurred while updating.' });
    }
};

// 7. Delete SuperAdmin (for management)
const deleteSuperAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.super_admin_list.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: 'Super Admin deleted successfully.' });
    } catch (error) {
        console.error('Error deleting Super Admin:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Super Admin not found.' });
        }
        res.status(500).json({ message: 'An error occurred while deleting.' });
    }
};

// 8. Update SuperAdmin Status
const updateSuperAdminStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expecting 'ACTIVE' or 'INACTIVE'

    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
        return res.status(400).json({ message: "Invalid status provided. Use 'ACTIVE' or 'INACTIVE'." });
    }

    try {
        const superAdmin = await prisma.super_admin_list.findUnique({
            where: { id: parseInt(id) },
        });

        if (!superAdmin || superAdmin.status === 'PENDING') {
            return res.status(404).json({ message: 'Cannot change status for a pending or non-existent user.' });
        }

        const updatedAdmin = await prisma.super_admin_list.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        res.status(200).json({ message: 'Status updated successfully.', superAdmin: updatedAdmin });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'An error occurred while updating status.' });
    }
};

// 9. Verify SuperAdmin for Password Reset (from ForgotPasswordSuperAdmin.vue)
const verifyForPasswordReset = async (req, res) => {
    const { email, phone, pin } = req.body;

    if (!email || !phone || !pin) {
        return res.status(400).json({ message: 'Email, phone, and PIN are required.' });
    }

    try {
        // Check if email exists
        const superAdmin = await prisma.super_admin_list.findUnique({
            where: { email },
        });

        if (!superAdmin) {
            return res.status(404).json({ message: 'Email not found in the system.' });
        }

        // Check if account is ACTIVE (must be activated to reset password)
        if (superAdmin.status !== 'ACTIVE') {
            return res.status(409).json({ message: 'This account has not been activated yet.' });
        }

        // Verify phone and PIN
        const phoneMatch = await bcrypt.compare(phone, superAdmin.phone);
        const pinMatch = await bcrypt.compare(pin, superAdmin.pin);

        // For phone: exact match (not hashed for comparison)
        const phoneExactMatch = superAdmin.phone === phone;

        // PIN must match (hashed)
        if (!phoneExactMatch || !pinMatch) {
            return res.status(401).json({ message: 'Phone number or PIN is incorrect.' });
        }

        // Return success with email for next step
        res.status(200).json({ 
            message: 'Verification successful. Proceed to password reset.',
            email: superAdmin.email 
        });

    } catch (error) {
        console.error('Error verifying for password reset:', error);
        res.status(500).json({ message: 'An error occurred during verification.' });
    }
};

// 10. Reset Password for SuperAdmin (from ForgotPasswordSuperAdmin.vue)
const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'Email and password fields are required.' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
        // Verify email exists and is ACTIVE
        const superAdmin = await prisma.super_admin_list.findUnique({
            where: { email },
        });

        if (!superAdmin) {
            return res.status(404).json({ message: 'Super Admin with this email not found.' });
        }

        if (superAdmin.status !== 'ACTIVE') {
            return res.status(409).json({ message: 'This account is not activated.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await prisma.super_admin_list.update({
            where: { email },
            data: {
                password: hashedPassword,
            },
        });

        res.status(200).json({ message: 'Password reset successful. You can now log in with your new password.' });

    } catch (error) {
        console.error('Error resetting password:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Super Admin with this email not found.' });
        }
        res.status(500).json({ message: 'An error occurred during password reset.' });
    }
};

// 11. Clear Assessment Data by Company (with optional year filter)
// ลบข้อมูลคำตอบการประเมิน (survey_answer) ของผู้ใช้ทั้งหมดในบริษัทที่เลือก
const clearAssessmentDataByCompany = async (req, res) => {
    const { companyId } = req.params;
    const { year } = req.query; // Optional: filter by year

    if (!companyId) {
        return res.status(400).json({ message: 'Company ID is required.' });
    }

    try {
        // ✅ ตรวจสอบว่ามีบริษัทอยู่
        const company = await prisma.company.findUnique({
            where: { id: parseInt(companyId) },
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        // ✅ ดึงผู้ใช้ทั้งหมดในบริษัทนี้
        const usersInCompany = await prisma.user.findMany({
            where: { company_id: parseInt(companyId) },
            select: { id: true },
        });

        const userIds = usersInCompany.map((u) => u.id);

        if (userIds.length === 0) {
            return res.status(200).json({
                message: 'No assessment data found for this company.',
                deletedCount: 0,
            });
        }

        // ✅ สร้างเงื่อนไขสำหรับลบ (รวมปี หากระบุ)
        const deleteWhere = {
            userId: {
                in: userIds,
            },
        };

        // ✅ ถ้ามีการระบุปี ให้ filter โดย createdAt
        if (year) {
            const yearNumber = parseInt(year);
            const startDate = new Date(`${yearNumber}-01-01`);
            const endDate = new Date(`${yearNumber}-12-31T23:59:59`);

            deleteWhere.createdAt = {
                gte: startDate,
                lte: endDate,
            };
        }

        // ✅ ลบคำตอบการประเมิน (survey_answer)
        const deleteResult = await prisma.survey_answer.deleteMany({
            where: deleteWhere,
        });

        const yearInfo = year ? ` ปี ${year}` : '';
        res.status(200).json({
            message: `Assessment data cleared successfully for company: ${company.name}${yearInfo}`,
            companyName: company.name,
            deletedCount: deleteResult.count,
            year: year || 'all',
        });

    } catch (error) {
        console.error('Error clearing assessment data:', error);
        res.status(500).json({ message: 'An error occurred while clearing assessment data.' });
    }
};

// 12. Get Assessment Stats by Company (with optional year filter)
const getAssessmentStatsByCompany = async (req, res) => {
    const { companyId } = req.params;
    const { year } = req.query; // Optional: filter by year

    if (!companyId) {
        return res.status(400).json({ message: 'Company ID is required.' });
    }

    try {
        const company = await prisma.company.findUnique({
            where: { id: parseInt(companyId) },
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        // ดึงผู้ใช้ในบริษัท
        const usersInCompany = await prisma.user.findMany({
            where: { company_id: parseInt(companyId) },
            select: { id: true },
        });

        const userIds = usersInCompany.map((u) => u.id);

        // ✅ สร้างเงื่อนไขสำหรับนับ (รวมปี หากระบุ)
        const answerWhere = {
            userId: {
                in: userIds,
            },
        };

        // ✅ ถ้ามีการระบุปี ให้ filter โดย createdAt
        if (year) {
            const yearNumber = parseInt(year);
            const startDate = new Date(`${yearNumber}-01-01`);
            const endDate = new Date(`${yearNumber}-12-31T23:59:59`);

            answerWhere.createdAt = {
                gte: startDate,
                lte: endDate,
            };
        }

        // นับคำตอบการประเมิน
        const answerCount = await prisma.survey_answer.count({
            where: answerWhere,
        });

        // นับผู้ใช้ที่ทำการประเมิน
        const usersWithAnswers = await prisma.survey_answer.findMany({
            where: answerWhere,
            distinct: ['userId'],
            select: { userId: true },
        });

        res.status(200).json({
            companyName: company.name,
            totalUsers: userIds.length,
            usersWithAssessment: usersWithAnswers.length,
            totalAnswers: answerCount,
            canClear: answerCount > 0,
            yearSelected: year || 'all',
        });

    } catch (error) {
        console.error('Error fetching assessment stats:', error);
        res.status(500).json({ message: 'An error occurred while fetching stats.' });
    }
};

module.exports = {
  addSuperAdmin,
  getAllSuperAdmins,
  checkEmailAndStatus,
  setupAccount,
  login,
  updateSuperAdmin,
  deleteSuperAdmin,
  updateSuperAdminStatus,
  verifyForPasswordReset,
  resetPassword,
  clearAssessmentDataByCompany,
  getAssessmentStatsByCompany,
};

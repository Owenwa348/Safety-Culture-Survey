const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// 1. SuperAdmin adds a new Admin
const addAdmin = async (req, res) => {
  const { email, companyName } = req.body;

  if (!email || !companyName) {
    return res.status(400).json({ message: 'Email and company name are required.' });
  }

  try {
    const existingAdmin = await prisma.adminList.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this email already exists.' });
    }

    const newAdmin = await prisma.adminList.create({
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
    const admins = await prisma.adminList.findMany({
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
    const admin = await prisma.adminList.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    if (admin.status !== 'PENDING') {
      return res.status(403).json({ message: 'This account has already been set up. Please log in.' });
    }

    // Return non-sensitive data for the setup form
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
    const admin = await prisma.adminList.findUnique({ where: { email } });

    if (!admin || admin.status !== 'PENDING') {
      return res.status(404).json({ message: 'Account not found or already activated.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedAdmin = await prisma.adminList.update({
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
        const updatedAdmin = await prisma.adminList.update({
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
    const { status } = req.body; // Expecting 'ACTIVE' or 'INACTIVE'

    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const admin = await prisma.adminList.findUnique({ where: { id: parseInt(id) } });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        const updatedAdmin = await prisma.adminList.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        res.status(200).json({ message: `Admin status set to ${status}`, admin: updatedAdmin });
    } catch (error) {
        console.error('Toggle admin status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.adminList.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: 'Admin deleted successfully.' });
    } catch (error) {
        console.error('Delete admin error:', error);
        // Handle case where admin might not be found
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Admin not found.' });
        }
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
};

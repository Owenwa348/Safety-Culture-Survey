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
    const existingSuperAdmin = await prisma.superAdminList.findUnique({
      where: { email },
    });

    if (existingSuperAdmin) {
      return res.status(409).json({ message: 'This email is already in the system.' });
    }

    const newSuperAdmin = await prisma.superAdminList.create({
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
    const superAdmins = await prisma.superAdminList.findMany({
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
        const superAdmin = await prisma.superAdminList.findUnique({
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

    const updatedSuperAdmin = await prisma.superAdminList.update({
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

// 5. SuperAdmin Login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const superAdmin = await prisma.superAdminList.findUnique({
            where: { email },
        });

        if (!superAdmin || superAdmin.status !== 'ACTIVE') {
            return res.status(401).json({ message: 'Invalid credentials or account not activated.' });
        }

        const isMatch = await bcrypt.compare(password, superAdmin.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Update lastLogin timestamp
        await prisma.superAdminList.update({
            where: { email },
            data: { lastLogin: new Date() },
        });
        
        // In a real app, you would generate a JWT here
        res.status(200).json({ message: 'Login successful.', role: superAdmin.role });

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
        const updatedSuperAdmin = await prisma.superAdminList.update({
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
        await prisma.superAdminList.delete({
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
        const superAdmin = await prisma.superAdminList.findUnique({
            where: { id: parseInt(id) },
        });

        if (!superAdmin || superAdmin.status === 'PENDING') {
            return res.status(404).json({ message: 'Cannot change status for a pending or non-existent user.' });
        }

        const updatedAdmin = await prisma.superAdminList.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        res.status(200).json({ message: 'Status updated successfully.', superAdmin: updatedAdmin });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'An error occurred while updating status.' });
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
};

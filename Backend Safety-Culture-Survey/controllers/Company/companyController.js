// controllers/Company/companyController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { getCompanyGroups } = require('../../services/companyService');

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
};

// Create a new company
const createCompany = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }
    const company = await prisma.company.create({
      data: { name },
    });
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Company name already exists' });
    }
    res.status(500).json({ message: 'Error creating company', error: error.message });
  }
};

// Update company
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }
    const company = await prisma.company.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.status(200).json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Company not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Company name already exists' });
    }
    res.status(500).json({ message: 'Error updating company', error: error.message });
  }
};

// Delete company
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.company.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(500).json({ message: 'Error deleting company', error: error.message });
  }
};

// GET /api/companies/groups (Protected)
const getGroups = async (req, res) => {
  try {
    const scope = req.user?.matchedCompanyIds ?? null;
    const groups = await getCompanyGroups(scope);
    res.status(200).json(groups);
  } catch (error) {
    console.error('getGroups error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ✅ ใหม่ — GET /api/companies/public/by-name?name=Verte+Security (Public)
// ใช้ใน EvaluatorRegistration เพื่อ resolve companyId จากชื่อบริษัท
// กรณีที่ลิงก์เชิญไม่มี companyId ส่งมา
const getCompanyByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    const company = await prisma.company.findFirst({
      where: {
        name: name.trim(),  // MySQL collation เป็น case-insensitive อยู่แล้ว
      },
      select: { id: true, name: true },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error('getCompanyByName error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getGroups,
  getCompanyByName, // ✅ export ใหม่
};
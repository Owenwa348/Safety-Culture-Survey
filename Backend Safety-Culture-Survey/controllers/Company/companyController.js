const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.user.findMany({
      distinct: ['company_user'],
      select: {
        company_user: true,
      },
    });
    // Filter out any null or empty string values in JavaScript
    const companyNames = companies.map(c => c.company_user).filter(name => name);
    res.status(200).json(companyNames);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
};

module.exports = {
  getAllCompanies,
};

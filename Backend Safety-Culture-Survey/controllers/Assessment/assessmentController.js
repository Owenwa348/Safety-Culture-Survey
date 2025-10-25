const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAssessmentData = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
          include: {
            options: {
              orderBy: {
                id: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching assessment data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAssessmentData,
};

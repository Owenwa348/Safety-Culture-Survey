// controllers/Assessment/assessmentController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get assessment data — กรองตาม company ของ user
// assessmentController.js — getAssessmentData
const getAssessmentData = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { company_id: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    let categories = await prisma.category.findMany({
      where: { companyId: user.company_id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: { options: { orderBy: { id: 'asc' } } }
        }
      },
      orderBy: { order: 'asc' }
    });

    // ✅ fallback: ถ้าบริษัทตัวเองไม่มี category ให้ใช้ของบริษัทแรก
    if (categories.length === 0) {
      const primaryCompany = await prisma.company.findFirst({ orderBy: { id: 'asc' } });
      categories = await prisma.category.findMany({
        where: { companyId: primaryCompany.id },
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: { options: { orderBy: { id: 'asc' } } }
          }
        },
        orderBy: { order: 'asc' }
      });
    }

    res.json(categories);
  } catch (error) {
    console.error('Error fetching assessment data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Save user's survey answer for a specific question
const saveSurveyAnswer = async (req, res) => {
  try {
    const { userId, questionId, currentScore, expectedScore, comment } = req.body;

    if (!userId || !questionId || currentScore === undefined || expectedScore === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (currentScore < 1 || currentScore > 5 || expectedScore < 1 || expectedScore > 5) {
      return res.status(400).json({ error: 'Scores must be between 1 and 5' });
    }

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const question = await prisma.question.findUnique({ where: { id: parseInt(questionId) } });
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const surveyAnswer = await prisma.survey_answer.upsert({
      where: {
        userId_questionId: {
          userId: parseInt(userId),
          questionId: parseInt(questionId)
        }
      },
      update: {
        currentScore: parseInt(currentScore),
        expectedScore: parseInt(expectedScore),
        comment: comment || null,
        updatedAt: new Date()
      },
      create: {
        userId: parseInt(userId),
        questionId: parseInt(questionId),
        currentScore: parseInt(currentScore),
        expectedScore: parseInt(expectedScore),
        comment: comment || null
      }
    });

    const totalQuestions = await prisma.question.count({
      where: {
        category: { companyId: user.company_id }
      }
    });

    const answeredQuestions = await prisma.survey_answer.count({
      where: { userId: parseInt(userId) }
    });

    let surveyStatus = 'not_started';
    if (answeredQuestions >= totalQuestions) {
      surveyStatus = 'done';
    } else if (answeredQuestions > 0) {
      surveyStatus = 'in_progress';
    }

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { survey_status: surveyStatus }
    });

    res.status(200).json({
      message: 'Survey answer saved successfully',
      surveyAnswer,
      surveyStatus
    });
  } catch (error) {
    console.error('Error saving survey answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's survey answers
const getUserSurveyAnswers = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const surveyAnswers = await prisma.survey_answer.findMany({
      where: { userId: parseInt(userId) },
      include: {
        question: {
          select: {
            id: true,
            text: true,
            order: true,
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    surveyAnswers.sort((a, b) => (a.question?.order ?? 0) - (b.question?.order ?? 0));

    res.status(200).json(surveyAnswers);
  } catch (error) {
    console.error('❌ Full error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's survey progress
const getUserSurveyProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { survey_status: true, company_id: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalQuestions = await prisma.question.count({
      where: {
        category: { companyId: user.company_id }
      }
    });

    const answeredQuestions = await prisma.survey_answer.count({
      where: { userId: parseInt(userId) }
    });

    res.status(200).json({
      surveyStatus: user.survey_status,
      totalQuestions,
      answeredQuestions,
      progressPercentage: totalQuestions > 0
        ? Math.round((answeredQuestions / totalQuestions) * 100)
        : 0
    });
  } catch (error) {
    console.error('Error fetching user survey progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Clear Assessment Data by Company (with optional year filter)
// ลบข้อมูลคำตอบการประเมิน (survey_answer) และรีเซตสถานะผู้ประเมิน
// Moved from controllers/SuperAdmin/superAdminController.js — same business
// domain as saveSurveyAnswer/getUserSurveyProgress (survey_answer + survey_status).
// Access is restricted at the route level (super-admin only), not by file location.
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
                updatedCount: 0,
            });
        }

        // ✅ สร้างเงื่อนไขสำหรับค้นหา (รวมปี หากระบุ)
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

        // ✅ ดึง userIds ที่มี survey_answer ก่อนลบ (เพื่ออัพเดตสถานะ)
        const usersWithAnswers = await prisma.survey_answer.findMany({
            where: answerWhere,
            distinct: ['userId'],
            select: { userId: true },
        });

        const userIdsToReset = usersWithAnswers.map(u => u.userId);

        // ✅ ลบคำตอบการประเมิน (survey_answer)
        const deleteResult = await prisma.survey_answer.deleteMany({
            where: answerWhere,
        });

        // ✅ อัพเดต survey_status เป็น "not_started" สำหรับผู้ใช้ที่ลบข้อมูล
        let updateCount = 0;
        if (userIdsToReset.length > 0) {
            const updateResult = await prisma.user.updateMany({
                where: { id: { in: userIdsToReset } },
                data: { survey_status: 'not_started' },
            });
            updateCount = updateResult.count;
        }

        const yearInfo = year ? ` ปี ${year}` : '';
        res.status(200).json({
            message: `Assessment data cleared successfully for company: ${company.name}${yearInfo}. Status reset for ${updateCount} users.`,
            companyName: company.name,
            deletedCount: deleteResult.count,
            updatedCount: updateCount,
            year: year || 'all',
        });

    } catch (error) {
        console.error('Error clearing assessment data:', error);
        res.status(500).json({ message: 'An error occurred while clearing assessment data.' });
    }
};

// Get Assessment Stats by Company (with optional year filter)
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
  getAssessmentData,
  saveSurveyAnswer,
  getUserSurveyAnswers,
  getUserSurveyProgress,
  clearAssessmentDataByCompany,
  getAssessmentStatsByCompany,
};
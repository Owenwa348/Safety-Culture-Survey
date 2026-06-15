// controllers/Assessment/assessmentController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get assessment data (categories, questions, options)
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

    // ✅ แก้จาก prisma.surveyAnswer → prisma.survey_answer
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

    const totalQuestions = await prisma.question.count();

    // ✅ แก้จาก prisma.surveyAnswer → prisma.survey_answer
    const answeredQuestions = await prisma.survey_answer.count({
      where: { userId: parseInt(userId) }
    });

    let surveyStatus = 'in_progress';
    if (answeredQuestions >= totalQuestions) {
      surveyStatus = 'done';
    } else if (answeredQuestions > 0) {
      surveyStatus = 'in_progress';
    } else {
      surveyStatus = 'not_started';
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

    // ✅ แก้จาก prisma.surveyAnswer → prisma.survey_answer
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

    // Sort by question.order ใน JS แทน orderBy nested relation
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
      select: {
        survey_status: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalQuestions = await prisma.question.count();

    // ✅ แก้จาก prisma.surveyAnswer → prisma.survey_answer
    const answeredQuestions = await prisma.survey_answer.count({
      where: { userId: parseInt(userId) }
    });

    res.status(200).json({
      surveyStatus: user.survey_status,
      totalQuestions,
      answeredQuestions,
      progressPercentage: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0
    });
  } catch (error) {
    console.error('Error fetching user survey progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAssessmentData,
  saveSurveyAnswer,
  getUserSurveyAnswers,
  getUserSurveyProgress
};
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

    // Validate inputs
    if (!userId || !questionId || currentScore === undefined || expectedScore === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate score ranges (1-5)
    if (currentScore < 1 || currentScore > 5 || expectedScore < 1 || expectedScore > 5) {
      return res.status(400).json({ error: 'Scores must be between 1 and 5' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if question exists
    const question = await prisma.question.findUnique({ where: { id: parseInt(questionId) } });
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Save or update the survey answer
    const surveyAnswer = await prisma.surveyAnswer.upsert({
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

    // Update user's survey status
    // Check if user has answered all questions
    const totalQuestions = await prisma.question.count();
    const answeredQuestions = await prisma.surveyAnswer.count({
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

    // Update user's survey status
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { surveyStatus }
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

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all survey answers for the user
    const surveyAnswers = await prisma.surveyAnswer.findMany({
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
      },
      orderBy: {
        question: {
          order: 'asc'
        }
      }
    });

    res.status(200).json(surveyAnswers);
  } catch (error) {
    console.error('Error fetching user survey answers:', error);
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

    // Check if user exists
    const user = await prisma.user.findUnique({ 
      where: { id: parseInt(userId) },
      select: {
        surveyStatus: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get total questions count
    const totalQuestions = await prisma.question.count();

    // Get answered questions count for this user
    const answeredQuestions = await prisma.surveyAnswer.count({
      where: { userId: parseInt(userId) }
    });

    res.status(200).json({
      surveyStatus: user.surveyStatus,
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
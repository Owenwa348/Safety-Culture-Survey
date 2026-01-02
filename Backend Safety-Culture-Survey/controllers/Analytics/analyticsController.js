// controllers/Analytics/analyticsController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ดึงข้อมูลที่รวมไว้สำหรับกราฟ (มีประสิทธิภาพมากกว่า)
const getAggregatedSurveyData = async (req, res) => {
  try {
    const { companyId } = req.query;
    
    // รวมข้อมูลตามคำถามเพื่อเพิ่มประสิทธิภาพ
    const aggregatedData = await prisma.surveyAnswer.groupBy({
      by: ['questionId'],
      where: {
        user: {
          company_user: companyId
        }
      },
      _avg: {
        currentScore: true,
        expectedScore: true
      },
      _count: {
        id: true
      },
      _min: {
        createdAt: true
      },
      _max: {
        createdAt: true
      }
    });
    
    // ดึงรายละเอียดคำถาม
    const questionIds = aggregatedData.map(item => item.questionId);
    const questions = await prisma.question.findMany({
      where: {
        id: { in: questionIds }
      },
      select: {
        id: true,
        text: true,
        category: {
          select: {
            name: true
          }
        }
      }
    });
    
    // รวมข้อมูล
    const result = aggregatedData.map(item => {
      const question = questions.find(q => q.id === item.questionId);
      return {
        questionId: item.questionId,
        questionText: question ? question.text : '',
        categoryName: question && question.category ? question.category.name : '',
        avgCurrentScore: item._avg.currentScore,
        avgExpectedScore: item._avg.expectedScore,
        responseCount: item._count.id,
        firstResponse: item._min.createdAt,
        lastResponse: item._max.createdAt
      };
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสำรวจที่รวมไว้:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};

// ดึงข้อมูลตามกลุ่มประชากร (ตำแหน่ง, แผนก, ฯลฯ)
const getDemographicAnalysis = async (req, res) => {
  try {
    const { companyId, groupBy } = req.query; // groupBy: 'position', 'department', 'workGroup'
    
    // ตรวจสอบพารามิเตอร์ groupBy
    if (!['position_user', 'job_field_user', 'work_group_user'].includes(groupBy)) {
      return res.status(400).json({ error: 'พารามิเตอร์ groupBy ไม่ถูกต้อง' });
    }
    
    // รวมข้อมูลตามกลุ่มประชากร
    const aggregatedData = await prisma.surveyAnswer.groupBy({
      by: [`user.${groupBy}`],
      where: {
        user: {
          company_user: companyId
        }
      },
      _avg: {
        currentScore: true,
        expectedScore: true
      },
      _count: {
        id: true
      }
    });
    
    res.status(200).json(aggregatedData);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการวิเคราะห์ข้อมูลประชากร:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};

// ดึงข้อมูลแนวโน้มตามเวลา
const getTrendAnalysis = async (req, res) => {
  try {
    const { companyId, months } = req.query;
    const monthsNum = parseInt(months) || 12;
    
    // คำนวณช่วงเวลา
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsNum);
    
    // ดึงค่าเฉลี่ยรายเดือน
    const trendData = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        AVG(currentScore) as avgCurrentScore,
        AVG(expectedScore) as avgExpectedScore,
        COUNT(*) as responseCount
      FROM SurveyAnswer sa
      JOIN User u ON sa.userId = u.id
      WHERE u.company_user = ${companyId}
        AND sa.createdAt >= ${startDate}
        AND sa.createdAt <= ${endDate}
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month
    `;
    
    res.status(200).json(trendData);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการวิเคราะห์แนวโน้ม:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};

const getUserCompletionStatus = async (req, res) => {
  try {
    // 1. Get all potential users from the Excel list.
    const potentialUsers = await prisma.user_excel.findMany({
      select: {
        email_user: true,
        company_user: true,
      }
    });

    // 2. Get all registered users and their status.
    const registeredUsers = await prisma.user.findMany({
      select: {
        email_user: true,
        surveyStatus: true, // not_started, in_progress, done
      }
    });

    // 3. Create a map for quick lookup of registered users' status.
    const registeredUserMap = new Map(
      registeredUsers.map(u => [u.email_user, u.surveyStatus])
    );

    // 4. Determine the status for each potential user.
    const usersWithStatus = potentialUsers.map(potentialUser => {
      const surveyStatus = registeredUserMap.get(potentialUser.email_user);
      
      let finalStatus = 'not_registered'; // Default status
      if (surveyStatus) {
        finalStatus = surveyStatus; // Use status from User table if registered
      }

      return {
        id: potentialUser.email_user, // Use email as a unique ID
        name: potentialUser.email_user.split('@')[0], // Use part of email as name for now
        area: potentialUser.company_user,
        status: finalStatus, // 'done', 'in_progress', 'not_started', 'not_registered'
      };
    });

    res.status(200).json(usersWithStatus);

  } catch (error) {
    console.error('Error fetching user completion status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ดึงข้อมูลสำหรับกราฟแนวนอน (แยกตามคะแนน 1-5)
const getSurveyDataForChart = async (req, res) => {
  try {
    const { questionId, companyId = 'combined', year = new Date().getFullYear() } = req.query;
    
    if (!questionId) {
      return res.status(400).json({ error: 'questionId เป็นข้อมูลบังคับ' });
    }

    // ดึงข้อมูล question และ category
    const question = await prisma.question.findUnique({
      where: { id: parseInt(questionId) },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!question) {
      return res.status(404).json({ error: 'ไม่พบคำถามนี้' });
    }

    // สร้าง where condition
    const where = {
      questionId: parseInt(questionId),
      user: {}
    };

    // ถ้าไม่ใช่ combined ให้กรองตามบริษัท
    if (companyId !== 'combined') {
      where.user.company_user = companyId;
    }

    // กรองตามปี
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);
    where.createdAt = {
      gte: startOfYear,
      lte: endOfYear
    };

    // ดึงข้อมูลทั้งหมดสำหรับคำถามนี้
    const surveyAnswers = await prisma.surveyAnswer.findMany({
      where,
      select: {
        currentScore: true,
        expectedScore: true,
        user: {
          select: {
            company_user: true
          }
        }
      }
    });

    // นับจำนวนคำตอบแต่ละระดับ (1-5)
    const current = [0, 0, 0, 0, 0]; // index 0-4 สำหรับคะแนน 1-5
    const future = [0, 0, 0, 0, 0];

    surveyAnswers.forEach(answer => {
      if (answer.currentScore >= 1 && answer.currentScore <= 5) {
        current[answer.currentScore - 1]++;
      }
      if (answer.expectedScore >= 1 && answer.expectedScore <= 5) {
        future[answer.expectedScore - 1]++;
      }
    });

    // ดึงรายชื่อบริษัทสำหรับใช้ในการแสดงผล
    let companies = [];
    if (companyId === 'combined') {
      const distinctCompanies = await prisma.user.findMany({
        distinct: ['company_user'],
        select: {
          company_user: true
        }
      });
      companies = distinctCompanies.map(c => ({
        id: c.company_user,
        name: c.company_user
      }));
    } else {
      companies = [{
        id: companyId,
        name: companyId
      }];
    }

    res.status(200).json({
      questionId: parseInt(questionId),
      questionNumber: question.order || 0,
      questionText: question.text,
      category: question.category,
      companyId,
      companies,
      current,
      future,
      totalResponses: surveyAnswers.length,
      year
    });

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลกราฟ:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

// ดึงรายชื่อบริษัททั้งหมด
const getCompanies = async (req, res) => {
  try {
    const companies = await prisma.user.findMany({
      distinct: ['company_user'],
      select: {
        company_user: true
      }
    });

    const result = companies.map(c => ({
      id: c.company_user,
      name: c.company_user
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงรายชื่อบริษัท:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};

// ดึงข้อมูลสำหรับ Stacked Bar Chart พร้อมชื่อบริษัยและหมวดหมู่
const getStackedChartData = async (req, res) => {
  try {
    const { areaId = 'combined', timeframe = 'comparison', year = new Date().getFullYear() } = req.query;

    // ดึงทุกหมวดหมู่พร้อมคำถาม
    const categories = await prisma.category.findMany({
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { id: 'asc' }
    });

    if (categories.length === 0) {
      return res.status(404).json({ error: 'ไม่พบหมวดหมู่' });
    }

    // รวบรวม questionIds ทั้งหมด
    const questionIds = categories.flatMap(cat => cat.questions.map(q => q.id));

    if (questionIds.length === 0) {
      return res.status(404).json({ error: 'ไม่พบคำถาม' });
    }

    // สร้าง where condition
    const where = {
      questionId: { in: questionIds },
      user: {}
    };

    // ถ้าไม่ใช่ combined ให้กรองตามบริษัท
    if (areaId !== 'combined') {
      where.user.company_user = areaId;
    }

    // กรองตามปี
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);
    where.createdAt = {
      gte: startOfYear,
      lte: endOfYear
    };

    // ดึงข้อมูลการตอบแบบประเมิน
    const surveyAnswers = await prisma.surveyAnswer.findMany({
      where,
      select: {
        questionId: true,
        currentScore: true,
        expectedScore: true
      }
    });

    // สร้าง object เพื่อนับคำตอบแต่ละระดับ
    const dataByQuestion = {};
    
    categories.forEach(category => {
      category.questions.forEach(question => {
        dataByQuestion[question.id] = {
          current: [0, 0, 0, 0, 0], // คะแนน 1-5
          future: [0, 0, 0, 0, 0]
        };
      });
    });

    // นับคำตอบแต่ละระดับ
    surveyAnswers.forEach(answer => {
      if (dataByQuestion[answer.questionId]) {
        if (answer.currentScore >= 1 && answer.currentScore <= 5) {
          dataByQuestion[answer.questionId].current[answer.currentScore - 1]++;
        }
        if (answer.expectedScore >= 1 && answer.expectedScore <= 5) {
          dataByQuestion[answer.questionId].future[answer.expectedScore - 1]++;
        }
      }
    });

    // จัดเตรียมข้อมูลสำหรับกราฟ (แยกตามระดับ 1-5)
    const current = [[], [], [], [], []]; // ระดับ 1-5
    const future = [[], [], [], [], []];
    const labels = [];

    categories.forEach(category => {
      category.questions.forEach(question => {
        labels.push(`Q${question.order || question.id}: ${category.name}`);
        
        const questionData = dataByQuestion[question.id];
        for (let level = 0; level < 5; level++) {
          current[level].push(questionData.current[level]);
          future[level].push(questionData.future[level]);
        }
      });
    });

    // ดึงรายชื่อบริษัท
    let areas = [];
    if (areaId === 'combined') {
      const distinctAreas = await prisma.user.findMany({
        distinct: ['company_user'],
        select: { company_user: true }
      });
      areas = distinctAreas.map(a => ({
        id: a.company_user,
        name: a.company_user
      }));
    } else {
      areas = [{ id: areaId, name: areaId }];
    }

    // ดึงข้อมูล categories สำหรับแสดงข้างล่างกราฟ
    const categoriesForDisplay = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      questionCount: cat.questions.length
    }));

    res.status(200).json({
      labels, // Q1: Category Name, Q2: Category Name, ...
      current,
      future,
      areas,
      categories: categoriesForDisplay,
      areaId,
      timeframe,
      year,
      totalResponses: surveyAnswers.length
    });

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Stacked Chart:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

const getAssessmentYears = async (req, res) => {
  try {
    // ใช้ query ดิบเพื่อนับจำนวนปีที่มีข้อมูล
    const years = await prisma.surveyAnswer.findMany({
      distinct: ['createdAt'],
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // ใช้ Set เพื่อให้ได้ปีที่ไม่ซ้ำกัน
    const distinctYears = [
      ...new Set(years.map((y) => new Date(y.createdAt).getFullYear())),
    ];

    res.status(200).json(distinctYears);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงปีประเมิน:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};


module.exports = {
  getAggregatedSurveyData,
  getDemographicAnalysis,
  getTrendAnalysis,
  getUserCompletionStatus,
  getSurveyDataForChart,
  getCompanies,
  getStackedChartData,
  getAssessmentYears
};
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

module.exports = {
  getAggregatedSurveyData,
  getDemographicAnalysis,
  getTrendAnalysis
};
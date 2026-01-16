// controllers/SuperAdmin/dataManagementController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ดึงสถิติข้อมูลสำหรับแดชบอร์ด SuperAdmin
const getDataStatistics = async (req, res) => {
  try {
    // ดึงจำนวนรวม
    const userCount = await prisma.user.count();
    const surveyAnswerCount = await prisma.surveyAnswer.count();
    
    // ดึงสถิติตามบริษัท
    const companyStats = await prisma.user.groupBy({
      by: ['company_user'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });
    
    // ดึงกิจกรรมล่าสุด (7 วันที่แล้ว)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentAnswers = await prisma.surveyAnswer.count({
      where: {
        createdAt: {
          gte: oneWeekAgo
        }
      }
    });
    
    res.status(200).json({
      totalUsers: userCount,
      totalSurveyAnswers: surveyAnswerCount,
      recentActivity: recentAnswers,
      companyStats
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงสถิติข้อมูล:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};

// ล้างข้อมูลการสำรวจสำหรับบริษัทเฉพาะ
const clearCompanySurveyData = async (req, res) => {
  try {
    const { companyId } = req.body;
    
    if (!companyId) {
      return res.status(400).json({ error: 'ต้องระบุ ID บริษัท' });
    }
    
    // ค้นหาผู้ใช้ทั้งหมดจากบริษัทที่ระบุ
    const users = await prisma.user.findMany({
      where: {
        company_user: companyId
      },
      select: {
        id: true
      }
    });
    
    const userIds = users.map(user => user.id);
    
    if (userIds.length === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้สำหรับบริษัทนี้' });
    }
    
    // ลบคำตอบการสำรวจทั้งหมดสำหรับผู้ใช้จากบริษัทนี้
    const deletedCount = await prisma.surveyAnswer.deleteMany({
      where: {
        userId: { in: userIds }
      }
    });
    
    // รีเซ็ตสถานะการสำรวจสำหรับผู้ใช้ทั้งหมดจากบริษัทนี้
    const updatedUsers = await prisma.user.updateMany({
      where: {
        id: { in: userIds }
      },
      data: {
        surveyStatus: 'not_started'
      }
    });
    
    res.status(200).json({ 
      message: `ล้างข้อมูลการสำรวจ ${deletedCount.count} รายการ และรีเซ็ตสถานะผู้ใช้ ${updatedUsers.count} รายเรียบร้อยแล้ว`,
      deletedCount: deletedCount.count,
      updatedUsers: updatedUsers.count
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการล้างข้อมูลการสำรวจของบริษัท:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};

// เก็บข้อมูลการสำรวจเก่า (ย้ายไปตารางแยก)
const archiveOldSurveyData = async (req, res) => {
  try {
    const { olderThanDays } = req.body;
    const days = parseInt(olderThanDays) || 365; // ค่าเริ่มต้น 1 ปี
    
    // คำนวณวันที่ตัด
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // ค้นหาคำตอบการสำรวจเก่า
    const oldAnswers = await prisma.surveyAnswer.findMany({
      where: {
        createdAt: { lt: cutoffDate }
      },
      include: {
        user: {
          select: {
            company_user: true
          }
        }
      }
    });
    
    if (oldAnswers.length === 0) {
      return res.status(200).json({ message: 'ไม่มีข้อมูลเก่าที่ต้องเก็บ' });
    }
    
    // ในระบบจริง คุณจะย้ายข้อมูลเหล่านี้ไปยังตารางเก็บถาวร
    // ตอนนี้เราจะคืนแค่จำนวน
    res.status(200).json({ 
      message: `พบคำตอบการสำรวจเก่า ${oldAnswers.length} รายการที่ต้องเก็บ`,
      count: oldAnswers.length
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเก็บข้อมูลการสำรวจเก่า:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง' });
  }
};

module.exports = {
  getDataStatistics,
  clearCompanySurveyData,
  archiveOldSurveyData
};
// controllers/Questions/questionController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ดึงคำถามทั้งหมด (พร้อม options)
const getQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        options: true,
        survey_answers: {          // ✅ ใช้ survey_answers (ตรงกับ schema: survey_answers survey_answer[])
          where: {
            comment: { not: null }
          },
          select: {
            comment: true,
            user: {
              select: { name_user: true }
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.status(200).json(questions);
  } catch (error) {
    console.error('getQuestions error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// เพิ่มคำถามใหม่
const addQuestion = async (req, res) => {
  try {
    const { categoryId, text, options } = req.body;
    if (!categoryId || !text || !text.trim())
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });

    const maxOrder = await prisma.question.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order !== null ? maxOrder._max.order : -1) + 1;

    const created = await prisma.question.create({
      data: {
        text: text.trim(),
        categoryId: parseInt(categoryId),
        order: nextOrder,
        options: {
          create: (options || []).map(o => ({ text: o.text }))
        }
      },
      include: { options: true }
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('addQuestion error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// อัปเดตคำถาม
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, categoryId, options, order } = req.body;
    if (!text || !text.trim())
      return res.status(400).json({ message: 'คำถามเป็นข้อมูลบังคับ' });

    await prisma.option.deleteMany({ where: { questionId: parseInt(id) } });

    const updated = await prisma.question.update({
      where: { id: parseInt(id) },
      data: {
        text: text.trim(),
        categoryId: parseInt(categoryId),
        ...(order !== undefined && { order: parseInt(order) }),
        options: {
          create: (options || []).map(o => ({ text: o.text }))
        }
      },
      include: { options: true }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('updateQuestion error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// ย้ายคำถามไปหมวดหมู่อื่น
const moveQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { newCategoryId } = req.body;
    if (!newCategoryId)
      return res.status(400).json({ message: 'กรุณาระบุหมวดหมู่ใหม่' });

    const updated = await prisma.question.update({
      where: { id: parseInt(id) },
      data: { categoryId: parseInt(newCategoryId) }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('moveQuestion error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// ลบคำถาม
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await prisma.question.findUnique({ where: { id: parseInt(id) } });

    if (!question) return res.status(404).json({ message: 'ไม่พบคำถาม' });

    await prisma.option.deleteMany({ where: { questionId: parseInt(id) } });
    await prisma.question.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: 'ลบคำถามสำเร็จ' });
  } catch (error) {
    console.error('deleteQuestion error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

module.exports = {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  moveQuestion
}
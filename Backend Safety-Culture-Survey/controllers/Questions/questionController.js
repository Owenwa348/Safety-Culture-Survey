// controllers/Questions/questionController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ดึงคำถามทั้งหมด (พร้อม options)
const getQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: { options: true },
      orderBy: { id: 'asc' }
    })
    res.status(200).json(questions)
  } catch (error) {
    console.error('getQuestions error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// เพิ่มคำถามใหม่
const addQuestion = async (req, res) => {
  try {
    const { categoryId, text, options } = req.body
    if (!categoryId || !text || !text.trim())
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' })

    const created = await prisma.question.create({
      data: {
        text: text.trim(),
        categoryId: parseInt(categoryId),
        options: {
          create: (options || []).map(o => ({ text: o.text }))
        }
      },
      include: { options: true }
    })
    res.status(201).json(created)
  } catch (error) {
    console.error('addQuestion error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// แก้ไขคำถาม
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const { text, categoryId, options } = req.body
    if (!text || !text.trim())
      return res.status(400).json({ message: 'คำถามเป็นข้อมูลบังคับ' })

    // ลบ options เดิมก่อน
    await prisma.option.deleteMany({ where: { questionId: parseInt(id) } })

    const updated = await prisma.question.update({
      where: { id: parseInt(id) },
      data: {
        text: text.trim(),
        categoryId: parseInt(categoryId),
        options: {
          create: (options || []).map(o => ({ text: o.text }))
        }
      },
      include: { options: true }
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('updateQuestion error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// ลบคำถาม
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.option.deleteMany({ where: { questionId: parseInt(id) } })
    await prisma.question.delete({ where: { id: parseInt(id) } })
    res.status(200).json({ message: 'ลบคำถามสำเร็จ' })
  } catch (error) {
    console.error('deleteQuestion error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// ย้ายคำถามไปหมวดหมู่อื่น
const moveQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const { newCategoryId } = req.body
    if (!newCategoryId)
      return res.status(400).json({ message: 'กรุณาระบุหมวดหมู่ใหม่' })

    const updated = await prisma.question.update({
      where: { id: parseInt(id) },
      data: { categoryId: parseInt(newCategoryId) }
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('moveQuestion error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  moveQuestion
}

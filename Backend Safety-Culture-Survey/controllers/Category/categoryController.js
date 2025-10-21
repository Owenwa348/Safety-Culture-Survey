// controllers/Category/categoryController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ดึงหมวดหมู่ทั้งหมด (พร้อมคำถาม)
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { questions: true },
      orderBy: { id: 'asc' }
    })
    res.status(200).json(categories)
  } catch (error) {
    console.error('getCategories error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// เพิ่มหมวดหมู่ใหม่
const addCategory = async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อหมวดหมู่เป็นข้อมูลบังคับ' })

    const existing = await prisma.category.findFirst({ where: { name } })
    if (existing)
      return res.status(409).json({ message: 'มีหมวดหมู่นี้อยู่แล้ว' })

    const created = await prisma.category.create({
      data: { name: name.trim() }
    })
    res.status(201).json(created)
  } catch (error) {
    console.error('addCategory error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// แก้ไขชื่อหมวดหมู่
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อหมวดหมู่เป็นข้อมูลบังคับ' })

    const updated = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name: name.trim() }
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('updateCategory error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// ลบหมวดหมู่และคำถามในหมวดหมู่นั้น
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.option.deleteMany({
      where: { question: { categoryId: parseInt(id) } }
    })
    await prisma.question.deleteMany({
      where: { categoryId: parseInt(id) }
    })
    await prisma.category.delete({
      where: { id: parseInt(id) }
    })
    res.status(200).json({ message: 'ลบหมวดหมู่สำเร็จ' })
  } catch (error) {
    console.error('deleteCategory error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
}

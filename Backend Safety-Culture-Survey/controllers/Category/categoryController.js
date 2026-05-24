// controllers/Category/categoryController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const parseIds = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(Number)
  return String(value).split(',').map(Number).filter(Boolean)
}

// GET ?companyIds=1,2,3
// ✅ category มีแค่ 1 ชุด ผูกกับบริษัทแรก (min id) ของกลุ่ม
// query WHERE companyId = MIN(companyIds) แทนที่จะ IN ทั้งหมด
const getCategories = async (req, res) => {
  try {
    const ids = parseIds(req.query.companyIds)
    if (!ids.length)
      return res.status(400).json({ message: 'กรุณาระบุ companyIds' })

    // ✅ ใช้บริษัทแรก (id น้อยสุด) เป็น "ตัวแทน" ของกลุ่ม
    const primaryId = Math.min(...ids)

    const categories = await prisma.category.findMany({
      where: { companyId: primaryId },
      include: { questions: true },
      orderBy: { id: 'asc' },
    })
    res.status(200).json(categories)
  } catch (error) {
    console.error('getCategories error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// POST — สร้างให้บริษัทแรกของกลุ่มเท่านั้น (1 ชุดกลาง)
const addCategory = async (req, res) => {
  try {
    const { name, companyIds } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อหมวดหมู่เป็นข้อมูลบังคับ' })

    const ids = parseIds(companyIds)
    if (!ids.length)
      return res.status(400).json({ message: 'กรุณาระบุ companyIds' })

    // ✅ สร้างแค่บริษัทแรกของกลุ่ม
    const primaryId = Math.min(...ids)

    const existing = await prisma.category.findFirst({
      where: { name: name.trim(), companyId: primaryId },
    })
    if (existing)
      return res.status(409).json({ message: 'มีหมวดหมู่ชื่อนี้อยู่แล้ว' })

    const cat = await prisma.category.create({
      data: { name: name.trim(), companyId: primaryId },
    })

    res.status(201).json([cat])  // คืน array เพื่อให้ frontend ใช้ push(...res.data) เหมือนเดิม
  } catch (error) {
    console.error('addCategory error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// PUT /:id — แก้ทีละ record ปกติ
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อหมวดหมู่เป็นข้อมูลบังคับ' })

    const existing = await prisma.category.findUnique({ where: { id: parseInt(id) } })
    if (!existing)
      return res.status(404).json({ message: 'ไม่พบหมวดหมู่' })

    const updated = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name: name.trim() },
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('updateCategory error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// DELETE /:id — ลบ cascade พร้อม survey_answers
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const existing = await prisma.category.findUnique({ where: { id: parseInt(id) } })
    if (!existing)
      return res.status(404).json({ message: 'ไม่พบหมวดหมู่' })

    // ✅ ลบตามลำดับ: survey_answers → options → questions → category
    // 1. ลบ survey_answers (ข้อมูลการตอบแบบสอบถาม)
    await prisma.survey_answer.deleteMany({
      where: { question: { categoryId: parseInt(id) } }
    })

    // 2. ลบ options (ตัวเลือกของคำถาม)
    await prisma.option.deleteMany({ where: { question: { categoryId: parseInt(id) } } })

    // 3. ลบ questions (คำถาม)
    await prisma.question.deleteMany({ where: { categoryId: parseInt(id) } })

    // 4. ลบ category (หมวดหมู่)
    await prisma.category.delete({ where: { id: parseInt(id) } })

    res.status(200).json({ message: 'ลบหมวดหมู่สำเร็จ' })
  } catch (error) {
    console.error('deleteCategory error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getCategories, addCategory, updateCategory, deleteCategory }
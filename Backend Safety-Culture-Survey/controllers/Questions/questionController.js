// controllers/Questions/questionController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const parseIds = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(Number)
  return String(value).split(',').map(Number).filter(Boolean)
}

// GET — ดึง companyIds จาก JWT token ก่อน ถ้าไม่มีค่อย fallback จาก query string
// ✅ question มีแค่ 1 ชุด ผูกกับ category ของบริษัทแรก (primaryId)
const getQuestions = async (req, res) => {
  try {
    const ids =
      req.user?.matchedCompanyIds?.length ? req.user.matchedCompanyIds.map(Number) :
      req.user?.companyId                 ? [Number(req.user.companyId)] :
      parseIds(req.query.companyIds);

    if (!ids.length)
      return res.status(400).json({ message: 'ไม่พบข้อมูลบริษัทจาก token' })

    const primaryId = Math.min(...ids)

    const questions = await prisma.question.findMany({
      where: { category: { companyId: primaryId } },
      include: {
        options: true,
        survey_answers: {
          where: { comment: { not: null } },
          select: { comment: true, user: { select: { name_user: true } } },
        },
      },
      orderBy: { order: 'asc' },
    })
    res.status(200).json(questions)
  } catch (error) {
    console.error('getQuestions error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// POST
const addQuestion = async (req, res) => {
  try {
    const { categoryId, text, options, companyIds } = req.body
    if (!categoryId || !text || !text.trim())
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' })

    const ids = parseIds(companyIds)
    const primaryId = ids.length ? Math.min(...ids) : null

    if (primaryId) {
      const category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } })
      if (!category || category.companyId !== primaryId)
        return res.status(403).json({ message: 'หมวดหมู่นี้ไม่ใช่ของกลุ่มบริษัทที่เลือก' })
    }

    // ✅ หา max order ของ category นี้โดยเฉพาะ
    const lastInCategory = await prisma.question.findFirst({
      where: { categoryId: parseInt(categoryId) },
      select: { order: true },
      orderBy: { order: 'desc' },
    })

    // ✅ หา order ถัดไปใน category นี้ = lastOrder + 1
    // แต่ถ้า category นี้ยังไม่มีคำถาม ให้แทรกต่อจาก category ก่อนหน้า
    let insertOrder

    if (lastInCategory) {
      // มีคำถามใน category นี้แล้ว → แทรกต่อท้าย category นี้
      insertOrder = lastInCategory.order + 1
    } else {
      // category นี้ยังว่าง → หา max order ของทั้งบริษัทแล้วต่อท้าย
      const lastInCompany = await prisma.question.findFirst({
        where: primaryId ? { category: { companyId: primaryId } } : {},
        select: { order: true },
        orderBy: { order: 'desc' },
      })
      insertOrder = lastInCompany ? lastInCompany.order + 1 : 0
    }

    // ✅ ดัน order ของทุกคำถามที่ order >= insertOrder ขึ้น +1
    await prisma.question.updateMany({
      where: {
        order: { gte: insertOrder },
        ...(primaryId ? { category: { companyId: primaryId } } : {}),
      },
      data: { order: { increment: 1 } },
    })

    // ✅ สร้างคำถามใหม่ที่ insertOrder
    const created = await prisma.question.create({
      data: {
        text: text.trim(),
        categoryId: parseInt(categoryId),
        order: insertOrder,
        options: { create: (options || []).map(o => ({ text: o.text })) },
      },
      include: { options: true },
    })

    res.status(201).json(created)
  } catch (error) {
    console.error('addQuestion error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// PUT /:id
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const { text, categoryId, options, order, companyIds } = req.body
    if (!text || !text.trim())
      return res.status(400).json({ message: 'คำถามเป็นข้อมูลบังคับ' })

    const ids = parseIds(companyIds)
    if (ids.length && categoryId) {
      const primaryId = Math.min(...ids)
      const category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } })
      if (!category || category.companyId !== primaryId)
        return res.status(403).json({ message: 'หมวดหมู่นี้ไม่ใช่ของกลุ่มบริษัทที่เลือก' })
    }

    await prisma.option.deleteMany({ where: { questionId: parseInt(id) } })

    const updated = await prisma.question.update({
      where: { id: parseInt(id) },
      data: {
        text: text.trim(),
        categoryId: parseInt(categoryId),
        ...(order !== undefined && { order: parseInt(order) }),
        options: { create: (options || []).map(o => ({ text: o.text })) },
      },
      include: { options: true },
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('updateQuestion error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// PUT /:id/move
const moveQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const { newCategoryId, companyIds } = req.body
    if (!newCategoryId)
      return res.status(400).json({ message: 'กรุณาระบุหมวดหมู่ใหม่' })

    const ids = parseIds(companyIds)
    if (ids.length) {
      const primaryId = Math.min(...ids)
      const category = await prisma.category.findUnique({ where: { id: parseInt(newCategoryId) } })
      if (!category || category.companyId !== primaryId)
        return res.status(403).json({ message: 'หมวดหมู่ปลายทางไม่ใช่ของกลุ่มบริษัทที่เลือก' })
    }

    const updated = await prisma.question.update({
      where: { id: parseInt(id) },
      data: { categoryId: parseInt(newCategoryId) },
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('moveQuestion error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// DELETE /:id
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const question = await prisma.question.findUnique({ where: { id: parseInt(id) } })
    if (!question)
      return res.status(404).json({ message: 'ไม่พบคำถาม' })

    // ✅ ลบตามลำดับ: survey_answers → options → questions
    // 1. ลบ survey_answers (ข้อมูลการตอบแบบสอบถาม)
    await prisma.survey_answer.deleteMany({ where: { questionId: parseInt(id) } })

    // 2. ลบ options (ตัวเลือกของคำถาม)
    await prisma.option.deleteMany({ where: { questionId: parseInt(id) } })

    // 3. ลบ questions (คำถาม)
    await prisma.question.delete({ where: { id: parseInt(id) } })

    res.status(200).json({ message: 'ลบคำถามสำเร็จ' })
  } catch (error) {
    console.error('deleteQuestion error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = { getQuestions, addQuestion, updateQuestion, deleteQuestion, moveQuestion }
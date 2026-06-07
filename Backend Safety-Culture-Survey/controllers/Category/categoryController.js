const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const parseIds = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(Number)
  return String(value).split(',').map(Number).filter(Boolean)
}

const getCategories = async (req, res) => {
  try {
    const ids =
      req.user?.matchedCompanyIds?.length ? req.user.matchedCompanyIds.map(Number) :
      req.user?.companyId                 ? [Number(req.user.companyId)] :
      parseIds(req.query.companyIds)

    if (!ids.length)
      return res.status(400).json({ message: 'ไม่พบข้อมูลบริษัทจาก token' })

    const primaryId = Math.min(...ids)

    const categories = await prisma.category.findMany({
      where: { companyId: primaryId },
      include: { questions: true },
      orderBy: { order: 'asc' },
    })
    res.status(200).json(categories)
  } catch (error) {
    console.error('getCategories error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// ✅ รองรับ insertAtIndex สำหรับแทรกตำแหน่ง
const addCategory = async (req, res) => {
  try {
    const { name, companyIds, insertAtIndex } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อหมวดหมู่เป็นข้อมูลบังคับ' })

    const ids = parseIds(companyIds)
    if (!ids.length)
      return res.status(400).json({ message: 'กรุณาระบุ companyIds' })

    const primaryId = Math.min(...ids)

    const existing = await prisma.category.findFirst({
      where: { name: name.trim(), companyId: primaryId },
    })
    if (existing)
      return res.status(409).json({ message: 'มีหมวดหมู่ชื่อนี้อยู่แล้ว' })

    const allCategories = await prisma.category.findMany({
      where: { companyId: primaryId },
      orderBy: { order: 'asc' },
    })

    const targetIndex = (insertAtIndex !== undefined && insertAtIndex !== null)
      ? Math.max(0, Math.min(parseInt(insertAtIndex), allCategories.length))
      : allCategories.length

    // ดัน order ของ categories หลังจุดแทรก +1
    const categoriesToShift = allCategories.slice(targetIndex)
    if (categoriesToShift.length > 0) {
      await prisma.$transaction(
        categoriesToShift.map(cat =>
          prisma.category.update({
            where: { id: cat.id },
            data: { order: cat.order + 1 },
          })
        )
      )
    }

    const cat = await prisma.category.create({
      data: { name: name.trim(), companyId: primaryId, order: targetIndex },
    })

    res.status(201).json([cat])
  } catch (error) {
    console.error('addCategory error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

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

const reorderCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { direction, companyIds } = req.body

    if (!direction || !['up', 'down'].includes(direction))
      return res.status(400).json({ message: 'direction ต้องเป็น up หรือ down' })

    const ids = parseIds(companyIds)
    const primaryId = ids.length ? Math.min(...ids) : null
    if (!primaryId)
      return res.status(400).json({ message: 'ไม่พบข้อมูลบริษัท' })

    const allCategories = await prisma.category.findMany({
      where: { companyId: primaryId },
      orderBy: { order: 'asc' },
    })

    const currentIndex = allCategories.findIndex(c => c.id === parseInt(id))
    if (currentIndex === -1)
      return res.status(404).json({ message: 'ไม่พบหมวดหมู่' })

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (swapIndex < 0 || swapIndex >= allCategories.length)
      return res.status(400).json({ message: 'ไม่สามารถเลื่อนได้' })

    const current = allCategories[currentIndex]
    const swap = allCategories[swapIndex]

    await prisma.$transaction([
      prisma.category.update({
        where: { id: current.id },
        data: { order: swap.order },
      }),
      prisma.category.update({
        where: { id: swap.id },
        data: { order: current.order },
      }),
    ])

    res.status(200).json({ message: 'เรียงหมวดหมู่สำเร็จ' })
  } catch (error) {
    console.error('reorderCategory error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const existing = await prisma.category.findUnique({ where: { id: parseInt(id) } })
    if (!existing)
      return res.status(404).json({ message: 'ไม่พบหมวดหมู่' })

    await prisma.survey_answer.deleteMany({
      where: { question: { categoryId: parseInt(id) } }
    })
    await prisma.option.deleteMany({ where: { question: { categoryId: parseInt(id) } } })
    await prisma.question.deleteMany({ where: { categoryId: parseInt(id) } })
    await prisma.category.delete({ where: { id: parseInt(id) } })

    if (existing.companyId) {
      const remaining = await prisma.category.findMany({
        where: { companyId: existing.companyId },
        orderBy: { order: 'asc' },
      })
      await prisma.$transaction(
        remaining.map((cat, index) =>
          prisma.category.update({
            where: { id: cat.id },
            data: { order: index },
          })
        )
      )
    }

    res.status(200).json({ message: 'ลบหมวดหมู่สำเร็จ' })
  } catch (error) {
    console.error('deleteCategory error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getCategories, addCategory, updateCategory, deleteCategory, reorderCategory }
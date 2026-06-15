// controllers/Position/positionController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const parseIds = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(Number)
  return String(value).split(',').map(Number).filter(Boolean)
}

// ✅ Public — ใช้ใน Registration page (ไม่ต้อง token)
//    รับ ?companyId= หรือ ?companyIds= จาก query param
const getPositionsPublic = async (req, res) => {
  try {
    const ids = parseIds(req.query.companyId || req.query.companyIds)

    if (!ids.length)
      return res.status(400).json({ message: 'กรุณาระบุ companyId' })

    const positions = await prisma.position.findMany({
      where: { companyId: { in: ids } },
      orderBy: { id: 'asc' },
    })

    const seen   = new Set()
    const deduped = positions.filter(p => {
      if (seen.has(p.name)) return false
      seen.add(p.name)
      return true
    })

    res.status(200).json(deduped)
  } catch (error) {
    console.error('getPositionsPublic error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// 🔒 Protected — ใช้ใน Admin dashboard (ต้อง token)
const getPositions = async (req, res) => {
  try {
    const ids =
      req.user?.matchedCompanyIds?.length ? req.user.matchedCompanyIds.map(Number) :
      req.user?.companyId                 ? [Number(req.user.companyId)] :
      parseIds(req.query.companyIds)

    if (!ids.length)
      return res.status(400).json({ message: 'ไม่พบข้อมูลบริษัทจาก token' })

    const positions = await prisma.position.findMany({
      where: { companyId: { in: ids } },
      orderBy: { id: 'asc' },
    })

    const seen    = new Set()
    const deduped = positions.filter(p => {
      if (seen.has(p.name)) return false
      seen.add(p.name)
      return true
    })

    res.status(200).json(deduped)
  } catch (error) {
    console.error('getPositions error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const addPosition = async (req, res) => {
  try {
    const { name, companyIds } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อเป็นข้อมูลบังคับ' })

    const ids = parseIds(companyIds)
    if (!ids.length)
      return res.status(400).json({ message: 'กรุณาระบุ companyIds' })

    const created = []
    for (const cId of ids) {
      const existing = await prisma.position.findFirst({
        where: { name: name.trim(), companyId: cId },
      })
      if (!existing) {
        const pos = await prisma.position.create({
          data: { name: name.trim(), companyId: cId },
        })
        created.push(pos)
      }
    }

    res.status(201).json(created)
  } catch (error) {
    console.error('addPosition error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updatePosition = async (req, res) => {
  try {
    const { id }             = req.params
    const { name, companyIds } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อเป็นข้อมูลบังคับ' })

    const target = await prisma.position.findUnique({ where: { id: parseInt(id) } })
    if (!target)
      return res.status(404).json({ message: 'ไม่พบตำแหน่งที่ต้องการแก้ไข' })

    const ids = parseIds(companyIds)

    if (ids.length > 0) {
      await prisma.position.updateMany({
        where: { name: target.name, companyId: { in: ids } },
        data:  { name: name.trim() },
      })
    } else {
      await prisma.position.update({
        where: { id: parseInt(id) },
        data:  { name: name.trim() },
      })
    }

    const updated = await prisma.position.findUnique({ where: { id: parseInt(id) } })
    res.status(200).json(updated)
  } catch (error) {
    console.error('updatePosition error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const deletePosition = async (req, res) => {
  try {
    const { id }     = req.params
    const companyIds = req.query.companyIds

    const target = await prisma.position.findUnique({ where: { id: parseInt(id) } })
    if (!target)
      return res.status(404).json({ message: 'ไม่พบตำแหน่ง' })

    const ids = parseIds(companyIds)

    if (ids.length > 0) {
      await prisma.position.deleteMany({
        where: { name: target.name, companyId: { in: ids } },
      })
    } else {
      await prisma.position.delete({ where: { id: parseInt(id) } })
    }

    res.status(200).json({ message: 'ลบสำเร็จ' })
  } catch (error) {
    console.error('deletePosition error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getPositionsPublic,  // ✅ export ใหม่
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
}
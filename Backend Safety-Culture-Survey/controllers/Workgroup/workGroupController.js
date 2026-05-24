// controllers/WorkGroup/workGroupController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const parseIds = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(Number)
  return String(value).split(',').map(Number).filter(Boolean)
}

// GET ?companyIds=1,2,3 — deduplicate by name
const getWorkGroups = async (req, res) => {
  try {
    const ids = parseIds(req.query.companyIds)
    if (!ids.length)
      return res.status(400).json({ message: 'กรุณาระบุ companyIds' })

    const workGroups = await prisma.work_group.findMany({
      where: { companyId: { in: ids } },
      orderBy: { id: 'asc' },
    })

    // ✅ deduplicate by name
    const seen = new Set()
    const deduped = workGroups.filter(wg => {
      if (seen.has(wg.name)) return false
      seen.add(wg.name)
      return true
    })

    res.status(200).json(deduped)
  } catch (error) {
    console.error('getWorkGroups error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// POST — สร้างให้ทุกบริษัทในกลุ่ม
const addWorkGroup = async (req, res) => {
  try {
    const { name, companyIds } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อกลุ่มงานเป็นข้อมูลบังคับ' })

    const ids = parseIds(companyIds)
    if (!ids.length)
      return res.status(400).json({ message: 'กรุณาระบุ companyIds' })

    const created = []
    for (const cId of ids) {
      const existing = await prisma.work_group.findFirst({
        where: { name: name.trim(), companyId: cId },
      })
      if (!existing) {
        const wg = await prisma.work_group.create({
          data: { name: name.trim(), companyId: cId },
        })
        created.push(wg)
      }
    }

    res.status(201).json(created)
  } catch (error) {
    console.error('addWorkGroup error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// PUT /:id — sync อัปเดตทุก record ที่ชื่อเดิมในกลุ่ม
const updateWorkGroup = async (req, res) => {
  try {
    const { id } = req.params
    const { name, companyIds } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อกลุ่มงานเป็นข้อมูลบังคับ' })

    const target = await prisma.work_group.findUnique({ where: { id: parseInt(id) } })
    if (!target)
      return res.status(404).json({ message: 'ไม่พบกลุ่มงานที่ต้องการแก้ไข' })

    const ids = parseIds(companyIds)

    if (ids.length > 0) {
      // ✅ sync — อัปเดตทุก record ที่มีชื่อเดิม ในทุกบริษัทของกลุ่ม
      await prisma.work_group.updateMany({
        where: {
          name: target.name,
          companyId: { in: ids },
        },
        data: { name: name.trim() },
      })
    } else {
      await prisma.work_group.update({
        where: { id: parseInt(id) },
        data: { name: name.trim() },
      })
    }

    const updated = await prisma.work_group.findUnique({ where: { id: parseInt(id) } })
    res.status(200).json(updated)
  } catch (error) {
    console.error('updateWorkGroup error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// DELETE /:id — sync ลบทุก record ที่ชื่อเดิมในกลุ่ม
const deleteWorkGroup = async (req, res) => {
  try {
    const { id } = req.params
    const companyIds = req.query.companyIds

    const target = await prisma.work_group.findUnique({ where: { id: parseInt(id) } })
    if (!target)
      return res.status(404).json({ message: 'ไม่พบกลุ่มงาน' })

    const ids = parseIds(companyIds)

    if (ids.length > 0) {
      // ✅ sync — ลบทุก record ที่มีชื่อเดิม ในทุกบริษัทของกลุ่ม
      await prisma.work_group.deleteMany({
        where: {
          name: target.name,
          companyId: { in: ids },
        },
      })
    } else {
      await prisma.work_group.delete({ where: { id: parseInt(id) } })
    }

    res.status(200).json({ message: 'ลบสำเร็จ' })
  } catch (error) {
    console.error('deleteWorkGroup error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getWorkGroups, addWorkGroup, updateWorkGroup, deleteWorkGroup }
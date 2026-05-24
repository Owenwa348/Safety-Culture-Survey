// controllers/Department/departmentController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const parseIds = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(Number)
  return String(value).split(',').map(Number).filter(Boolean)
}

// GET ?companyIds=1,2,3 — deduplicate by name
const getDepartments = async (req, res) => {
  try {
    const ids = parseIds(req.query.companyIds)
    if (!ids.length)
      return res.status(400).json({ message: 'กรุณาระบุ companyIds' })

    const departments = await prisma.department.findMany({
      where: { companyId: { in: ids } },
      orderBy: { id: 'asc' },
    })

    // ✅ deduplicate by name
    const seen = new Set()
    const deduped = departments.filter(d => {
      if (seen.has(d.name)) return false
      seen.add(d.name)
      return true
    })

    res.status(200).json(deduped)
  } catch (error) {
    console.error('getDepartments error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// POST — สร้างให้ทุกบริษัทในกลุ่ม
const addDepartment = async (req, res) => {
  try {
    const { name, companyIds } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อสายงานเป็นข้อมูลบังคับ' })

    const ids = parseIds(companyIds)
    if (!ids.length)
      return res.status(400).json({ message: 'กรุณาระบุ companyIds' })

    const created = []
    for (const cId of ids) {
      const existing = await prisma.department.findFirst({
        where: { name: name.trim(), companyId: cId },
      })
      if (!existing) {
        const dept = await prisma.department.create({
          data: { name: name.trim(), companyId: cId },
        })
        created.push(dept)
      }
    }

    res.status(201).json(created)
  } catch (error) {
    console.error('addDepartment error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// PUT /:id — sync อัปเดตทุก record ที่ชื่อเดิมในกลุ่ม
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params
    const { name, companyIds } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อสายงานเป็นข้อมูลบังคับ' })

    const target = await prisma.department.findUnique({ where: { id: parseInt(id) } })
    if (!target)
      return res.status(404).json({ message: 'ไม่พบสายงานที่ต้องการแก้ไข' })

    const ids = parseIds(companyIds)

    if (ids.length > 0) {
      // ✅ sync — อัปเดตทุก record ที่มีชื่อเดิม ในทุกบริษัทของกลุ่ม
      await prisma.department.updateMany({
        where: {
          name: target.name,
          companyId: { in: ids },
        },
        data: { name: name.trim() },
      })
    } else {
      await prisma.department.update({
        where: { id: parseInt(id) },
        data: { name: name.trim() },
      })
    }

    const updated = await prisma.department.findUnique({ where: { id: parseInt(id) } })
    res.status(200).json(updated)
  } catch (error) {
    console.error('updateDepartment error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// DELETE /:id — sync ลบทุก record ที่ชื่อเดิมในกลุ่ม
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params
    const companyIds = req.query.companyIds

    const target = await prisma.department.findUnique({ where: { id: parseInt(id) } })
    if (!target)
      return res.status(404).json({ message: 'ไม่พบสายงาน' })

    const ids = parseIds(companyIds)

    if (ids.length > 0) {
      // ✅ sync — ลบทุก record ที่มีชื่อเดิม ในทุกบริษัทของกลุ่ม
      await prisma.department.deleteMany({
        where: {
          name: target.name,
          companyId: { in: ids },
        },
      })
    } else {
      await prisma.department.delete({ where: { id: parseInt(id) } })
    }

    res.status(200).json({ message: 'ลบสำเร็จ' })
  } catch (error) {
    console.error('deleteDepartment error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getDepartments, addDepartment, updateDepartment, deleteDepartment }
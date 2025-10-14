// controllers/Department/departmentController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// GET / -> ดึงรายการสายงาน (isActive = true)
const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
        orderBy: { id: 'asc' },
    })
    res.status(200).json(departments)
  } catch (error) {
    console.error('getDepartments error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// POST / -> เพิ่มสายงาน
const addDepartment = async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'ชื่อสายงานเป็นข้อมูลบังคับ' })
    }

    // ตรวจสอบซ้ำ (optional)
    const existing = await prisma.department.findFirst({
      where: { name },
    })
    if (existing) {
      return res.status(409).json({ message: 'มีสายงานชื่อนี้ในระบบแล้ว' })
    }

    const created = await prisma.department.create({
      data: { name: name.trim() },
    })
    res.status(201).json(created)
  } catch (error) {
    console.error('addDepartment error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// PUT /:id -> แก้ไขชื่อสายงาน
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'ชื่อสายงานเป็นข้อมูลบังคับ' })
    }

    const updated = await prisma.department.update({
      where: { id: parseInt(id) },
      data: { name: name.trim() },
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('updateDepartment error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// DELETE /:id -> ลบออกจากฐานข้อมูลจริง
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.department.delete({
      where: { id: parseInt(id) },
    })
    res.status(200).json({ message: 'ลบสำเร็จ' })
  } catch (error) {
    console.error('deleteDepartment error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
}

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getWorkGroups = async (req, res) => {
  try {
    const workGroups = await prisma.workGroup.findMany({
      orderBy: { id: 'asc' },
    })
    res.status(200).json(workGroups)
  } catch (error) {
    console.error('getWorkGroups error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const addWorkGroup = async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อเป็นข้อมูลบังคับ' })

    const existing = await prisma.workGroup.findFirst({ where: { name } })
    if (existing)
      return res.status(409).json({ message: 'มีรายการนี้แล้ว' })

    const created = await prisma.workGroup.create({
      data: { name: name.trim() },
    })
    res.status(201).json(created)
  } catch (error) {
    console.error('addWorkGroup error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateWorkGroup = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อเป็นข้อมูลบังคับ' })

    const updated = await prisma.workGroup.update({
      where: { id: parseInt(id) },
      data: { name: name.trim() },
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('updateWorkGroup error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// แก้ให้ลบจริง
const deleteWorkGroup = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.workGroup.delete({
      where: { id: parseInt(id) },
    })
    res.status(200).json({ message: 'ลบสำเร็จ' })
  } catch (error) {
    console.error('deleteWorkGroup error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getWorkGroups,
  addWorkGroup,
  updateWorkGroup,
  deleteWorkGroup,
}

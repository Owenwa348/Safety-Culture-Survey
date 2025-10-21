const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getPositions = async (req, res) => {
  try {
    const positions = await prisma.position.findMany({
      orderBy: { id: 'asc' },
    })
    res.status(200).json(positions)
  } catch (error) {
    console.error('getPositions error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const addPosition = async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อเป็นข้อมูลบังคับ' })

    const existing = await prisma.position.findFirst({ where: { name } })
    if (existing)
      return res.status(409).json({ message: 'มีรายการนี้แล้ว' })

    const created = await prisma.position.create({
      data: { name: name.trim() },
    })
    res.status(201).json(created)
  } catch (error) {
    console.error('addPosition error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updatePosition = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อเป็นข้อมูลบังคับ' })

    const updated = await prisma.position.update({
      where: { id: parseInt(id) },
      data: { name: name.trim() },
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('updatePosition error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// แก้ให้ลบจริง
const deletePosition = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.position.delete({
      where: { id: parseInt(id) },
    })
    res.status(200).json({ message: 'ลบสำเร็จ' })
  } catch (error) {
    console.error('deletePosition error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
}

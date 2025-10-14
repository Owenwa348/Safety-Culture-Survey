const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getExperiences = async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { id: 'asc' },
    })
    res.status(200).json(experiences)
  } catch (error) {
    console.error('getExperiences error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const addExperience = async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อเป็นข้อมูลบังคับ' })

    const existing = await prisma.experience.findFirst({ where: { name } })
    if (existing)
      return res.status(409).json({ message: 'มีรายการนี้แล้ว' })

    const created = await prisma.experience.create({
      data: { name: name.trim() },
    })
    res.status(201).json(created)
  } catch (error) {
    console.error('addExperience error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name || !name.trim())
      return res.status(400).json({ message: 'ชื่อเป็นข้อมูลบังคับ' })

    const updated = await prisma.experience.update({
      where: { id: parseInt(id) },
      data: { name: name.trim() },
    })
    res.status(200).json(updated)
  } catch (error) {
    console.error('updateExperience error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

//  แก้ให้ลบจริง
const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.experience.delete({
      where: { id: parseInt(id) },
    })
    res.status(200).json({ message: 'ลบสำเร็จ' })
  } catch (error) {
    console.error('deleteExperience error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
}

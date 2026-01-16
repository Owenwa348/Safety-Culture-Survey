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

    const workGroupId = parseInt(id);

    // Find the workGroup to get the old name
    const existingWorkGroup = await prisma.workGroup.findUnique({
      where: { id: workGroupId },
    });

    if (!existingWorkGroup) {
      return res.status(404).json({ message: "ไม่พบกลุ่มงานที่ต้องการแก้ไข" });
    }

    const oldName = existingWorkGroup.name;
    const newName = name.trim();

    // If the name is not changing, no need to update users
    if (oldName === newName) {
      return res.status(200).json(existingWorkGroup);
    }

    // Use a transaction to update both workGroup and related users
    const [updatedWorkGroup] = await prisma.$transaction([
      prisma.workGroup.update({
        where: { id: workGroupId },
        data: { name: newName },
      }),
      prisma.user.updateMany({
        where: { work_group_user: oldName },
        data: { work_group_user: newName },
      }),
    ]);

    res.status(200).json(updatedWorkGroup)
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

// controllers/Workgroup/workGroupController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const parseIds = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(Number)
  return String(value).split(',').map(Number).filter(Boolean)
}

// ✅ เพิ่มใหม่ — Public สำหรับ Registration page (ไม่ต้อง token)
const getWorkGroupsPublic = async (req, res) => {
  try {
    const ids = parseIds(req.query.companyId || req.query.companyIds)

    if (!ids.length)
      return res.status(400).json({ message: 'กรุณาระบุ companyId' })

    const workGroups = await prisma.work_group.findMany({
      where: { companyId: { in: ids } },
      orderBy: { id: 'asc' },
    })

    const seen = new Set()
    const deduped = workGroups.filter(w => {
      if (seen.has(w.name)) return false
      seen.add(w.name)
      return true
    })

    res.status(200).json(deduped)
  } catch (error) {
    console.error('getWorkGroupsPublic error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// โค้ดเดิมทั้งหมด — ไม่แตะเลย
const getWorkGroups = async (req, res) => {
  try {
    const ids =
      req.user?.matchedCompanyIds?.length ? req.user.matchedCompanyIds.map(Number) :
      req.user?.companyIds?.length        ? req.user.companyIds.map(Number) :
      req.user?.companyId                 ? [Number(req.user.companyId)] :
      parseIds(req.query.companyIds);

    if (!ids.length)
      return res.status(400).json({ message: 'ไม่พบข้อมูลบริษัทจาก token' });

    const workGroups = await prisma.work_group.findMany({
      where: { companyId: { in: ids } },
      orderBy: { id: 'asc' },
    });

    const seen = new Set();
    const deduped = workGroups.filter(wg => {
      if (seen.has(wg.name)) return false;
      seen.add(wg.name);
      return true;
    });

    res.status(200).json(deduped);
  } catch (error) {
    console.error('getWorkGroups error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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
      await prisma.work_group.updateMany({
        where: { name: target.name, companyId: { in: ids } },
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

const deleteWorkGroup = async (req, res) => {
  try {
    const { id } = req.params
    const companyIds = req.query.companyIds

    const target = await prisma.work_group.findUnique({ where: { id: parseInt(id) } })
    if (!target)
      return res.status(404).json({ message: 'ไม่พบกลุ่มงาน' })

    const ids = parseIds(companyIds)

    if (ids.length > 0) {
      await prisma.work_group.deleteMany({
        where: { name: target.name, companyId: { in: ids } },
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

module.exports = {
  getWorkGroupsPublic,
  getWorkGroups,
  addWorkGroup,
  updateWorkGroup,
  deleteWorkGroup,
}
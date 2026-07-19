// services/companyService.js
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

// ─────────────────────────────────────────
// ฟังก์ชันเดิม — ใช้สำหรับ Admin Login
// ─────────────────────────────────────────
async function getMatchedCompanyIds(adminCompanyName) {
  if (!adminCompanyName) return [];

  const name = adminCompanyName.trim();
  const firstWord = name.split(' ')[0];
  const likePattern = `${firstWord.toLowerCase()} %`;

  const matched = await prisma.$queryRaw(
    Prisma.sql`
      SELECT id, name
      FROM company
      WHERE LOWER(name) = LOWER(${name})
         OR LOWER(name) LIKE ${likePattern}
    `
  );

  // Debug logs removed: avoid logging query parameters and DB results

  return matched.map((row) => row.id);
}

// ─────────────────────────────────────────
// ✅ ฟังก์ชันใหม่ — ดึงคำแรกของชื่อบริษัทมาเป็น "ชื่อกลุ่ม"
// "SafeGuard Operations Co., Ltd." → "SafeGuard"
// "ThaiBev Solutions Co., Ltd."    → "ThaiBev"
// ─────────────────────────────────────────
function extractGroupPrefix(companyName) {
  if (!companyName) return 'Unknown';
  return companyName.trim().split(/\s+/)[0];
}

// ─────────────────────────────────────────
// ✅ ฟังก์ชันใหม่ — จัดกลุ่มบริษัทตามคำแรกของชื่อ
// filterIds = null  → SuperAdmin เห็นทุกบริษัท
// filterIds = [1,2] → Admin เห็นเฉพาะบริษัทในขอบเขต
//
// Return:
// [
//   {
//     groupName: "SafeGuard Group",
//     groupPrefix: "SafeGuard",
//     companyIds: [1, 2, 3],
//     companies: [{ id: 1, name: "SafeGuard Operations Co., Ltd." }, ...]
//   },
//   ...
// ]
// ─────────────────────────────────────────
async function getCompanyGroups(filterIds = null) {
  const where = filterIds !== null ? { id: { in: filterIds } } : {};

  const companies = await prisma.company.findMany({
    where,
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  // จัดกลุ่มตามคำแรก
  const groupMap = {};

  for (const company of companies) {
    const prefix = extractGroupPrefix(company.name);
    const groupName = `${prefix} Group`;

    if (!groupMap[groupName]) {
      groupMap[groupName] = {
        groupName,
        groupPrefix: prefix,
        companyIds: [],
        companies: []
      };
    }

    groupMap[groupName].companyIds.push(company.id);
    groupMap[groupName].companies.push({ id: company.id, name: company.name });
  }

  return Object.values(groupMap).sort((a, b) =>
    a.groupName.localeCompare(b.groupName)
  );
}

// ─────────────────────────────────────────
// ✅ ฟังก์ชันใหม่ — ดึง companyIds ของกลุ่มที่ระบุ
// ใช้ logic เดียวกับ getMatchedCompanyIds แต่รับ prefix แทน
// ─────────────────────────────────────────
async function getCompanyIdsByGroupPrefix(groupPrefix, filterIds = null) {
  if (!groupPrefix) return [];

  const likePattern = `${groupPrefix.toLowerCase()} %`;
  const exactMatch = groupPrefix.toLowerCase();

  const matched = await prisma.$queryRaw(
    Prisma.sql`
      SELECT id, name
      FROM company
      WHERE LOWER(name) = ${exactMatch}
         OR LOWER(name) LIKE ${likePattern}
    `
  );

  let ids = matched.map((row) => row.id);

  // ถ้ามี filterIds (Admin) → ตัด ids ที่ไม่อยู่ใน scope ออก
  if (filterIds !== null) {
    ids = ids.filter(id => filterIds.includes(id));
  }

  return ids;
}

module.exports = {
  getMatchedCompanyIds,        // เดิม — ใช้ใน Admin Login
  getCompanyGroups,            // ใหม่ — ใช้ใน Settings dropdown
  getCompanyIdsByGroupPrefix,  // ใหม่ — ใช้ filter ข้อมูลตามกลุ่ม
  extractGroupPrefix,          // ใหม่ — utility
};
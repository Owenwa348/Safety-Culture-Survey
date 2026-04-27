// services/companyService.js
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMatchedCompanyIds(adminCompanyName) {
  if (!adminCompanyName) return [];

  const name = adminCompanyName.trim();
  
  // ✅ ใช้แค่คำแรกของ companyName เป็น prefix
  // "SafeGuard Group" → prefix = "SafeGuard"
  // "a" → prefix = "a"
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

  console.log(`[companyService] searching: "${name}" (firstWord: "${firstWord}")`);
  console.log(`[companyService] matched:`, matched);

  return matched.map((row) => row.id);
}

module.exports = { getMatchedCompanyIds };
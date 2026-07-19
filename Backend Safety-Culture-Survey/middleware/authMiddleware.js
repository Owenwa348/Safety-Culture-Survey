// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { getMatchedCompanyIds } = require('../services/companyService');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Query matchedCompanyIds จาก DB ทุก request (real-time เสมอ)
    const normalizedRole = decoded.role?.replace(/\s+/g, '') || 'Admin';

    // Debug log removed: avoid leaking token/identity details in logs

    if (normalizedRole === 'Admin' && decoded.companyName) {
      decoded.matchedCompanyIds = await getMatchedCompanyIds(decoded.companyName);
    } else {
      // SuperAdmin → null = ไม่ filter ดูได้ทุกบริษัท
      decoded.matchedCompanyIds = null;
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authMiddleware };
// controllers/Analytics/analyticsController.js
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

// ========================================================
// Helper: สร้าง company filter จาก matchedCompanyIds
// ถ้า matchedCompanyIds = null → SuperAdmin → ไม่ filter
// ถ้า matchedCompanyIds = [] → Admin ไม่มีบริษัท → ไม่แสดงข้อมูล
// ถ้า matchedCompanyIds = [1,2,3] → Admin → filter เฉพาะบริษัทนั้น
// ========================================================
const getCompanyScope = (req) => {
  const ids = req.user?.matchedCompanyIds;
  // SuperAdmin (null) → ไม่ filter
  if (ids === null || ids === undefined) return null;
  // Admin ที่มีบริษัท
  return ids;
};

// ========================================================
// Helper: หา "primary company id" สำหรับดึงโครงสร้าง category/question
// (category/question ผูกกับบริษัทเดียวต่อกลุ่ม ไม่ใช่ per-user data)
// scope === null (SuperAdmin) → ใช้บริษัท id น้อยสุดในระบบทั้งหมด
// scope === []   (Admin ไม่มีบริษัท) → ไม่มี primary id
// scope === [..] (Admin) → ใช้ id น้อยสุดใน scope
// ========================================================
const getPrimaryCompanyId = async (scope) => {
  if (scope === null) {
    const firstCompany = await prisma.company.findFirst({ orderBy: { id: 'asc' } });
    return firstCompany?.id ?? null;
  }
  if (scope.length === 0) return null;
  return Math.min(...scope);
};

// ========================================================
// ✅ Helper (ใหม่): resolveSiblingIds
// แก้ปัญหา position/department/work_group มี record ชื่อเดียวกัน
// แต่คนละ companyId (คนละ id) — ตอน filter ด้วย id เดียว
// จะตกหล่น user ของบริษัทอื่นที่มีชื่อตรงกันแต่ id ต่างกัน
//
// วิธีแก้: รับ id ที่ frontend ส่งมา (เป็น id จาก dropdown ที่ dedupe ตามชื่อ)
// -> หา "ชื่อ" ของ record นั้น
// -> หา "ทุก id ที่ชื่อตรงกัน" ทั้งระบบ (ข้ามบริษัทได้)
// -> ใช้ array นี้ filter ด้วย `{ in: [...] }` แทน id เดียว
// ========================================================
const resolveSiblingIds = async (modelName, id) => {
  if (!id) return [];
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return [];

  const record = await prisma[modelName].findUnique({ where: { id: parsedId } });
  if (!record) return [parsedId]; // ไม่เจอ record ก็ fallback ไปใช้ id เดิม (จะได้ 0 ผลลัพธ์ ไม่ error)

  const siblings = await prisma[modelName].findMany({
    where: { name: record.name },
    select: { id: true },
  });

  return siblings.map(s => s.id);
};

// ========================================================
// getAggregatedSurveyData
// ========================================================
const getAggregatedSurveyData = async (req, res) => {
  try {
    const { companyId } = req.query;
    const scope = getCompanyScope(req);

    let companyFilter = scope !== null
      ? { user: { company_id: { in: scope } } }
      : undefined;

    if (companyId) {
      const company = await prisma.company.findFirst({ where: { name: companyId } });
      if (company) {
        if (scope === null || scope.includes(company.id)) {
          companyFilter = { user: { company_id: company.id } };
        }
      }
    }

    const aggregatedData = await prisma.survey_answer.groupBy({
      by: ['questionId'],
      where: companyFilter,
      _avg: { currentScore: true, expectedScore: true },
      _count: { id: true },
      _min: { createdAt: true },
      _max: { createdAt: true }
    });

    const questionIds = aggregatedData.map(item => item.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: {
        id: true,
        text: true,
        category: { select: { name: true } }
      }
    });

    const result = aggregatedData.map(item => {
      const question = questions.find(q => q.id === item.questionId);
      return {
        questionId: item.questionId,
        questionText: question ? question.text : '',
        categoryName: question?.category?.name || '',
        avgCurrentScore: item._avg.currentScore,
        avgExpectedScore: item._avg.expectedScore,
        responseCount: item._count.id,
        firstResponse: item._min.createdAt,
        lastResponse: item._max.createdAt
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสำรวจที่รวมไว้:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

// ========================================================
// getDemographicAnalysis
// ========================================================
const getDemographicAnalysis = async (req, res) => {
  try {
    const { companyId } = req.query;
    const scope = getCompanyScope(req);

    let userFilter = scope !== null ? { company_id: { in: scope } } : {};

    if (companyId) {
      const company = await prisma.company.findFirst({ where: { name: companyId } });
      if (company && (scope === null || scope.includes(company.id))) {
        userFilter = { company_id: company.id };
      }
    }

    const users = await prisma.user.findMany({
      where: userFilter,
      include: {
        position: true,
        department: true,
        work_group: true,
        survey_answers: {
          select: { currentScore: true, expectedScore: true }
        }
      }
    });

    const grouped = {};
    for (const user of users) {
      const key = user.position?.name || 'ไม่ระบุ';
      if (!grouped[key]) grouped[key] = { count: 0, totalCurrent: 0, totalExpected: 0 };
      grouped[key].count++;
      for (const ans of user.survey_answers) {
        grouped[key].totalCurrent += ans.currentScore;
        grouped[key].totalExpected += ans.expectedScore;
      }
    }

    const result = Object.entries(grouped).map(([name, data]) => ({
      group: name,
      count: data.count,
      avgCurrentScore: data.count > 0 ? data.totalCurrent / data.count : 0,
      avgExpectedScore: data.count > 0 ? data.totalExpected / data.count : 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการวิเคราะห์ข้อมูลประชากร:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

// ========================================================
// getTrendAnalysis — ใช้ $queryRaw
// ========================================================
const getTrendAnalysis = async (req, res) => {
  try {
    const { companyId, months } = req.query;
    const monthsNum = parseInt(months) || 12;
    const scope = getCompanyScope(req);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsNum);

    if (scope !== null && scope.length === 0) {
      return res.status(200).json([]);
    }

    let trendData;

    if (scope === null) {
      if (companyId) {
        const company = await prisma.company.findFirst({ where: { name: companyId } });
        if (company) {
          trendData = await prisma.$queryRaw(Prisma.sql`
            SELECT 
              DATE_FORMAT(sa.createdAt, '%Y-%m') as month,
              AVG(sa.currentScore) as avgCurrentScore,
              AVG(sa.expectedScore) as avgExpectedScore,
              COUNT(*) as responseCount
            FROM survey_answer sa
            JOIN user u ON sa.userId = u.id
            WHERE u.company_id = ${company.id}
              AND sa.createdAt >= ${startDate}
              AND sa.createdAt <= ${endDate}
            GROUP BY DATE_FORMAT(sa.createdAt, '%Y-%m')
            ORDER BY month
          `);
        } else {
          trendData = [];
        }
      } else {
        trendData = await prisma.$queryRaw(Prisma.sql`
          SELECT 
            DATE_FORMAT(sa.createdAt, '%Y-%m') as month,
            AVG(sa.currentScore) as avgCurrentScore,
            AVG(sa.expectedScore) as avgExpectedScore,
            COUNT(*) as responseCount
          FROM survey_answer sa
          JOIN user u ON sa.userId = u.id
          WHERE sa.createdAt >= ${startDate}
            AND sa.createdAt <= ${endDate}
          GROUP BY DATE_FORMAT(sa.createdAt, '%Y-%m')
          ORDER BY month
        `);
      }
    } else {
      let effectiveIds = scope;

      if (companyId) {
        const company = await prisma.company.findFirst({ where: { name: companyId } });
        if (company && scope.includes(company.id)) {
          effectiveIds = [company.id];
        }
      }

      trendData = await prisma.$queryRaw(Prisma.sql`
        SELECT 
          DATE_FORMAT(sa.createdAt, '%Y-%m') as month,
          AVG(sa.currentScore) as avgCurrentScore,
          AVG(sa.expectedScore) as avgExpectedScore,
          COUNT(*) as responseCount
        FROM survey_answer sa
        JOIN user u ON sa.userId = u.id
        WHERE u.company_id IN (${Prisma.join(effectiveIds)})
          AND sa.createdAt >= ${startDate}
          AND sa.createdAt <= ${endDate}
        GROUP BY DATE_FORMAT(sa.createdAt, '%Y-%m')
        ORDER BY month
      `);
    }

    res.status(200).json(trendData);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการวิเคราะห์แนวโน้ม:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

// ========================================================
// getUserCompletionStatus
// ========================================================
const getUserCompletionStatus = async (req, res) => {
  try {
    const scope = getCompanyScope(req);

    const userWhere = scope !== null ? { company_id: { in: scope } } : {};

    const allUsers = await prisma.user.findMany({
      where: userWhere,
      select: {
        id: true,
        email_user: true,
        company_id: true,
        company: { select: { name: true } },
        survey_status: true,
        registration_status: true
      }
    });

    const userCompletionData = allUsers.map(user => ({
      id: user.email_user,
      name: user.email_user.split('@')[0],
      area: user.company?.name || '-',
      status: user.registration_status === 'pending' ? 'not_registered' :
              user.survey_status === 'done' ? 'done' :
              user.survey_status === 'in_progress' ? 'in_progress' :
              'not_started'
    }));

    res.status(200).json(userCompletionData);
  } catch (error) {
    console.error('Get user completion status error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ========================================================
// getSurveyDataForChart
// ========================================================
const getSurveyDataForChart = async (req, res) => {
  try {
    const { questionId, companyId = 'combined', year = new Date().getFullYear() } = req.query;
    const scope = getCompanyScope(req);

    if (!questionId) {
      return res.status(400).json({ error: 'questionId เป็นข้อมูลบังคับ' });
    }

    const question = await prisma.question.findUnique({
      where: { id: parseInt(questionId) },
      include: { category: { select: { id: true, name: true } } }
    });

    if (!question) return res.status(404).json({ error: 'ไม่พบคำถามนี้' });

    const where = {
      questionId: parseInt(questionId),
      createdAt: {
        gte: new Date(year, 0, 1),
        lte: new Date(year, 11, 31, 23, 59, 59)
      }
    };

    if (scope !== null) {
      where.user = { company_id: { in: scope } };
    }

    if (companyId !== 'combined') {
      const company = await prisma.company.findFirst({ where: { name: companyId } });
      if (company && (scope === null || scope.includes(company.id))) {
        where.user = { company_id: company.id };
      }
    }

    const surveyAnswers = await prisma.survey_answer.findMany({
      where,
      select: {
        currentScore: true,
        expectedScore: true,
        user: {
          select: {
            company_id: true,
            company: { select: { name: true } }
          }
        }
      }
    });

    const current = [0, 0, 0, 0, 0];
    const future = [0, 0, 0, 0, 0];
    surveyAnswers.forEach(answer => {
      if (answer.currentScore >= 1 && answer.currentScore <= 5) current[answer.currentScore - 1]++;
      if (answer.expectedScore >= 1 && answer.expectedScore <= 5) future[answer.expectedScore - 1]++;
    });

    let companies = [];
    const companyQuery = scope !== null
      ? { where: { id: { in: scope } }, select: { id: true, name: true }, orderBy: { name: 'asc' } }
      : { select: { id: true, name: true }, orderBy: { name: 'asc' } };

    if (companyId === 'combined') {
      const allCompanies = await prisma.company.findMany(companyQuery);
      companies = allCompanies.map(c => ({ id: c.name, name: c.name }));
    } else {
      companies = [{ id: companyId, name: companyId }];
    }

    res.status(200).json({
      questionId: parseInt(questionId),
      questionNumber: question.order || 0,
      questionText: question.text,
      category: question.category,
      companyId,
      companies,
      current,
      future,
      totalResponses: surveyAnswers.length,
      year
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลกราฟ:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

// ========================================================
// getCompanies — แสดงเฉพาะบริษัทที่อยู่ใน scope
// ========================================================
const getCompanies = async (req, res) => {
  try {
    const scope = getCompanyScope(req);

    const where = scope !== null ? { id: { in: scope } } : {};

    const companies = await prisma.company.findMany({
      where,
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });

    res.status(200).json(companies.map(c => ({ id: c.name, name: c.name })));
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงรายชื่อบริษัท:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

// ========================================================
// getStackedChartData
// ✅ FIX: category/question เป็นโครงสร้างที่ผูกกับ "บริษัทเจ้าของชุดคำถาม"
// (ดูตัวอย่างจาก getCategories/getQuestions ใน categoryController.js / questionController.js)
// เดิมโค้ดนี้ดึง prisma.category.findMany() แบบไม่มี where เลย
// จึงดึงหมวดหมู่ของทุกบริษัทในระบบมาปนกัน ทั้งที่แต่ละกลุ่มบริษัทควรเห็น
// เฉพาะชุดคำถาม/หมวดหมู่ของ "บริษัทหลัก" (primary company) ของตัวเองเท่านั้น
// ========================================================
const getStackedChartData = async (req, res) => {
  try {
    const { areaId = 'combined', timeframe = 'comparison', year = new Date().getFullYear() } = req.query;
    const scope = getCompanyScope(req);

    // ✅ หา primary company id เพื่อกรองโครงสร้าง category/question ให้ตรงกลุ่มบริษัท
    const primaryCompanyId = await getPrimaryCompanyId(scope);
    if (!primaryCompanyId) {
      return res.status(200).json({
        labels: [], current: [[], [], [], [], []], future: [[], [], [], [], []],
        areas: [], categories: [], areaId, timeframe, year, totalResponses: 0
      });
    }

    const categories = await prisma.category.findMany({
      where: { companyId: primaryCompanyId }, // ✅ กรองตามบริษัทแล้ว
      include: { questions: { orderBy: { order: 'asc' } } },
      orderBy: { id: 'asc' }
    });

    if (categories.length === 0) return res.status(404).json({ error: 'ไม่พบหมวดหมู่' });

    const questionIds = categories.flatMap(cat => cat.questions.map(q => q.id));
    if (questionIds.length === 0) return res.status(404).json({ error: 'ไม่พบคำถาม' });

    const where = {
      questionId: { in: questionIds },
      createdAt: {
        gte: new Date(year, 0, 1),
        lte: new Date(year, 11, 31, 23, 59, 59)
      }
    };

    if (scope !== null) {
      where.user = { company_id: { in: scope } };
    }

    if (areaId !== 'combined') {
      const company = await prisma.company.findFirst({ where: { name: areaId } });
      if (company && (scope === null || scope.includes(company.id))) {
        where.user = { company_id: company.id };
      }
    }

    const surveyAnswers = await prisma.survey_answer.findMany({
      where,
      select: { questionId: true, currentScore: true, expectedScore: true }
    });

    const dataByQuestion = {};
    categories.forEach(cat => {
      cat.questions.forEach(q => {
        dataByQuestion[q.id] = { current: [0, 0, 0, 0, 0], future: [0, 0, 0, 0, 0] };
      });
    });

    surveyAnswers.forEach(answer => {
      if (dataByQuestion[answer.questionId]) {
        if (answer.currentScore >= 1 && answer.currentScore <= 5)
          dataByQuestion[answer.questionId].current[answer.currentScore - 1]++;
        if (answer.expectedScore >= 1 && answer.expectedScore <= 5)
          dataByQuestion[answer.questionId].future[answer.expectedScore - 1]++;
      }
    });

    const current = [[], [], [], [], []];
    const future = [[], [], [], [], []];
    const labels = [];

    categories.forEach(cat => {
      cat.questions.forEach(q => {
        labels.push(`Q${q.order || q.id}: ${cat.name}`);
        const qData = dataByQuestion[q.id];
        for (let level = 0; level < 5; level++) {
          current[level].push(qData.current[level]);
          future[level].push(qData.future[level]);
        }
      });
    });

    const companyQuery = scope !== null
      ? { where: { id: { in: scope } }, select: { id: true, name: true }, orderBy: { name: 'asc' } }
      : { select: { id: true, name: true }, orderBy: { name: 'asc' } };

    let areas = [];
    if (areaId === 'combined') {
      const allAreas = await prisma.company.findMany(companyQuery);
      areas = allAreas.map(a => ({ id: a.name, name: a.name }));
    } else {
      areas = [{ id: areaId, name: areaId }];
    }

    res.status(200).json({
      labels,
      current,
      future,
      areas,
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        questionCount: cat.questions.length
      })),
      areaId,
      timeframe,
      year,
      totalResponses: surveyAnswers.length
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Stacked Chart:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

// ========================================================
// getAssessmentYears
// ========================================================
const getAssessmentYears = async (req, res) => {
  try {
    const scope = getCompanyScope(req);

    const where = scope !== null
      ? { user: { company_id: { in: scope } } }
      : {};

    const years = await prisma.survey_answer.findMany({
      where,
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    const distinctYears = [...new Set(years.map(y => new Date(y.createdAt).getFullYear()))];
    res.status(200).json(distinctYears);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงปีประเมิน:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

// ========================================================
// getQuestionResultsData
// ✅ FIX #1 (เดิม): questionWhere กรองด้วย companyId ของชุดคำถาม (primaryCompanyId)
// ✅ FIX #2 (ใหม่): positionRecord เดิมใช้ findFirst (เลือกมาแค่ 1 record)
// แล้ว filter ด้วย id เดียว — ถ้ามีตำแหน่งชื่อเดียวกันหลาย record
// (คนละบริษัท) จะตกหล่น user ของบริษัทอื่นที่ไม่ตรง id นั้นไปเลย
// แก้โดยหา "ทุก id ที่ชื่อตรงกัน" แล้ว filter ด้วย `in`
// ========================================================
const getQuestionResultsData = async (req, res) => {
  try {
    const { company = 'All', position = 'All', year, categoryId } = req.query;
    const scope = getCompanyScope(req);

    if (!year) return res.status(400).json({ error: 'Year is a required parameter.' });

    const where = {
      createdAt: {
        gte: new Date(parseInt(year), 0, 1),
        lt: new Date(parseInt(year) + 1, 0, 1),
      },
    };

    const userWhere = {};

    if (scope !== null) {
      userWhere.company_id = { in: scope };
    }

    if (company && company !== 'All') {
      const companyRecord = await prisma.company.findFirst({ where: { name: company } });
      if (companyRecord && (scope === null || scope.includes(companyRecord.id))) {
        userWhere.company_id = companyRecord.id;
      }
    }

    // ✅ FIX: ใช้ findMany + in แทน findFirst + id เดียว
    // — รองรับกรณีมีตำแหน่งชื่อเดียวกันหลาย record (คนละบริษัท)
    if (position && position !== 'All') {
      const positionRecords = await prisma.position.findMany({ where: { name: position } });
      if (positionRecords.length > 0) {
        userWhere.position_id = { in: positionRecords.map(p => p.id) };
      }
    }

    if (Object.keys(userWhere).length > 0) where.user = userWhere;

    // ✅ หา primary company id เพื่อกรองชุดคำถามให้ตรงกลุ่มบริษัทเสมอ
    // (ไม่ว่าจะเลือก categoryId เฉพาะ หรือ 'All' ก็ต้องอยู่ในขอบเขตบริษัทเดียวกัน)
    const primaryCompanyId = await getPrimaryCompanyId(scope);
    if (!primaryCompanyId) {
      return res.status(200).json({ current: [], future: [] });
    }

    const questionWhere = { category: { companyId: primaryCompanyId } };
    if (categoryId && categoryId !== 'All') questionWhere.categoryId = parseInt(categoryId);

    const allQuestions = await prisma.question.findMany({
      where: questionWhere,
      orderBy: { order: 'asc' },
      select: { id: true }
    });
    const questionIds = allQuestions.map(q => q.id);

    const surveyAnswers = await prisma.survey_answer.findMany({
      where: { ...where, questionId: { in: questionIds } },
      select: { questionId: true, currentScore: true, expectedScore: true }
    });

    const dataByQuestion = new Map(questionIds.map(id => [
      id,
      {
        current: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        future: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    ]));

    for (const answer of surveyAnswers) {
      const qData = dataByQuestion.get(answer.questionId);
      if (qData) {
        if (answer.currentScore) qData.current[answer.currentScore]++;
        if (answer.expectedScore) qData.future[answer.expectedScore]++;
      }
    }

    const currentScoreCounts = [];
    const futureScoreCounts = [];
    for (const id of questionIds) {
      const data = dataByQuestion.get(id);
      currentScoreCounts.push(data.current);
      futureScoreCounts.push(data.future);
    }

    res.status(200).json({ current: currentScoreCounts, future: futureScoreCounts });
  } catch (error) {
    console.error('Error fetching question results data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// ========================================================
// getWorkGroupRawData
// ========================================================
const getWorkGroupRawData = async (req, res) => {
  try {
    const { year, company } = req.query;
    const scope = getCompanyScope(req);

    const where = {};
    if (year && year !== 'null' && year !== 'undefined') {
      where.createdAt = {
        gte: new Date(parseInt(year), 0, 1),
        lt: new Date(parseInt(year) + 1, 0, 1),
      };
    }

    const companyWhere = scope !== null ? { id: { in: scope } } : {};
    const companies = await prisma.company.findMany({
      where: companyWhere,
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });

    if (scope !== null) {
      where.user = { company_id: { in: scope } };
    }

    if (company && company !== 'both' && company !== 'all') {
      let companyName = '';
      if (company === 'company_1' && companies[0]) companyName = companies[0].name;
      if (company === 'company_2' && companies[1]) companyName = companies[1].name;
      if (company === 'company_3' && companies[2]) companyName = companies[2].name;
      if (companyName) {
        const companyRecord = await prisma.company.findFirst({ where: { name: companyName } });
        if (companyRecord && (scope === null || scope.includes(companyRecord.id))) {
          where.user = { company_id: companyRecord.id };
        }
      }
    }

    const answers = await prisma.survey_answer.findMany({
      where,
      select: {
        currentScore: true,
        expectedScore: true,
        user: {
          include: {
            company: true,
            position: true,
            department: true,
            work_group: true,
          }
        }
      }
    });

    const companyMap = {};
    companies.forEach((c, i) => {
      if (c.name) companyMap[c.name] = `company_${i + 1}`;
    });

    const formattedData = answers.map(a => ({
      currentScore: a.currentScore,
      expectedScore: a.expectedScore,
      position: a.user?.position?.name,
      jobField: a.user?.department?.name,
      workGroup: a.user?.work_group?.name,
      version: a.user?.company ? companyMap[a.user.company.name] : null
    })).filter(d => d.position && d.jobField && d.workGroup && d.version);

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching workgroup raw data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// ========================================================
// getWorkGroupEvaluationData
// ✅ FIX: positionId / departmentId / workGroupId ที่ frontend ส่งมา
// อาจเป็น id ของบริษัทใดบริษัทหนึ่งเท่านั้น (เพราะ dropdown dedupe ตามชื่อ)
// ต้อง resolve เป็น "ทุก id ที่ชื่อตรงกัน" ก่อน filter ด้วย `in`
// ไม่ใช่ filter ด้วย id เดียวตรงๆเหมือนเดิม — ไม่งั้น user ของบริษัทอื่น
// ที่มีตำแหน่ง/สายงานชื่อเดียวกันแต่ id ต่างกันจะตกหล่นไปจากรายงาน
// ========================================================
const getWorkGroupEvaluationData = async (req, res) => {
  try {
    const { year, positionId, departmentId, workGroupId, company } = req.query;
    const scope = getCompanyScope(req);

    const userWhere = {};

    if (scope !== null) {
      userWhere.company_id = { in: scope };
    }

    // ✅ FIX: resolve ชื่อข้ามบริษัทก่อน filter
    if (positionId && positionId !== 'all') {
      const ids = await resolveSiblingIds('position', positionId);
      if (ids.length > 0) userWhere.position_id = { in: ids };
    }

    if (departmentId && departmentId !== 'all') {
      const ids = await resolveSiblingIds('department', departmentId);
      if (ids.length > 0) userWhere.department_id = { in: ids };
    }

    if (workGroupId && workGroupId !== 'all' && workGroupId.length > 0) {
      const rawIds = workGroupId.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (rawIds.length > 0) {
        const resolvedSets = await Promise.all(
          rawIds.map(rid => resolveSiblingIds('work_group', rid))
        );
        const allIds = [...new Set(resolvedSets.flat())];
        if (allIds.length > 0) userWhere.work_group_id = { in: allIds };
      }
    }

    const companyWhere = scope !== null ? { id: { in: scope } } : {};
    const companies = await prisma.company.findMany({
      where: companyWhere,
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });

    if (company && company !== 'both' && company !== 'all') {
      let companyName = '';
      if (company === 'company_1' && companies[0]) companyName = companies[0].name;
      if (company === 'company_2' && companies[1]) companyName = companies[1].name;
      if (company === 'company_3' && companies[2]) companyName = companies[2].name;
      if (companyName) {
        const companyRecord = await prisma.company.findFirst({ where: { name: companyName } });
        if (companyRecord && (scope === null || scope.includes(companyRecord.id))) {
          userWhere.company_id = companyRecord.id;
        }
      }
    }

    const surveyAnswerWhere = { user: userWhere };
    if (year && year !== 'null' && year !== 'undefined') {
      surveyAnswerWhere.createdAt = {
        gte: new Date(parseInt(year), 0, 1),
        lt: new Date(parseInt(year) + 1, 0, 1),
      };
    }

    const answers = await prisma.survey_answer.findMany({
      where: surveyAnswerWhere,
      select: {
        currentScore: true,
        expectedScore: true,
        user: {
          include: {
            company: true,
            position: true,
            department: true,
            work_group: true,
          }
        }
      }
    });

    const formattedAnswers = answers.map(a => ({
      currentScore: a.currentScore,
      expectedScore: a.expectedScore,
      user: {
        position_user: a.user?.position?.name,
        job_field_user: a.user?.department?.name,
        work_group_user: a.user?.work_group?.name,
        company_user: a.user?.company?.name,
      }
    }));

    res.status(200).json(formattedAnswers);
  } catch (error) {
    console.error('Error fetching workgroup evaluation data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// ========================================================
// getEvaluationData
// ✅ FIX: categories ใช้สร้าง categoryOrder (แกน X ของ SalesBarChartDB.vue)
// เดิมดึง prisma.category.findMany() แบบไม่กรองบริษัท เลยมีคอลัมน์ของบริษัทอื่น
// ปนเข้ามาด้วย (เป็น 0 เพราะไม่มีคำตอบ แต่ก็ยังถูกนับเป็นแกนนึงอยู่ดี)
// ========================================================
const getEvaluationData = (scoreType) => async (req, res) => {
  try {
    const { year } = req.query;
    const scope = getCompanyScope(req);
    const scoreField = scoreType === 'current' ? 'currentScore' : 'expectedScore';

    const companyWhere = scope !== null ? { id: { in: scope } } : {};
    const companies = await prisma.company.findMany({
      where: companyWhere,
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    const companyMap = {};
    companies.forEach((c, i) => {
      if (c.name) companyMap[c.name] = `company_${i + 1}`;
    });

    // ✅ กรอง category เฉพาะของ primary company (ชุดคำถามของกลุ่มบริษัทตัวเอง)
    const primaryCompanyId = await getPrimaryCompanyId(scope);
    const categories = primaryCompanyId
      ? await prisma.category.findMany({
          where: { companyId: primaryCompanyId },
          orderBy: { id: 'asc' }
        })
      : [];
    const categoryOrder = categories.map(c => c.id);

    const where = {};

    if (scope !== null) {
      where.user = { company_id: { in: scope } };
    }

    if (year && year !== 'null' && year !== 'undefined') {
      where.createdAt = {
        gte: new Date(parseInt(year), 0, 1),
        lt: new Date(parseInt(year) + 1, 0, 1),
      };
    }

    const answers = await prisma.survey_answer.findMany({
      where,
      select: {
        [scoreField]: true,
        user: {
          include: { company: true, position: true }
        },
        question: {
          select: { categoryId: true }
        },
      },
    });

    const intermediate = {};

    for (const answer of answers) {
      const position = answer.user?.position?.name;
      const company = answer.user?.company?.name;
      const categoryId = answer.question?.categoryId;
      const score = answer[scoreField];

      if (!position || !company || !categoryId || score === null) continue;
      // ✅ ข้ามคำตอบของคำถามที่ไม่ได้อยู่ใน category ของ primary company
      if (!categoryOrder.includes(categoryId)) continue;

      if (!intermediate[position]) intermediate[position] = {};
      if (!intermediate[position][company]) intermediate[position][company] = {};
      if (!intermediate[position][company][categoryId]) {
        intermediate[position][company][categoryId] = { total: 0, count: 0 };
      }

      intermediate[position][company][categoryId].total += score;
      intermediate[position][company][categoryId].count += 1;
    }

    const results = {};
    for (const position in intermediate) {
      results[position] = {};
      for (const company in intermediate[position]) {
        const version = companyMap[company];
        if (!version) continue;

        const categoryAverages = categoryOrder.map(catId => {
          const stats = intermediate[position][company][catId];
          if (!stats || stats.count === 0) return 0;
          return stats.total / stats.count;
        });

        const nonZero = categoryAverages.filter(v => v > 0);
        const overallAvg = nonZero.length > 0
          ? nonZero.reduce((a, b) => a + b, 0) / nonZero.length
          : 0;

        categoryAverages.push(overallAvg);
        results[position][version] = categoryAverages;
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error(`Error fetching ${scoreType} evaluation data:`, error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// ========================================================
// getRawAnswers
// ========================================================
const getRawAnswers = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const scope = getCompanyScope(req);

    const userWhere = scope !== null ? { company_id: { in: scope } } : {};

    const users = await prisma.user.findMany({
      where: userWhere,
      include: {
        survey_answers: {
          include: { question: true }
        }
      }
    });

    const result = users.map(user => {
      const answersInYear = user.survey_answers.filter(answer => {
        const answerYear = new Date(answer.createdAt).getFullYear();
        return answerYear === targetYear;
      });

      return {
        userEmail: user.email_user,
        email: user.email_user,
        name: user.name_user || '-',
        answers: answersInYear.map(answer => ({
          questionId: answer.questionId,
          currentScore: answer.currentScore,
          futureScore: answer.expectedScore,
          comment: answer.comment
        }))
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching raw answers:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// ========================================================
// getOpinionsData
// ========================================================
const getOpinionsData = async (req, res) => {
  try {
    const { companyId } = req.query;
    const scope = getCompanyScope(req);

    // --------------------------------------------------------
    // สร้าง user filter สำหรับ survey_answers
    // รวม scope (Admin/SuperAdmin) + companyId (ถ้ามี)
    // --------------------------------------------------------
    let userCompanyFilter = {};

    if (scope !== null) {
      userCompanyFilter = { company_id: { in: scope } };
    }

    if (companyId && companyId !== 'All') {
      const company = await prisma.company.findFirst({ where: { name: companyId } });
      if (company && (scope === null || scope.includes(company.id))) {
        userCompanyFilter = { company_id: company.id };
      }
    }

    const surveyAnswerWhere = {
      comment: { not: null },
      ...(Object.keys(userCompanyFilter).length > 0 && {
        user: userCompanyFilter
      })
    };

    // --------------------------------------------------------
    // สร้าง question filter ตาม companyId (กรองผ่าน category)
    // --------------------------------------------------------
    let questionWhere = {};

    if (companyId && companyId !== 'All') {
      const company = await prisma.company.findFirst({ where: { name: companyId } });
      if (company && (scope === null || scope.includes(company.id))) {
        questionWhere = { category: { companyId: company.id } };
      }
    } else if (scope !== null && scope.length > 0) {
      // Admin ที่ไม่ได้เลือก companyId เฉพาะ → แสดงคำถามของบริษัทแรกใน scope
      // (สอดคล้องกับ getQuestionsWithCategory)
      const primaryCompanyId = Math.min(...scope);
      questionWhere = { category: { companyId: primaryCompanyId } };
    }

    const questions = await prisma.question.findMany({
      where: questionWhere,
      orderBy: { order: 'asc' },
      select: {
        id: true,
        text: true,
        order: true,
        survey_answers: {
          where: surveyAnswerWhere,
          select: {
            comment: true,
            user: {
              select: { name_user: true }
            }
          }
        }
      }
    });

    const result = questions.map(q => ({
      id: q.order ?? q.id,
      text: q.text,
      survey_answers: q.survey_answers.map(sa => ({
        comment: sa.comment,
        user: sa.user ? { name_user: sa.user.name_user } : null
      }))
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลความคิดเห็น:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

// ========================================================
// ✅ getQuestionsWithCategory (ใหม่)
// ดึง questions พร้อม categoryId โดยใช้ auth scope แทน companyIds query param
// SuperAdmin → ใช้บริษัท id น้อยสุดในระบบ
// Admin → ใช้ id น้อยสุดใน scope ของตัวเอง
// ========================================================
const getQuestionsWithCategory = async (req, res) => {
  try {
    const scope = getCompanyScope(req);

    const primaryCompanyId = await getPrimaryCompanyId(scope);

    if (scope !== null && scope.length === 0) {
      return res.status(200).json([]);
    }

    if (!primaryCompanyId) {
      return res.status(404).json({ error: 'ไม่พบบริษัทในระบบ' });
    }

    const questions = await prisma.question.findMany({
      where: { category: { companyId: primaryCompanyId } },
      select: {
        id: true,
        text: true,
        order: true,
        categoryId: true,
      },
      orderBy: { order: 'asc' },
    });

    res.status(200).json(questions);
  } catch (error) {
    console.error('getQuestionsWithCategory error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

module.exports = {
  getAggregatedSurveyData,
  getDemographicAnalysis,
  getTrendAnalysis,
  getUserCompletionStatus,
  getSurveyDataForChart,
  getCompanies,
  getStackedChartData,
  getAssessmentYears,
  getQuestionResultsData,
  getWorkGroupRawData,
  getWorkGroupEvaluationData,
  getEvaluationData,
  getRawAnswers,
  getOpinionsData,
  getQuestionsWithCategory,
};
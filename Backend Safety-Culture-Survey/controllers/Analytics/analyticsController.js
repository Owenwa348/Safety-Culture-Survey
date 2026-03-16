// controllers/Analytics/analyticsController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ดึงข้อมูลที่รวมไว้สำหรับกราฟ
const getAggregatedSurveyData = async (req, res) => {
  try {
    const { companyId } = req.query;

    // หา company_id จาก company name (ถ้ามี)
    let companyFilter = undefined;
    if (companyId) {
      const company = await prisma.company.findFirst({ where: { name: companyId } });
      if (company) {
        companyFilter = { user: { company_id: company.id } };
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

// ดึงข้อมูลตามกลุ่มประชากร
const getDemographicAnalysis = async (req, res) => {
  try {
    const { companyId } = req.query;

    // หา company_id จาก company name (ถ้ามี)
    let companyFilter = undefined;
    if (companyId) {
      const company = await prisma.company.findFirst({ where: { name: companyId } });
      if (company) {
        companyFilter = { company_id: company.id };
      }
    }

    // ดึง user + survey_answers พร้อม position/department/work_group relations
    const users = await prisma.user.findMany({
      where: companyFilter,
      include: {
        position: true,
        department: true,
        work_group: true,
        survey_answers: {
          select: { currentScore: true, expectedScore: true }
        }
      }
    });

    // จัดกลุ่มตาม position
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

// ดึงข้อมูลแนวโน้มตามเวลา
const getTrendAnalysis = async (req, res) => {
  try {
    const { companyId, months } = req.query;
    const monthsNum = parseInt(months) || 12;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsNum);

    // หา company_id จาก company name (ถ้ามี)
    let companyCondition = prisma.$queryRaw``;
    if (companyId) {
      const company = await prisma.company.findFirst({ where: { name: companyId } });
      if (company) {
        companyCondition = prisma.$queryRaw`u.company_id = ${company.id} AND`;
      }
    }

    const trendData = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(sa.createdAt, '%Y-%m') as month,
        AVG(sa.currentScore) as avgCurrentScore,
        AVG(sa.expectedScore) as avgExpectedScore,
        COUNT(*) as responseCount
      FROM survey_answer sa
      JOIN user u ON sa.userId = u.id
      WHERE ${companyCondition}
        sa.createdAt >= ${startDate}
        AND sa.createdAt <= ${endDate}
      GROUP BY DATE_FORMAT(sa.createdAt, '%Y-%m')
      ORDER BY month
    `;

    res.status(200).json(trendData);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการวิเคราะห์แนวโน้ม:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

// ดึงสถานะการทำแบบประเมินของผู้ใช้
const getUserCompletionStatus = async (req, res) => {
  try {
    const potentialUsers = await prisma.user_excel.findMany({
      select: {
        email_user: true,
        company_id: true,
        company: { select: { name: true } }
      }
    });

    const registeredUsers = await prisma.user.findMany({
      select: { email_user: true, survey_status: true }  // ✅ ใช้ survey_status (snake_case)
    });

    const registeredUserMap = new Map(
      registeredUsers.map(u => [u.email_user, u.survey_status])
    );

    const usersWithStatus = potentialUsers.map(potentialUser => {
      const survey_status = registeredUserMap.get(potentialUser.email_user);
      return {
        id: potentialUser.email_user,
        name: potentialUser.email_user.split('@')[0],
        area: potentialUser.company?.name || '-',
        status: survey_status || 'not_registered',
      };
    });

    res.status(200).json(usersWithStatus);
  } catch (error) {
    console.error('Error fetching user completion status:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// ดึงข้อมูลสำหรับกราฟแนวนอน
const getSurveyDataForChart = async (req, res) => {
  try {
    const { questionId, companyId = 'combined', year = new Date().getFullYear() } = req.query;

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

    // หา company_id จาก company name (ถ้าไม่ใช่ combined)
    if (companyId !== 'combined') {
      const company = await prisma.company.findFirst({ where: { name: companyId } });
      if (company) {
        where.user = { company_id: company.id };
      }
    }

    const surveyAnswers = await prisma.survey_answer.findMany({  // ✅ survey_answer
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
    if (companyId === 'combined') {
      const allCompanies = await prisma.company.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
      });
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

// ดึงรายชื่อบริษัท
const getCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
    res.status(200).json(companies.map(c => ({ id: c.name, name: c.name })));
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงรายชื่อบริษัท:', error);
    res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง', message: error.message });
  }
};

// ดึงข้อมูล Stacked Bar Chart
const getStackedChartData = async (req, res) => {
  try {
    const { areaId = 'combined', timeframe = 'comparison', year = new Date().getFullYear() } = req.query;

    const categories = await prisma.category.findMany({
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

    // หา company_id จาก company name (ถ้าไม่ใช่ combined)
    if (areaId !== 'combined') {
      const company = await prisma.company.findFirst({ where: { name: areaId } });
      if (company) {
        where.user = { company_id: company.id };
      }
    }

    const surveyAnswers = await prisma.survey_answer.findMany({  // ✅ survey_answer
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

    let areas = [];
    if (areaId === 'combined') {
      const allAreas = await prisma.company.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
      });
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

// ดึงปีที่มีข้อมูลการประเมิน
const getAssessmentYears = async (req, res) => {
  try {
    const years = await prisma.survey_answer.findMany({  // ✅ survey_answer
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

// ดึงข้อมูลผลคำถาม
const getQuestionResultsData = async (req, res) => {
  try {
    const { company = 'All', position = 'All', year, categoryId } = req.query;

    if (!year) return res.status(400).json({ error: 'Year is a required parameter.' });

    const where = {
      createdAt: {
        gte: new Date(parseInt(year), 0, 1),
        lt: new Date(parseInt(year) + 1, 0, 1),
      },
    };

    // กรองตาม company
    const userWhere = {};
    if (company && company !== 'All') {
      const companyRecord = await prisma.company.findFirst({ where: { name: company } });
      if (companyRecord) {
        userWhere.company_id = companyRecord.id;
      }
    }

    // กรองตาม position โดยใช้ relation
    if (position && position !== 'All') {
      const positionRecord = await prisma.position.findFirst({ where: { name: position } });
      if (positionRecord) userWhere.position_id = positionRecord.id;
    }

    if (Object.keys(userWhere).length > 0) where.user = userWhere;

    const questionWhere = {};
    if (categoryId && categoryId !== 'All') questionWhere.categoryId = parseInt(categoryId);

    const allQuestions = await prisma.question.findMany({
      where: questionWhere,
      orderBy: { order: 'asc' },
      select: { id: true }
    });
    const questionIds = allQuestions.map(q => q.id);

    const surveyAnswers = await prisma.survey_answer.findMany({  // ✅ survey_answer
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

// ดึงข้อมูลดิบสำหรับ WorkGroup
const getWorkGroupRawData = async (req, res) => {
  try {
    const { year, company } = req.query;

    const where = {};
    if (year && year !== 'null' && year !== 'undefined') {
      where.createdAt = {
        gte: new Date(parseInt(year), 0, 1),
        lt: new Date(parseInt(year) + 1, 0, 1),
      };
    }

    const companies = await prisma.company.findMany({
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
        if (companyRecord) {
          where.user = { company_id: companyRecord.id };
        }
      }
    }

    const answers = await prisma.survey_answer.findMany({  // ✅ survey_answer
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
      position: a.user?.position?.name,           // ✅ ใช้ relation
      jobField: a.user?.department?.name,          // ✅ ใช้ relation
      workGroup: a.user?.work_group?.name,         // ✅ ใช้ relation
      version: a.user?.company ? companyMap[a.user.company.name] : null
    })).filter(d => d.position && d.jobField && d.workGroup && d.version);

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching workgroup raw data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// ดึงข้อมูล WorkGroup Evaluation
const getWorkGroupEvaluationData = async (req, res) => {
  try {
    const { year, positionId, departmentId, workGroupId, company } = req.query;

    const userWhere = {};

    if (positionId && positionId !== 'all') {
      userWhere.position_id = parseInt(positionId);  // ✅ ใช้ FK id โดยตรง
    }

    if (departmentId && departmentId !== 'all') {
      userWhere.department_id = parseInt(departmentId);  // ✅ ใช้ FK id โดยตรง
    }

    if (workGroupId && workGroupId !== 'all' && workGroupId.length > 0) {
      const ids = workGroupId.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (ids.length > 0) userWhere.work_group_id = { in: ids };  // ✅ ใช้ FK id โดยตรง
    }

    const companies = await prisma.company.findMany({
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
        if (companyRecord) {
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

    const answers = await prisma.survey_answer.findMany({  // ✅ survey_answer
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

    // แปลง relation เป็น string names สำหรับ frontend
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

// ดึงข้อมูล Evaluation (current/future)
const getEvaluationData = (scoreType) => async (req, res) => {
  try {
    const { year } = req.query;
    const scoreField = scoreType === 'current' ? 'currentScore' : 'expectedScore';

    const companies = await prisma.company.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    const companyMap = {};
    companies.forEach((c, i) => {
      if (c.name) companyMap[c.name] = `company_${i + 1}`;
    });

    const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });
    const categoryOrder = categories.map(c => c.id);

    const where = {};
    if (year && year !== 'null' && year !== 'undefined') {
      where.createdAt = {
        gte: new Date(parseInt(year), 0, 1),
        lt: new Date(parseInt(year) + 1, 0, 1),
      };
    }

    const answers = await prisma.survey_answer.findMany({  // ✅ survey_answer
      where,
      select: {
        [scoreField]: true,
        user: {
          include: { company: true, position: true }  // ✅ ใช้ relation
        },
        question: {
          select: { categoryId: true }
        },
      },
    });

    const intermediate = {};

    for (const answer of answers) {
      const position = answer.user?.position?.name;  // ✅ ใช้ relation
      const company = answer.user?.company?.name;
      const categoryId = answer.question?.categoryId;
      const score = answer[scoreField];

      if (!position || !company || !categoryId || score === null) continue;

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
};
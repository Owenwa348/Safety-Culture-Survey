# 📊 ไฟล์กราฟและการคำนวณของโปรเจค Safety-Culture-Survey

## 📋 สรุปไฟล์ที่มีการคำนวณและแสดงกราฟ

โปรเจคนี้ใช้ **Chart.js v4.5.0** สำหรับสร้างกราฟ และมีการคำนวณค่าต่างๆ ผ่านตัวควบคุม (Controller) ในฝั่ง Backend

---

## 1️⃣ **Backend - ไฟล์การคำนวณ (Controllers)**

### 📁 **Analytics Controller** - ไฟล์หลักสำหรับคำนวณ
**ที่อยู่:** `Backend Safety-Culture-Survey/controllers/Analytics/analyticsController.js`

ฟังก์ชันที่มีการคำนวณ:

| ฟังก์ชัน | วัตถุประสงค์ |
|---------|-----------|
| `getAggregatedSurveyData()` | รวมข้อมูลตามคำถาม คำนวณค่าเฉลี่ย (average) current/expected score |
| `getDemographicAnalysis()` | วิเคราะห์ข้อมูลตามกลุ่มประชากร (position, department, workgroup) |
| `getTrendAnalysis()` | คำนวณแนวโน้มตามเวลา (monthly averages) |
| `getSurveyDataForChart()` | นับจำนวนคำตอบแต่ละระดับ (1-5) สำหรับ Horizontal Bar Chart |
| `getStackedChartData()` | จัดเตรียมข้อมูล Stacked Bar Chart (ทั้งหมด 5 ระดับ) |
| `getQuestionResultsData()` | จัดเรียบร้อยข้อมูลการตอบแบบประเมิน |
| `getWorkGroupRawData()` | ดึงข้อมูลดิบสำหรับหน้า WorkGroup Evaluation |
| `getWorkGroupEvaluationData()` | วิเคราะห์ศักยภาพกลุ่มงาน |
| `getEvaluationData(scoreType)` | คำนวณค่าเฉลี่ยตามตำแหน่งและบริษัท |
| `getUserCompletionStatus()` | คำนวณเปอร์เซ็นต์การทำแบบประเมิน |

**ประเภทการคำนวณ:**
- ✅ Average Score (ค่าเฉลี่ย)
- ✅ Count Distribution (นับจำนวนการกระจาย 1-5)
- ✅ Time Series Analysis (วิเคราะห์ตามช่วงเวลา)
- ✅ Group By Analysis (แบ่งตามกลุ่มประชากร)

**Routes (API Endpoints):**
```
Backend Safety-Culture-Survey/routes/Analytics/analyticsRoutes.js

GET /api/analytics/aggregated
GET /api/analytics/demographics
GET /api/analytics/trends
GET /api/analytics/completion-status
GET /api/analytics/survey-data?questionId=X&companyId=Y&year=Z
GET /api/analytics/companies
GET /api/analytics/stacked-chart-data?areaId=X&year=Y
GET /api/analytics/assessment-years
GET /api/analytics/question-results
GET /api/analytics/workgroup-raw-data
GET /api/analytics/workgroup-evaluation
GET /api/analytics/evaluation/current
GET /api/analytics/evaluation/future
```

---

### 📁 **Assessment Controller**
**ที่อยู่:** `Backend Safety-Culture-Survey/controllers/Assessment/assessmentController.js`

**ฟังก์ชัน:**
- `getAssessmentData()` - ดึงหมวดหมู่ คำถาม ตัวเลือก
- `postAssessmentAnswer()` - บันทึกคำตอบพร้อม currentScore (1-5) และ expectedScore (1-5)

**Validation:** ✅ มีการตรวจสอบคะแนน 1-5

---

## 2️⃣ **Frontend - ไฟล์แสดงกราฟ (Vue Components)**

### 🎨 **Showgraph Components** - ไฟล์กราฟหลัก
**ที่อยู่:** `Frontend Safety-Culture-Survey/src/views/Dashboard/Showgraph/`

#### 1️⃣ **HorizontalBarChart.vue** (440 บรรทัด)
```
• ชนิดกราฟ: Horizontal Bar Chart
• ข้อมูล: แยกตามระดับ 1-5 ของแต่ละคำถาม
• ตัวกรอง: ปี, บริษัท, ประเภท (current/future)
• API Endpoint: /api/analytics/survey-data
• Library: chart.js
```

#### 2️⃣ **StackedBarChartDB.vue** (633 บรรทัด)
```
• ชนิดกราฟ: Stacked Bar Chart
• ข้อมูล: คำถามทั้งหมด แยกตามระดับ 1-5
• ตัวกรอง: ปี, บริษัท
• API Endpoint: /api/analytics/stacked-chart-data
• Library: chart.js
• โครงสร้าง: 5 ชั้น (Score 1-5)
```

#### 3️⃣ **SalesBarChartDB.vue**
```
• ชนิดกราฟ: Sales/Evaluation Bar Chart
• ข้อมูล: ค่าเฉลี่ยตามตำแหน่งและบริษัท
• API Endpoint: /api/analytics/evaluation/current & /future
• Library: chart.js
```

#### 4️⃣ **PieChartDB.vue** (261 บรรทัด)
```
• ชนิดกราฟ: Pie Chart
• ข้อมูล: เปอร์เซ็นต์การทำแบบประเมิน
• API Endpoint: /api/analytics/completion-status
• Library: chart.js
• สูตร: (ทำเสร็จ / ทั้งหมด) × 100
```

#### 5️⃣ **RadarChart.vue** (68 บรรทัด)
```
• ชนิดกราฟ: Radar Chart
• ข้อมูล: ข้อมูลหลายมิติตามหมวดหมู่
• Library: chart.js
• คุณสมบัติ: Radial Linear Scale, Angular Lines
```

#### 6️⃣ **StackedBar.vue**
```
• ชนิดกราฟ: Stacked Bar Chart (เวอร์ชันเก่า)
• ใช้สำหรับ: Testing / Legacy Support
```

#### 7️⃣ **BetChart.vue**
```
• ชนิดกราฟ: Bar Chart
• Library: chart.js
• ใช้สำหรับ: Multiple comparison views
```

---

## 3️⃣ **Database Schema - โครงสร้างข้อมูล**

**ที่อยู่:** `Backend Safety-Culture-Survey/prisma/schema.prisma`

### 📊 Model ที่เกี่ยวข้องกับการคำนวณ:

```prisma
model SurveyAnswer {
  id: Int
  questionId: Int          ← ใช้สำหรับ GROUP BY
  currentScore: Int (1-5)  ← ค่าคะแนนปัจจุบัน
  expectedScore: Int (1-5) ← ค่าคะแนนเป้าหมาย
  userId: Int              ← ดึง company, position, department
  createdAt: DateTime      ← ใช้สำหรับ filter ตามปี
}

model User {
  position_user: String    ← ใช้สำหรับ groupBy position
  job_field_user: String   ← ใช้สำหรับ groupBy department
  work_group_user: String  ← ใช้สำหรับ groupBy workgroup
  company_user: String     ← ใช้สำหรับ filter company
  surveyStatus: String     ← ใช้สำหรับคำนวณเปอร์เซ็นต์
}

model Question {
  categoryId: Int          ← ใช้สำหรับ GROUP BY category
  order: Int               ← เรียงลำดับคำถาม
}
```

---

## 4️⃣ **สูตรการคำนวณหลัก**

### 🔢 **Score Distribution Algorithm**
```javascript
// นับจำนวนคำตอบแต่ละระดับ (1-5)
function calculateScoreDistribution(surveyAnswers) {
  const current = [0, 0, 0, 0, 0];  // Index 0-4 = Score 1-5
  const future = [0, 0, 0, 0, 0];

  for (const answer of surveyAnswers) {
    if (answer.currentScore >= 1 && answer.currentScore <= 5) {
      current[answer.currentScore - 1]++;
    }
    if (answer.expectedScore >= 1 && answer.expectedScore <= 5) {
      future[answer.expectedScore - 1]++;
    }
  }

  return { current, future };
}
```

### 📈 **Average Score Calculation**
```javascript
// ใน analyticsController.js
const aggregatedData = await prisma.surveyAnswer.groupBy({
  by: ['questionId'],
  _avg: {
    currentScore: true,   // ค่าเฉลี่ย current
    expectedScore: true   // ค่าเฉลี่ย expected
  },
  _count: {
    id: true              // จำนวน response
  }
});
```

### 📊 **Trend Analysis (Monthly)**
```sql
SELECT 
  DATE_FORMAT(createdAt, '%Y-%m') as month,
  AVG(currentScore) as avgCurrentScore,
  AVG(expectedScore) as avgExpectedScore,
  COUNT(*) as responseCount
FROM SurveyAnswer sa
JOIN User u ON sa.userId = u.id
WHERE u.company_user = ${companyId}
  AND sa.createdAt >= ${startDate}
  AND sa.createdAt <= ${endDate}
GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
ORDER BY month
```

### 📉 **Completion Percentage**
```javascript
const usersWithStatus = potentialUsers.map(potentialUser => {
  const surveyStatus = registeredUserMap.get(potentialUser.email_user);
  return {
    status: surveyStatus || 'not_registered',
    // 'done' = ทำเสร็จ, 'in_progress' = กำลังทำ, 
    // 'not_started' = ยังไม่เริ่ม, 'not_registered' = ไม่ลงทะเบียน
  };
});
```

### 💡 **Demographic Grouping**
```javascript
const aggregatedData = await prisma.surveyAnswer.groupBy({
  by: ['user.position_user'],  // or job_field_user, work_group_user
  _avg: {
    currentScore: true,
    expectedScore: true
  },
  _count: {
    id: true
  }
});
```

---

## 5️⃣ **Data Seed/Mock Data**

**ที่อยู่:** `Backend Safety-Culture-Survey/prisma/seed.js` (1087 บรรทัด)

**ฟังก์ชันหลัก:**
- `ใส่ข้อมูลพื้นฐาน()` - Insert Position, Department, WorkGroup, Experience
- `ใส่ข้อมูลแบบประเมิน()` - Insert Category, Question, Option
- `ใส่คะแนนประเมิน()` - Insert SurveyAnswer (mock scores 1-5)
- `ใส่ข้อมูลผู้ดูแลระบบ()` - Insert SuperAdmin, Admin, Assessor

**Mock Data Setup:**
- 👥 100 พนักงาน จาก 4 บริษัท
- ✅ 90% ทำแบบประเมินเสร็จแล้ว
- 🔄 3% กำลังทำ
- ⏳ 2% ยังไม่เริ่ม
- ❌ 5% ไม่ลงทะเบียน

---

## 6️⃣ **Libraries & Tools**

```json
{
  "chart.js": "^4.5.0",           // Data visualization
  "vue-chartjs": "^4.0.0",        // Vue bindings for Chart.js
  "@prisma/client": "^6.16.3",    // Database ORM
  "exceljs": "^4.4.0",            // Excel file handling
  "mysql2": "^3.15.1",            // MySQL database
  "bcryptjs": "^3.0.2",           // Password hashing (for validation)
}
```

---

## 7️⃣ **Flow Diagram - ข้อมูลไหลจากไหนไปไหน**

```
┌─────────────────────────────────────────┐
│  User ทำแบบประเมิน                      │
│  currentScore: 1-5                     │
│  expectedScore: 1-5                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│  Backend API (analyticsController.js)   │
│  - groupBy questionId, position, etc    │
│  - COUNT, AVG, MIN, MAX calculations   │
│  - Filter by company, year             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│  JSON Response                           │
│  {                                       │
│    current: [0,5,10,3,2],              │
│    future: [0,0,8,5,7],                │
│    labels: ["Q1: Category"],           │
│    stats: {...}                        │
│  }                                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│  Frontend Components (Vue)               │
│  - HorizontalBarChart                  │
│  - StackedBarChartDB                   │
│  - PieChartDB                          │
│  - RadarChart                          │
│  - SalesBarChartDB                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│  Chart.js Rendering                      │
│  - Visualize data as charts             │
│  - Interactive tooltips                 │
└──────────────────────────────────────────┘
```

---

## 8️⃣ **สรุปไฟล์ - Quick Reference**

### 📊 **Calculation Files (สำหรับสมการ)**
1. `Backend Safety-Culture-Survey/controllers/Analytics/analyticsController.js` ⭐⭐⭐
2. `Backend Safety-Culture-Survey/controllers/Assessment/assessmentController.js`
3. `Backend Safety-Culture-Survey/prisma/schema.prisma`
4. `Backend Safety-Culture-Survey/prisma/seed.js`

### 📈 **Graph Component Files (สำหรับแสดงผล)**
1. `Frontend Safety-Culture-Survey/src/views/Dashboard/Showgraph/HorizontalBarChart.vue` ⭐⭐⭐
2. `Frontend Safety-Culture-Survey/src/views/Dashboard/Showgraph/StackedBarChartDB.vue` ⭐⭐⭐
3. `Frontend Safety-Culture-Survey/src/views/Dashboard/Showgraph/PieChartDB.vue` ⭐⭐
4. `Frontend Safety-Culture-Survey/src/views/Dashboard/Showgraph/SalesBarChartDB.vue` ⭐⭐
5. `Frontend Safety-Culture-Survey/src/views/Dashboard/Showgraph/RadarChart.vue` ⭐
6. `Frontend Safety-Culture-Survey/src/views/Dashboard/Showgraph/BetChart.vue`
7. `Frontend Safety-Culture-Survey/src/views/Dashboard/Showgraph/StackedBar.vue`

### 🔗 **Route Files**
1. `Backend Safety-Culture-Survey/routes/Analytics/analyticsRoutes.js`
2. `Backend Safety-Culture-Survey/routes/Assessment/assessmentRoutes.js`

### 📄 **Documentation**
1. `README.md` - มีรายละเอียดสูตรการคำนวณ
2. `SETUP_GUIDE.md` - สำหรับ setup analytics system

---

## 🎯 **วิธีใช้ไฟล์เหล่านี้เพื่อสร้างสมการ**

### ✅ **ขั้นตอน 1: ศึกษาโครงสร้างข้อมูล**
อ่าน: `schema.prisma` เพื่อเข้าใจ fields ที่มี

### ✅ **ขั้นตอน 2: ศึกษาสูตรการคำนวณ**
อ่าน: `analyticsController.js` เพื่อดู algorithms ที่ใช้

### ✅ **ขั้นตอน 3: ศึกษาการนำเสนอข้อมูล**
อ่าน: `HorizontalBarChart.vue`, `StackedBarChartDB.vue` เพื่อเห็นว่าข้อมูลแสดงอย่างไร

### ✅ **ขั้นตอน 4: สร้างสมการของคุณ**
ใช้ fields จาก schema + algorithms จาก controller = สมการที่ต้องการ

---

**เอกสารนี้สร้างเมื่อ:** 22 กุมภาพันธ์ 2026

**อัพเดทล่าสุด:** ตรวจสอบทั้งโปรเจค ⭐


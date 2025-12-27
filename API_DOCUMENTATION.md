# API Documentation - Survey Data Visualization

## Overview
ระบบนี้ใช้ในการดึงข้อมูลผลการประเมินจากผู้ใช้มาแสดงเป็นกราฟแนวนอน (Horizontal Bar Chart) พร้อมแสดงชื่อบริษัท หมวดหมู่ และคำถาม

## Architecture

### Frontend (Vue 3 + Vite)
**File:** `Frontend Safety-Culture-Survey/src/views/Dashboard/Showgraph/HorizontalBarChart.vue`

ส่วนประกอบของ Component:
1. **Filters Section** - ช่วยให้ผู้ใช้ปรับปรุงข้อมูลที่แสดง:
   - เลือกบริษัท (company)
   - เลือกหมวดหมู่คำถาม (category)
   - เลือกคำถามเฉพาะ (question)
   - เลือกมุมมอง (current/future/both)

2. **Chart Section** - แสดงข้อมูลเป็นกราฟ:
   - แกน Y: คะแนน 1-5 
   - แกน X: จำนวนคำตอบ
   - สีน้ำเงิน: ข้อมูลปัจจุบัน (Current)
   - สีเขียว: ข้อมูลอนาคต (Future)

### Backend (Node.js + Express + Prisma)

#### API Endpoints

##### 1. GET `/api/analytics/companies`
ดึงรายชื่อบริษัททั้งหมดที่มีผู้ใช้ลงทะเบียน

**Response:**
```json
[
  {
    "id": "Siemens",
    "name": "Siemens"
  },
  {
    "id": "PTT",
    "name": "PTT"
  }
]
```

**Controller:** `getSurveyDataForChart()` → `getCompanies()`

---

##### 2. GET `/api/categories`
ดึงรายชื่อหมวดหมู่คำถามทั้งหมด

**Response:**
```json
[
  {
    "id": 1,
    "name": "Leadership & Vision",
    "questions": [...]
  },
  {
    "id": 2,
    "name": "Accountability",
    "questions": [...]
  }
]
```

**Controller:** `categoryController.getCategories()`

---

##### 3. GET `/api/questions`
ดึงรายชื่อคำถามทั้งหมด

**Response:**
```json
[
  {
    "id": 1,
    "text": "Are leaders and managers engaged in promoting safety?",
    "categoryId": 1,
    "order": 0,
    "createdAt": "2025-10-07T08:01:24.000Z",
    "updatedAt": "2025-10-07T08:01:24.000Z"
  }
]
```

**Controller:** `questionController.getQuestions()`

---

##### 4. GET `/api/analytics/survey-data`
ดึงข้อมูลการประเมินแยกตามคะแนน (1-5) สำหรับคำถามเฉพาะ

**Parameters:**
- `questionId` (required): ID ของคำถาม
- `companyId` (optional): ID ของบริษัท (default: 'combined' = ทั้งหมด)
- `year` (optional): ปี (default: ปีปัจจุบัน)

**Response:**
```json
{
  "questionId": 1,
  "questionNumber": 0,
  "questionText": "Are leaders and managers engaged in promoting safety?",
  "category": {
    "id": 1,
    "name": "Leadership & Vision"
  },
  "companyId": "combined",
  "companies": [
    { "id": "Siemens", "name": "Siemens" },
    { "id": "PTT", "name": "PTT" }
  ],
  "current": [5, 3, 2, 8, 15],  // จำนวนคำตอบแต่ละระดับ (1-5)
  "future": [2, 1, 3, 10, 17],  // ข้อมูลอนาคต
  "totalResponses": 33,
  "year": 2025
}
```

**Controller:** `analyticsController.getSurveyDataForChart()`

---

## Data Flow

### 1. Component Initialization (onMounted)
```
Component Mounted
    ↓
fetchData() called
    ↓
Promise.all([fetchCompanies, fetchCategories, fetchQuestions])
    ↓
Set initial question
    ↓
fetchSurveyData(firstQuestion.id, 'combined')
    ↓
Display Chart with default data
```

### 2. Company Change
```
User selects company (onCompanyChange)
    ↓
fetchSurveyData(selectedQuestion, selectedCompany)
    ↓
Update chartData
    ↓
Re-render chart with new data
```

### 3. Category Change
```
User selects category (onCategoryChange)
    ↓
Set first question in that category
    ↓
fetchSurveyData(firstQuestion, selectedCompany)
    ↓
Update chart
```

### 4. Question Change
```
User selects question (onQuestionChange)
    ↓
fetchSurveyData(selectedQuestion, selectedCompany)
    ↓
Update chart with new question data
```

## Database Schema

### Relevant Tables

#### `User`
```
- id (PK)
- name_user
- email_user
- company_user (บริษัท)
- position_user
- job_field_user (แผนก)
- work_group_user
- surveyStatus (not_started, in_progress, done)
```

#### `Category`
```
- id (PK)
- name (ชื่อหมวดหมู่)
```

#### `Question`
```
- id (PK)
- text (ข้อความคำถาม)
- categoryId (FK)
- order (ลำดับคำถาม)
```

#### `SurveyAnswer`
```
- id (PK)
- userId (FK to User)
- questionId (FK to Question)
- currentScore (1-5) - คะแนนปัจจุบัน
- expectedScore (1-5) - คะแนนอนาคต
- createdAt
- updatedAt
```

## How getSurveyDataForChart Works

### Algorithm:
1. **Validate Input**: ตรวจสอบ `questionId`
2. **Fetch Question**: ดึงข้อมูลคำถาม รวมถึง category
3. **Build Where Condition**:
   - Filter by questionId
   - Filter by company (ถ้าไม่ใช่ combined)
   - Filter by year
4. **Count Scores**: นับจำนวน currentScore และ expectedScore แต่ละระดับ (1-5)
5. **Return Results**: ส่งคืนข้อมูลในรูปแบบ array
   - `current[0]` = จำนวนคำตอบที่ให้คะแนน 1
   - `current[1]` = จำนวนคำตอบที่ให้คะแนน 2
   - เป็นต้น

### Example Query Logic (Pseudo-code):
```javascript
const answers = await prisma.surveyAnswer.findMany({
  where: {
    questionId: 1,
    user: { company_user: 'Siemens' },
    createdAt: { gte: 2025-01-01, lte: 2025-12-31 }
  }
});

// Count each score
const current = [0, 0, 0, 0, 0];
answers.forEach(answer => {
  current[answer.currentScore - 1]++;
});
```

## Integration Steps

### Backend:
1. ✅ Updated `analyticsController.js` - added `getSurveyDataForChart()` and `getCompanies()`
2. ✅ Updated `analyticsRoutes.js` - added routes for survey-data and companies

### Frontend:
1. ✅ Updated API endpoints in `HorizontalBarChart.vue`
2. ✅ Component already handles:
   - Fetching and displaying companies
   - Fetching and displaying categories
   - Fetching and displaying questions
   - Rendering chart with current/future data

## Testing

### Test Cases:

1. **Load Chart with Default Data**
   ```
   GET /api/analytics/companies
   GET /api/categories
   GET /api/questions
   GET /api/analytics/survey-data?questionId=1&companyId=combined&year=2025
   ```

2. **Filter by Company**
   ```
   GET /api/analytics/survey-data?questionId=1&companyId=Siemens&year=2025
   ```

3. **Change Category**
   ```
   Dropdown changes → Select first question in new category
   GET /api/analytics/survey-data?questionId=5&companyId=combined&year=2025
   ```

4. **Change Question**
   ```
   GET /api/analytics/survey-data?questionId=10&companyId=Siemens&year=2025
   ```

## Error Handling

### Frontend:
- Loading state while fetching data
- Error message display with retry button
- Graceful fallback if data is missing

### Backend:
- Validation of required parameters
- 404 error if question not found
- 400 error if invalid parameters
- 500 error for server issues

## Performance Considerations

1. **Database Indexes**: ใช้ indexes สำหรับ:
   - `SurveyAnswer.questionId`
   - `SurveyAnswer.userId`
   - `User.company_user`

2. **Query Optimization**:
   - ใช้ `select` เพื่อเลือก fields ที่ต้องการเท่านั้น
   - ใช้ `where` ในการ filter ที่ database level

3. **Caching** (Optional Future):
   - Cache results for 5-10 minutes
   - Invalidate cache when new answers are submitted

## Future Enhancements

1. Add more analytics:
   - Comparison between companies
   - Trends over time
   - Demographic breakdowns

2. Export functionality:
   - Export data to CSV/PDF
   - Share reports

3. Advanced filters:
   - Date range selection
   - Department/Position filters
   - Multiple questions comparison

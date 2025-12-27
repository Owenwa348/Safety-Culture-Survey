# Safety Culture Survey - Analytics & Chart System

## 📋 Overview

ระบบนี้จำหน่ายเอกสารสำหรับดึงข้อมูลผลการประเมินความปลอดภัยของพนักงาน (Safety Culture Survey) และแสดงเป็นกราฟแนวนอน (Horizontal Bar Chart) โดยแบ่งตามบริษัท หมวดหมู่ และคำถาม

## 🎯 Features

- ✅ ดึงข้อมูลบริษัททั้งหมด
- ✅ ดึงข้อมูลหมวดหมู่และคำถาม
- ✅ แสดงข้อมูลประเมินเป็นกราฟแนวนอน
- ✅ เปรียบเทียบข้อมูลปัจจุบัน vs อนาคต
- ✅ ฟิลเตอร์ตามบริษัท หมวดหมู่ และคำถาม
- ✅ ฟิลเตอร์ตามมุมมอง (ปัจจุบัน/อนาคต/เปรียบเทียบ)

## 🏗️ Architecture

### Backend Structure
```
Backend Safety-Culture-Survey/
├── controllers/
│   └── Analytics/
│       └── analyticsController.js          (NEW: getSurveyDataForChart, getCompanies)
├── routes/
│   └── Analytics/
│       └── analyticsRoutes.js              (UPDATED: added survey-data & companies routes)
└── prisma/
    └── schema.prisma                       (Database schema)
```

### Frontend Structure
```
Frontend Safety-Culture-Survey/
└── src/
    └── views/
        └── Dashboard/
            └── Showgraph/
                └── HorizontalBarChart.vue  (UPDATED: API endpoints corrected)
```

## 🔌 API Endpoints

### 1. Get Companies
```
GET /api/analytics/companies
```
**Response:**
```json
[
  { "id": "Siemens", "name": "Siemens" },
  { "id": "PTT", "name": "PTT" }
]
```

### 2. Get Categories
```
GET /api/categories
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Leadership & Vision",
    "questions": [...]
  }
]
```

### 3. Get Questions
```
GET /api/questions
```
**Response:**
```json
[
  {
    "id": 1,
    "text": "Are leaders engaged in promoting safety?",
    "categoryId": 1,
    "order": 0,
    "options": [...]
  }
]
```

### 4. Get Survey Data for Chart ⭐ (NEW)
```
GET /api/analytics/survey-data?questionId=1&companyId=combined&year=2025
```

**Query Parameters:**
- `questionId` (required): ID ของคำถาม
- `companyId` (optional): ID ของบริษัท (default: combined)
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
  "current": [5, 3, 2, 8, 15],    // จำนวนคำตอบแต่ละระดับ (1-5)
  "future": [2, 1, 3, 10, 17],   // ข้อมูลอนาคต
  "totalResponses": 33,
  "year": 2025
}
```

## 📊 Chart Data Format

กราฟแสดงข้อมูลในรูปแบบ array 5 elements:

```
Index:   0    1    2    3     4
Score:   1    2    3    4     5
Current: [5,   3,   2,   8,   15]  // 5 คน ตอบว่าระดับ 1
Future:  [2,   1,   3,   10,  17]  // 2 คน ตอบว่าระดับ 1
```

### ตัวอย่าง:
- `current[0] = 5` → 5 คน ให้คะแนน 1
- `current[4] = 15` → 15 คน ให้คะแนน 5

## 🚀 Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd "Backend Safety-Culture-Survey"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables (.env):**
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/survey_db"
   PORT=3000
   NODE_ENV=development
   ```

4. **Setup database:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Start server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd "Frontend Safety-Culture-Survey"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables (.env.local):**
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access application:**
   ```
   http://localhost:5173
   ```

## 🧪 Testing

### Using Postman

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `Postman_API_Collection.json`

2. **Set Variables:**
   - In Postman, set `base_url` = `http://localhost:3000`

3. **Test Endpoints:**
   - Run requests in order:
     1. Get Companies
     2. Get Categories
     3. Get Questions
     4. Get Survey Data

### Using cURL

```bash
# Get companies
curl http://localhost:3000/api/analytics/companies

# Get categories
curl http://localhost:3000/api/categories

# Get questions
curl http://localhost:3000/api/questions

# Get survey data for question 1
curl "http://localhost:3000/api/analytics/survey-data?questionId=1&companyId=combined&year=2025"

# Get survey data for specific company
curl "http://localhost:3000/api/analytics/survey-data?questionId=1&companyId=Siemens&year=2025"
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────┐
│          HorizontalBarChart Component               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  onMounted():                                      │
│  ├─ fetchCompanies()                               │
│  │  └─ GET /api/analytics/companies               │
│  ├─ fetchCategories()                              │
│  │  └─ GET /api/categories                        │
│  ├─ fetchQuestions()                               │
│  │  └─ GET /api/questions                         │
│  └─ fetchSurveyData(firstQuestion, 'combined')    │
│     └─ GET /api/analytics/survey-data             │
│                                                    │
│  onCompanyChange:                                 │
│  └─ fetchSurveyData(selectedQuestion, selectedCo) │
│     └─ GET /api/analytics/survey-data             │
│                                                    │
│  onCategoryChange:                                │
│  └─ Set first question in category                │
│  └─ fetchSurveyData()                             │
│                                                    │
│  onQuestionChange:                                │
│  └─ fetchSurveyData(selectedQuestion, selectedCo) │
│                                                    │
└─────────────────────────────────────────────────────┘
         ↓            ↓            ↓
    Companies     Categories   Questions
```

## 📁 File Changes

### Modified Files

1. **`Backend Safety-Culture-Survey/controllers/Analytics/analyticsController.js`**
   - ✅ Added `getSurveyDataForChart()` function
   - ✅ Added `getCompanies()` function
   - ✅ Exported new functions

2. **`Backend Safety-Culture-Survey/routes/Analytics/analyticsRoutes.js`**
   - ✅ Added route for `/analytics/survey-data`
   - ✅ Added route for `/analytics/companies`

3. **`Frontend Safety-Culture-Survey/src/views/Dashboard/Showgraph/HorizontalBarChart.vue`**
   - ✅ Updated `fetchCompanies()` API endpoint
   - ✅ Updated `fetchSurveyData()` API endpoint
   - ✅ Corrected API base path

### Created Files

1. **`API_DOCUMENTATION.md`** - Detailed API documentation
2. **`SETUP_GUIDE.md`** - Step-by-step setup instructions
3. **`Postman_API_Collection.json`** - Postman collection for testing

## 🐛 Troubleshooting

### Issue: "Failed to fetch companies"
**Solution:** Check if backend server is running on `http://localhost:3000`

### Issue: "Cannot find question"
**Solution:** Make sure `questionId` exists in database

### Issue: Chart shows no data
**Possible causes:**
1. No survey answers submitted yet
2. Wrong `year` parameter
3. Wrong `companyId`

### Issue: CORS error
**Solution:** Check if backend has CORS enabled

```javascript
// In server.js
const cors = require('cors');
app.use(cors());
```

## 📊 Example Usage Flow

1. **Page loads** → Component mounted
2. **Fetch all data** → Companies, Categories, Questions
3. **Display initial chart** → First question, all companies, both views
4. **User selects company** → Chart updates with company data
5. **User selects category** → First question in category is selected
6. **User selects question** → Chart updates with new question data
7. **User changes view** → Chart re-renders with selected view (current/future/both)

## 🎨 Frontend Component Details

### Filters
```vue
<select v-model="selectedCompany" @change="onCompanyChange">
  <option value="combined">บริษัททั้งหมด</option>
  <option v-for="company in companies">{{ company.name }}</option>
</select>

<select v-model="selectedCategory" @change="onCategoryChange">
  <option v-for="(category, index) in categories">
    {{ index + 1 }}. {{ category.name }}
  </option>
</select>

<select v-model="selectedQuestion" @change="onQuestionChange">
  <option v-for="question in availableQuestions">
    {{ question.number }} {{ question.text }}
  </option>
</select>

<select v-model="selectedView">
  <option value="both">เปรียบเทียบ (ปัจจุบัน กับ อนาคต)</option>
  <option value="current">ปัจจุบัน</option>
  <option value="future">อนาคต</option>
</select>
```

### Chart
```vue
<!-- Legend -->
<div class="legend">
  <div v-if="selectedView === 'both' || selectedView === 'future'">
    <div style="background: #10b981"></div>
    <span>อนาคต (เป้าหมาย)</span>
  </div>
  <div v-if="selectedView === 'both' || selectedView === 'current'">
    <div style="background: #3b82f6"></div>
    <span>ปัจจุบัน</span>
  </div>
</div>

<!-- Bars for each score (1-5) -->
<div v-for="score in [1, 2, 3, 4, 5]">
  <!-- Future bar -->
  <div style="background: #10b981" :style="{ width: getBarWidth(future[score-1]) }">
    {{ future[score-1] }}
  </div>
  <!-- Current bar -->
  <div style="background: #3b82f6" :style="{ width: getBarWidth(current[score-1]) }">
    {{ current[score-1] }}
  </div>
</div>
```

## 📝 Notes

- Chart data is fetched on demand (ไม่มี caching)
- All dates are stored in UTC in database
- Company names are taken from `User.company_user` field
- Questions are ordered by `order` field (default: id)

## 🔐 Security Considerations

- ✅ Validate `questionId` parameter
- ✅ Use Prisma for SQL injection prevention
- ✅ Filter by company to prevent data leakage
- ⚠️ TODO: Add authentication/authorization
- ⚠️ TODO: Rate limiting on API endpoints

## 📚 Additional Resources

- Prisma Documentation: https://www.prisma.io/docs/
- Vue 3 Documentation: https://vuejs.org/
- Express.js Guide: https://expressjs.com/
- Tailwind CSS: https://tailwindcss.com/

## 👨‍💻 Support

For issues or questions:
1. Check `API_DOCUMENTATION.md` for detailed API info
2. Review error logs in browser console
3. Test endpoints using Postman collection

---

**Last Updated:** December 27, 2025
**Status:** ✅ Ready for Testing

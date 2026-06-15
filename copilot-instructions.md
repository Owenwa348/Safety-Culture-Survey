# Safety Culture Survey Platform - Copilot Instructions

This file provides instructions and guidelines for GitHub Copilot when generating code for the Safety Culture Survey Platform project.

---

## 🎯 Project Context

**Project:** Safety Culture Survey Platform  
**Purpose:** Multi-company safety culture survey management system with analytics  
**Tech Stack:** Node.js 20 + Express 5 + Vue 3 + TypeScript + MySQL 8 + Prisma ORM 6  
**Architecture:** 3-tier (Frontend / Backend API / Database)  

---

## 📋 Code Style Guide

### General Principles
- **Language:** Thai comments for functions and complex logic, English for variable names
- **Formatting:** 2-space indentation (both JS and Vue)
- **Naming:** camelCase for variables, PascalCase for classes/components
- **Type Safety:** Use TypeScript types in frontend, JSDoc in backend
- **Comments:** Brief, meaningful comments explaining WHY not WHAT

### File Naming Conventions

```
Backend:
├── controllers/Domain/domainController.js
├── routes/Domain/domainRoutes.js
├── services/domainService.js
├── middleware/authMiddleware.js
└── tests/unit/domainController.test.js

Frontend:
├── views/PageName/PageName.vue
├── components/ComponentName.vue
├── router/index.ts
├── utils/helperFunctions.ts
└── tests/ComponentName.spec.ts
```

### Naming Conventions

**Database Models (Prisma):**
```prisma
model user { }           // Singular, lowercase
model survey_answer { }  // Snake_case for clarity
```

**Backend Variables:**
```javascript
const userId = 123;              // camelCase
const companyName = 'SafeGuard'; // camelCase
const MAX_FILE_SIZE = 10485760;  // UPPER_CASE for constants
```

**Frontend Components & Variables:**
```typescript
// Components: PascalCase
export default {
  name: 'SurveyForm'
}

// Variables: camelCase
const surveyData = ref([]);
const currentQuestion = ref(null);
const MAX_RATING = 5; // Constants
```

**Endpoint Naming:**
```
GET    /api/surveys              // List
GET    /api/surveys/:id          // Get one
POST   /api/surveys              // Create
PATCH  /api/surveys/:id          // Update
DELETE /api/surveys/:id          // Delete
GET    /api/surveys/analysis     // Custom action
```

---

## 🏗️ Architecture Patterns

### Backend Structure

#### 1. Controller Pattern
```javascript
// controllers/Survey/surveyController.js
/**
 * getSurveyList - ดึงรายการแบบประเมินทั้งหมด
 */
const getSurveyList = async (req, res) => {
  try {
    const { page = 1, limit = 10, companyId } = req.query;
    
    const surveys = await prisma.survey_answer.findMany({
      where: { user: { company_id: companyId ? parseInt(companyId) : undefined } },
      include: { user: true, question: true },
      skip: (page - 1) * limit,
      take: limit
    });
    
    res.json({ success: true, data: surveys });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getSurveyList };
```

#### 2. Route Pattern
```javascript
// routes/Survey/surveyRoutes.js
const express = require('express');
const router = express.Router();
const { getSurveyList, getSurveyById, createSurvey } = require('../../controllers/Survey/surveyController');
const { authMiddleware, adminOnly } = require('../../middleware/authMiddleware');

router.get('/surveys', authMiddleware, getSurveyList);
router.get('/surveys/:id', authMiddleware, getSurveyById);
router.post('/surveys', authMiddleware, adminOnly, createSurvey);

module.exports = router;
```

#### 3. Service Pattern (for complex logic)
```javascript
// services/surveyService.js
class SurveyService {
  async calculateAverageScore(questionId, companyId) {
    const answers = await prisma.survey_answer.findMany({
      where: {
        questionId: questionId,
        user: { company_id: companyId }
      }
    });
    
    const sum = answers.reduce((acc, a) => acc + a.currentValue, 0);
    return sum / answers.length;
  }
}

module.exports = new SurveyService();
```

### Frontend Structure

#### 1. Vue Component Pattern
```vue
<template>
  <div class="survey-container p-6 bg-white rounded-lg shadow">
    <!-- Header -->
    <h2 class="text-2xl font-bold mb-6">{{ title }}</h2>
    
    <!-- Content -->
    <div v-if="loading" class="text-center">
      <p>กำลังโหลด...</p>
    </div>
    <div v-else-if="surveys.length">
      <div v-for="survey in surveys" :key="survey.id" class="mb-4 p-4 border rounded">
        <!-- Survey item -->
      </div>
    </div>
    <div v-else class="text-gray-500">
      <p>ไม่พบข้อมูล</p>
    </div>
    
    <!-- Actions -->
    <div class="mt-6 flex gap-3">
      <button @click="handleSave" class="btn btn-primary">บันทึก</button>
      <button @click="handleCancel" class="btn btn-secondary">ยกเลิก</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Survey {
  id: number;
  name: string;
  status: string;
}

const title = ref('แบบประเมิน');
const surveys = ref<Survey[]>([]);
const loading = ref(false);

const fetchSurveys = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/surveys');
    surveys.value = response.data.data;
  } catch (error) {
    console.error('Error fetching surveys:', error);
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  // Implementation
};

const handleCancel = () => {
  // Implementation
};

onMounted(() => {
  fetchSurveys();
});
</script>

<style scoped>
.survey-container {
  /* Component-specific styles */
}
</style>
```

#### 2. Composable Pattern (for reusable logic)
```typescript
// utils/useSurveyData.ts
import { ref, computed, async } from 'vue';
import axios from 'axios';

export function useSurveyData() {
  const surveys = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchSurveys = async (companyId?: number) => {
    try {
      loading.value = true;
      const response = await axios.get('/api/surveys', {
        params: { companyId }
      });
      surveys.value = response.data.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const filteredSurveys = computed(() => {
    return surveys.value.filter(s => s.status === 'active');
  });

  return { surveys, loading, error, fetchSurveys, filteredSurveys };
}
```

---

## 🗄️ Database (Prisma) Patterns

### Schema Best Practices
```prisma
model survey_answer {
  id          Int       @id @default(autoincrement())
  userId      Int
  user        user      @relation(fields: [userId], references: [id], onDelete: Cascade)
  questionId  Int
  question    question  @relation(fields: [questionId], references: [id], onDelete: Cascade)
  currentValue Int?
  futureValue Int?
  notes       String?   @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Add indexes for frequently queried fields
  @@index([userId])
  @@index([questionId])
  @@index([createdAt])
}
```

### Query Patterns
```javascript
// ❌ Avoid N+1 queries
const surveys = await prisma.survey_answer.findMany();
surveys.forEach(async (s) => {
  const user = await prisma.user.findUnique({ where: { id: s.userId } });
});

// ✅ Use include for related data
const surveys = await prisma.survey_answer.findMany({
  include: { user: true, question: true }
});

// ✅ Use select to limit fields
const surveys = await prisma.survey_answer.findMany({
  select: { id: true, currentValue: true, user: { select: { name_user: true } } }
});

// ✅ Use where for filtering
const activeSurveys = await prisma.survey_answer.findMany({
  where: {
    user: { status: 'active' },
    createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  }
});
```

---

## 🔐 Security Patterns

### Authentication Middleware
```javascript
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin' && req.userRole !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };
```

### Input Validation Pattern
```javascript
// Use joi for validation
const joi = require('joi');

const validateSurvey = (data) => {
  const schema = joi.object({
    userId: joi.number().required(),
    questionId: joi.number().required(),
    currentValue: joi.number().min(1).max(5).required(),
    futureValue: joi.number().min(1).max(5),
    notes: joi.string().max(500)
  });
  
  return schema.validate(data);
};

// In controller:
const { error, value } = validateSurvey(req.body);
if (error) return res.status(400).json({ error: error.message });
```

---

## 🧪 Testing Patterns

### Backend Unit Test
```javascript
// tests/unit/surveyController.test.js
const { getSurveyList } = require('../../controllers/Survey/surveyController');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client');

describe('Survey Controller', () => {
  it('should return survey list with pagination', async () => {
    const mockData = [
      { id: 1, userId: 1, questionId: 1, currentValue: 4 }
    ];
    
    PrismaClient.prototype.survey_answer.findMany = jest.fn()
      .mockResolvedValue(mockData);
    
    const req = { query: { page: 1, limit: 10 } };
    const res = { json: jest.fn() };
    
    await getSurveyList(req, res);
    
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockData
    });
  });
});
```

### Frontend E2E Test
```typescript
// tests/e2e/survey-flow.spec.ts
import { test, expect } from '@playwright/test';

test('Complete survey submission flow', async ({ page }) => {
  // Navigate to survey
  await page.goto('http://localhost:5173/assessor/survey');
  
  // Fill survey questions
  const ratingButtons = page.locator('button.rating-btn');
  await ratingButtons.first().click();
  
  // Submit form
  await page.click('button:has-text("ส่งแบบประเมิน")');
  
  // Verify success message
  await expect(page.locator('text=ส่งแบบประเมินสำเร็จ')).toBeVisible();
});
```

---

## 🎨 Styling (Tailwind) Patterns

### Component Styling
```vue
<template>
  <!-- Use Tailwind utility classes -->
  <div class="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
    <!-- Header section -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        บันทึก
      </button>
    </div>
    
    <!-- Content section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Card component -->
      <div v-for="item in items" :key="item.id" 
           class="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
```

### Dark Mode Support (Optional)
```vue
<template>
  <div class="dark:bg-gray-900 dark:text-white">
    <!-- Content -->
  </div>
</template>
```

---

## 🔄 Common Workflows

### Adding a New Feature

**1. Backend - Create Controller**
```javascript
// Follow the controller pattern above
// Include error handling with try-catch
// Use Prisma with include/select
```

**2. Backend - Create Route**
```javascript
// Register in routes/index.js
// Add middleware (auth, adminOnly, validation)
```

**3. Frontend - Create Vue Component**
```typescript
// Use setup syntax with TypeScript
// Implement error states (loading, empty, error)
// Use Tailwind for styling
```

**4. Database - Update Schema if needed**
```prisma
// Create migration: npx prisma migrate dev --name feature_name
// Test migration
// Update seed.js if needed
```

### Debugging Tips

**Backend:**
```javascript
// Add console logs in strategic places
console.log('🔍 [surveyController] userId:', userId);
console.log('📊 [surveyController] Query result:', result);

// Check database:
npx prisma studio

// View migrations:
npx prisma migrate status
```

**Frontend:**
```typescript
// Use Vue DevTools browser extension
// Check Network tab in browser DevTools
// Use console.log with clear prefixes
console.log('🎨 [SurveyForm] Loading surveys:', surveys.value);
```

---

## ✅ Pre-commit Checklist for Copilot

Before suggesting code, Copilot should verify:

- [ ] Code follows naming conventions (camelCase, PascalCase)
- [ ] Error handling included (try-catch for async, .catch() for promises)
- [ ] Comments are meaningful and in correct language (Thai for logic, English for code)
- [ ] Proper Prisma patterns used (include/select, no N+1 queries)
- [ ] Input validation included (joi validation in backend)
- [ ] Vue components have TypeScript types defined
- [ ] Frontend components have proper state management (ref, computed, reactive)
- [ ] Database indexes added for frequently queried fields
- [ ] No hardcoded values (use constants or config)
- [ ] Environment variables used appropriately
- [ ] Responsive design implemented (mobile-first with Tailwind)
- [ ] Accessibility considered (semantic HTML, ARIA labels)
- [ ] Error messages are user-friendly and in Thai for frontend
- [ ] Consistent indentation (2 spaces)
- [ ] No console.log in production code (except errors)
- [ ] Tests included for critical functions
- [ ] Documentation comments for complex logic

---

## 🚀 Performance Considerations

### Backend
- Use pagination for large result sets
- Add database indexes on frequently filtered columns
- Implement caching for analytics queries
- Use select/include to limit returned fields

### Frontend
- Use `v-if` for components that should unmount
- Use `v-show` for frequently toggled components
- Implement lazy loading for images
- Code split large components

### Database
- Always use indexes on foreign keys
- Batch operations when possible
- Monitor query performance with `prisma.queryRaw()`

---

## 🔗 Related Files

- **Project structure:** See PROJECT_STRUCTURE.md
- **Agents guide:** See AGENTS.md
- **Architecture:** See README.md

---

## 📝 Examples by Domain

### Survey Management
- **Controller:** `controllers/Assessment/assessmentController.js`
- **Route:** `routes/Assessment/assessmentRoutes.js`
- **Component:** `src/views/Assessor/SurveyForm.vue`

### Analytics & Reporting
- **Controller:** `controllers/Analytics/analyticsController.js`
- **Component:** `src/views/Dashboard/Showgraph/HorizontalBarChart.vue`

### User Management
- **Controller:** `controllers/User/userController.js`
- **Service:** `services/companyService.js`

---

## 🎯 Code Generation Guidelines

When Copilot generates code:

1. **Always add error handling** - Use try-catch blocks
2. **Always add TypeScript types** - In Vue components and interfaces
3. **Always validate input** - Use joi or similar validation
4. **Always use async/await** - Not callbacks or promises
5. **Always include comments** - Explain the WHY not WHAT
6. **Always follow conventions** - Use camelCase for variables
7. **Always consider performance** - Use Prisma optimizations
8. **Always think about security** - Validate and sanitize inputs

---

## 📞 Questions or Updates

For questions about these guidelines:
1. Check AGENTS.md for appropriate agent to help
2. Reference PROJECT_HEALTH_CHECK.md for best practices
3. See DEVELOPER_QUICK_REFERENCE.md for quick lookups

---

**Last Updated:** May 17, 2026  
**Version:** 1.0.0  
**For:** GitHub Copilot code generation assistance

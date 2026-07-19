# Safety Culture Survey Platform - Developer Quick Reference 🚀

**Quick lookup guide for common development tasks**

---

## 🏃 Quick Start

### First Time Setup
```bash
# 1. Clone repository (if needed)
git clone <repo-url>
cd Safety-Culture-Survey

# 2. Create .env file
cp .env.example .env

# 3. Start development environment
make dev

# 4. Verify services
curl http://localhost:5000/api/health
curl http://localhost:5173
```

### Ports Reference
```
Backend API:     http://localhost:5000
Frontend:        http://localhost:5173  (dev)
                 http://localhost:80    (prod)
MySQL:           localhost:3307
Postman:         Import Postman_API_Collection.json
```

---

## 📁 Project Structure at a Glance

```
Backend Safety-Culture-Survey/
  ├── controllers/          [Business logic by domain]
  ├── routes/              [API endpoint definitions]
  ├── services/            [Reusable service layer]
  ├── middleware/          [Auth, CORS, etc.]
  ├── prisma/              [DB schema & migrations]
  ├── tests/              [Unit & integration tests]
  └── server.js            [Entry point]

Frontend Safety-Culture-Survey/
  ├── src/
  │   ├── views/           [Page components]
  │   ├── components/      [Reusable UI components]
  │   ├── router/          [Vue Router config]
  │   ├── utils/           [Helper functions]
  │   └── config/          [API configs]
  ├── tests/               [E2E tests]
  └── playwright.config.ts [Test config]
```

---

## 🔧 Common Development Tasks

### 1️⃣ Add New API Endpoint

**Steps:**

1. **Create Controller** (`Backend Safety-Culture-Survey/controllers/Domain/`)
```javascript
// surveyController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSurveyData = async (req, res) => {
  try {
    const data = await prisma.survey_answer.findMany({
      include: { user: true, question: true }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSurveyData };
```

2. **Create Route** (`Backend Safety-Culture-Survey/routes/Domain/`)
```javascript
// surveyRoutes.js
const express = require('express');
const { getSurveyData } = require('../../controllers/Domain/surveyController');
const { authMiddleware } = require('../../middleware/authMiddleware');

const router = express.Router();
router.get('/survey-data', authMiddleware, getSurveyData);

module.exports = router;
```

3. **Register Route** (`Backend Safety-Culture-Survey/routes/index.js`)
```javascript
const surveyRoutes = require('./Domain/surveyRoutes');
module.exports = (app) => {
  app.use('/api', surveyRoutes);
};
```

4. **Test in Postman**
```
GET http://localhost:5000/api/survey-data
Headers: Authorization: Bearer <token>
```

### 2️⃣ Create Vue Component

**Steps:**

1. **Create Component** (`Frontend Safety-Culture-Survey/src/components/`)
```vue
<template>
  <div class="card p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
    <p v-if="data">{{ data }}</p>
    <button @click="loadData" class="btn btn-primary">Load Data</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const title = ref('My Component');
const data = ref(null);

const loadData = async () => {
  try {
    const response = await axios.get('/api/survey-data');
    data.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Component styles */
</style>
```

2. **Use in View** (`Frontend Safety-Culture-Survey/src/views/`)
```vue
<template>
  <MyComponent />
</template>

<script setup lang="ts">
import MyComponent from '@/components/MyComponent.vue';
</script>
```

### 3️⃣ Create Database Migration

**Steps:**

1. **Modify Schema** (`Backend Safety-Culture-Survey/prisma/schema.prisma`)
```prisma
model survey_answer {
  id          Int      @id @default(autoincrement())
  userId      Int
  questionId  Int
  currentValue Int?     // NEW FIELD
  futureValue Int?      // NEW FIELD
  notes       String?   @db.Text
  // ... existing fields
}
```

2. **Create Migration**
```bash
cd Backend\ Safety-Culture-Survey
npx prisma migrate dev --name add_survey_values
```

3. **Update Seed Data** (`Backend Safety-Culture-Survey/prisma/seed.js`)
```javascript
// Add currentValue and futureValue in seed data
```

4. **Test**
```bash
make dev  # Restart to apply migration
```

### 4️⃣ Add Unit Test (Backend)

**Steps:**

1. **Create Test File** (`Backend Safety-Culture-Survey/tests/unit/`)
```javascript
// surveyController.test.js
const { getSurveyData } = require('../../controllers/Domain/surveyController');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client');

describe('Survey Controller', () => {
  it('should get survey data', async () => {
    const mockData = [{ id: 1, userId: 1 }];
    PrismaClient.prototype.survey_answer.findMany = jest.fn()
      .mockResolvedValue(mockData);

    const req = {};
    const res = { json: jest.fn() };

    await getSurveyData(req, res);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });
});
```

2. **Run Test**
```bash
npm test
```

### 5️⃣ Add E2E Test (Frontend)

**Steps:**

1. **Create Test File** (`Frontend Safety-Culture-Survey/tests/`)
```typescript
// survey-flow.spec.ts
import { test, expect } from '@playwright/test';

test('Complete survey flow', async ({ page }) => {
  // Navigate to survey
  await page.goto('http://localhost:5173/survey');
  
  // Fill out survey
  await page.click('label:has-text("Strongly Agree")');
  await page.fill('textarea', 'My feedback');
  
  // Submit
  await page.click('button:has-text("Submit")');
  
  // Verify success
  await expect(page).toHaveURL(/.*success/);
});
```

2. **Run Test**
```bash
npm run test:e2e
```

---

## 🐛 Debugging Guide

### Backend Debugging

**Check Server Status**
```bash
# Check if server is running
curl http://localhost:5000/health

# View server logs
docker logs safety-survey-backend

# Access server shell
docker exec -it safety-survey-backend sh
```

**Debug Database Issues**
```bash
# Connect to MySQL
mysql -h localhost -P 3307 -u root -p

# Check migrations
npx prisma migrate status

# Reset database (dev only!)
npx prisma migrate reset
```

**Debug API Requests**
```bash
# Use Postman or curl
curl -X GET http://localhost:5000/api/analytics \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Frontend Debugging

**Browser DevTools**
```
F12 - Open Developer Tools
Ctrl+Shift+J - Open Console
Ctrl+Shift+I - Open Inspector
```

**Check Network**
- Network tab → See API calls
- Console tab → See JavaScript errors
- Vue DevTools → Inspect components & state

**Local Development**
```bash
# Rebuild if changes not showing
npm run dev

# Clear browser cache
Ctrl+Shift+Delete (Windows)
Cmd+Shift+Delete (Mac)
```

---

## 🔐 Authentication & Authorization

### User Roles

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **User** | Answer surveys | Create categories, manage users |
| **Admin** | Manage users, view analytics | Super admin functions |
| **SuperAdmin** | All admin + create admins | Nothing (full access) |

### Get Auth Token

**Login Endpoint:**
```bash
POST http://localhost:5000/api/auth/login

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "user@example.com", "role": "user" }
}
```

**Use Token in Requests:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/protected-endpoint
```

---

## 📊 Database Quick Reference

### Key Models

**User Model**
```prisma
- id (Int, PK)
- email (String, unique)
- password (String, bcrypted)
- company_id (FK)
- position_id (FK)
- department_id (FK)
- survey_status (not_started | in_progress | done)
- role_user (user | admin | superadmin)
```

**Survey Answer Model**
```prisma
- id (Int, PK)
- userId (FK)
- questionId (FK)
- currentValue (Int)
- futureValue (Int)
```

### Common Queries

**Get All Users in Company**
```javascript
const users = await prisma.user.findMany({
  where: { company_id: 1 },
  include: { company: true, position: true }
});
```

**Get Survey Responses**
```javascript
const responses = await prisma.survey_answer.findMany({
  where: { userId: 1 },
  include: { question: true }
});
```

**Get Analytics by Department**
```javascript
const data = await prisma.survey_answer.groupBy({
  by: ['questionId'],
  where: { user: { department_id: 1 } },
  _avg: { currentValue: true }
});
```

---

## 🚀 Deployment Checklist

### Before Deploying to Production

- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Database backups configured
- [ ] CORS whitelist updated
- [ ] SSL certificates ready
- [ ] Rate limiting configured
- [ ] Error logging enabled
- [ ] Monitoring configured
- [ ] Database optimized

### Deploy Process

```bash
# 1. Build production image
make prod-build

# 2. Start services
docker-compose up -d

# 3. Verify
curl http://localhost:5000/health
curl http://localhost:80

# 4. Check logs
docker-compose logs -f
```

### Rollback Process

```bash
# 1. Stop current services
docker-compose down

# 2. Revert to previous image
docker-compose -f docker-compose.yml.backup up -d

# 3. Verify services
curl http://localhost:5000/health
```

---

## 📚 File Reference

### Key Files to Know

| File | Purpose |
|------|---------|
| `server.js` | Backend entry point |
| `prisma/schema.prisma` | Database schema definition |
| `prisma/seed.js` | Database seed data |
| `routes/index.js` | Route registration |
| `src/main.ts` | Frontend entry point |
| `src/router/index.ts` | Vue Router config |
| `docker-compose.yml` | Production setup |
| `docker-compose.dev.yml` | Development setup |
| `Makefile` | Common commands |
| `.env` | Environment variables |

---

## 🆘 Common Issues & Solutions

### Issue: "CORS Error"
**Solution:**
```javascript
// Check allowed origins in server.js
const allowedOrigins = ['http://localhost:5173', ...];
// Add your frontend URL if missing
```

### Issue: "Database Connection Failed"
**Solution:**
```bash
# Check MySQL is running
docker-compose ps

# Verify DATABASE_URL in .env
# Check port mapping: 3307:3306
```

### Issue: "Authentication Token Expired"
**Solution:**
```javascript
// Frontend: Get new token
const response = await axios.post('/api/auth/login', credentials);
localStorage.setItem('token', response.data.token);
```

### Issue: "Build Fails"
**Solution:**
```bash
# Clear dependencies
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Rebuild
npm run build
```

### Issue: "Port Already in Use"
**Solution:**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

---

## 📞 Getting Help

**Need to Debug?**
1. Check logs: `docker-compose logs -f`
2. Check Postman: `Postman_API_Collection.json`
3. Read: `README.md`, `SETUP_GUIDE.md`
4. Search: Project documentation files

**Development Blocked?**
- Use "AGENTS.md" to request AI assistance
- Specify the exact issue and location
- Provide error messages if available

---

## 🔗 Useful Links

- **Backend Documentation:** `README.md`
- **Setup Guide:** `SETUP_GUIDE.md`
- **Analytics Details:** `GRAPH_AND_CALCULATION_FILES.md`
- **Agent Guide:** `AGENTS.md`
- **Health Check:** `PROJECT_HEALTH_CHECK.md`

---

**Version:** 1.0.0  
**Last Updated:** May 17, 2026  
**For:** Quick reference during development

🚀 **Happy Coding!**

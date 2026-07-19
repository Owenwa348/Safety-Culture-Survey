# Safety Culture Survey Platform - AI Agents Guide 🤖

ไฟล์นี้บรรยายวิธีการใช้ AI agents ในการพัฒนา, ทดสอบ, และบำรุงรักษาโปรเจค **Safety Culture Survey Platform**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Agent Definitions](#agent-definitions)
3. [Development Workflows](#development-workflows)
4. [Testing & Quality Assurance](#testing--quality-assurance)
5. [Deployment & DevOps](#deployment--devops)
6. [Troubleshooting & Problem Solving](#troubleshooting--problem-solving)
7. [Common Use Cases](#common-use-cases)

---

## 🏗️ Project Overview

### What is this project?

**Safety Culture Survey Platform** เป็นระบบบริหารจัดการและวิเคราะห์แบบสอบถามวัฒนธรรมความปลอดภัยองค์กรแบบครบวงจร

**Key Features:**
- 📊 Survey assessment system (3-level user: User/Admin/SuperAdmin)
- 📈 Analytics dashboard with real-time charts
- 👥 Multi-company & multi-role management
- 📥 Excel import for bulk user upload
- 🎨 Responsive design (Tailwind CSS)
- 🐳 Full Docker support (dev & production)

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Node.js 20 Alpine + Express 5 | REST API Server |
| **Database** | MySQL 8.0 + Prisma ORM 6 | Data persistence |
| **Frontend** | Vue 3 + TypeScript + Vite 7 | UI/UX |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Auth** | JWT + bcryptjs | Authentication |
| **Visualization** | Chart.js + vue-chartjs | Data charts |
| **Testing** | Playwright 1.58 | E2E testing |
| **DevOps** | Docker + Docker Compose | Containerization |

### Project Structure

```
Safety-Culture-Survey/
├── Backend Safety-Culture-Survey/          # Node.js + Express API
│   ├── controllers/                        # Business logic per domain
│   ├── routes/                             # Route definitions
│   ├── services/                           # Reusable service layer
│   ├── middleware/                         # Authentication, etc.
│   ├── prisma/                             # Database schema & migrations
│   ├── tests/                              # Unit tests
│   └── Dockerfile                          # Container config
├── Frontend Safety-Culture-Survey/         # Vue 3 + TypeScript
│   ├── src/
│   │   ├── views/                          # Page components
│   │   ├── components/                     # Reusable UI components
│   │   ├── router/                         # Vue Router config
│   │   ├── utils/                          # Helper functions
│   │   └── config/                         # API configs
│   ├── tests/                              # E2E tests (Playwright)
│   ├── playwright.config.ts                # Test configuration
│   └── Dockerfile                          # Container config
├── docker-compose.yml                      # Production setup
├── docker-compose.dev.yml                  # Development setup
├── Makefile                                # Common commands
└── README.md                               # Project documentation
```

---

## 🤖 Agent Definitions

### 1. **Backend Development Agent** 👨‍💻
**Purpose:** Develop, fix, and improve backend features

**Trigger Phrases:**
- "เพิ่ม API endpoint สำหรับ..."
- "แก้ไข bug ในตัวควบคุม..."
- "ปรับปรุง error handling ในบริการ..."
- "สร้าง migration ใหม่..."
- "ทำให้ database query เร็วขึ้น..."

**Responsibilities:**
- ✅ Create/modify Express routes & controllers
- ✅ Manage Prisma migrations & schema updates
- ✅ Implement business logic in services
- ✅ Handle authentication & authorization
- ✅ Debug API issues & performance problems
- ✅ Write unit tests for backend logic

**Example Request:**
```
Agent: "สร้าง API endpoint สำหรับดึงข้อมูลประเมินแบ่งตามแผนก"
Response: 
- Creates GET /api/analytics/by-department
- Adds analyticsController.getByDepartment()
- Implements Prisma query with aggregation
- Adds unit tests
```

---

### 2. **Frontend Development Agent** 🎨
**Purpose:** Develop UI components, pages, and improve UX

**Trigger Phrases:**
- "สร้าง UI component สำหรับ..."
- "ปรับปรุง dashboard..."
- "เพิ่มการ validate form..."
- "ทำให้ responsive design..."
- "เพิ่ม animation/transition..."

**Responsibilities:**
- ✅ Create Vue components (.vue files)
- ✅ Build pages using Vue Router
- ✅ Implement state management (Pinia)
- ✅ Style with Tailwind CSS
- ✅ Handle HTTP requests (Axios)
- ✅ Optimize performance & accessibility

**Example Request:**
```
Agent: "สร้าง component สำหรับแสดงข้อมูลประเมินแบบ DataTable"
Response:
- Creates SurveyDataTable.vue component
- Adds sorting & pagination logic
- Implements Tailwind styling
- Adds TypeScript type definitions
```

---

### 3. **Database & ORM Agent** 🗄️
**Purpose:** Manage database schema, migrations, and queries

**Trigger Phrases:**
- "สร้าง migration เพื่อเพิ่ม column..."
- "เปลี่ยนความสัมพันธ์ระหว่าง models..."
- "เพิ่มข้อมูล seed สำหรับ..."
- "ปรับปรุง database query..."
- "เพิ่ม constraint ในตาราง..."

**Responsibilities:**
- ✅ Create/modify Prisma schema
- ✅ Generate & run migrations
- ✅ Optimize database queries
- ✅ Manage data seeding (seed.js)
- ✅ Handle data relationships & constraints
- ✅ Ensure data integrity

**Example Request:**
```
Agent: "เพิ่ม column 'department_code' ในตาราง department"
Response:
- Modifies schema.prisma
- Creates migration: nnnn_add_department_code
- Updates seed.js with new field
- Runs migration deployment
```

---

### 4. **Testing & QA Agent** 🧪
**Purpose:** Create and maintain test suites

**Trigger Phrases:**
- "เขียน unit test สำหรับ..."
- "สร้าง E2E test สำหรับ..."
- "เพิ่มการทดสอบ API endpoint..."
- "ทำให้ code coverage สูงขึ้น..."
- "หาและแก้ bug ที่พบในการทดสอบ..."

**Responsibilities:**
- ✅ Write Playwright E2E tests
- ✅ Create Jest unit tests (backend)
- ✅ Write Vitest unit tests (frontend)
- ✅ Generate test reports
- ✅ Identify & report bugs
- ✅ Ensure test coverage > 80%

**Example Request:**
```
Agent: "เขียน E2E test สำหรับการ login และการประเมิน"
Response:
- Creates tests/e2e/login-and-survey.spec.ts
- Tests user login flow
- Tests survey form filling & submission
- Adds assertions & error handling
```

---

### 5. **DevOps & Deployment Agent** 🚀
**Purpose:** Manage Docker, CI/CD, and deployment

**Trigger Phrases:**
- "สร้าง Docker image..."
- "ปรับปรุง docker-compose..."
- "ตั้งค่า CI/CD pipeline..."
- "ติดตั้งโปรเจคบน production..."
- "เพิ่ม health checks..."

**Responsibilities:**
- ✅ Create/modify Dockerfiles
- ✅ Configure docker-compose files
- ✅ Set up environment variables
- ✅ Create deployment scripts
- ✅ Monitor container health
- ✅ Manage production vs development environments

**Example Request:**
```
Agent: "เพิ่ม health check ในทั้ง backend และ frontend"
Response:
- Adds healthcheck to docker-compose.yml
- Creates health check endpoints
- Tests connectivity between services
```

---

### 6. **Performance & Optimization Agent** ⚡
**Purpose:** Identify and fix performance bottlenecks

**Trigger Phrases:**
- "ปรับปรุง query performance..."
- "ลดขนาด bundle frontend..."
- "เพิ่มการ caching..."
- "ปรับปรุง โดยการใช้ database index..."
- "ทำให้ load time เร็วขึ้น..."

**Responsibilities:**
- ✅ Analyze slow queries
- ✅ Add database indexes
- ✅ Implement caching strategies
- ✅ Optimize API responses
- ✅ Reduce bundle size
- ✅ Profile frontend performance

**Example Request:**
```
Agent: "ปรับปรุง query สำหรับดึงข้อมูลประเมินทั้งหมด"
Response:
- Adds database indexes
- Implements query pagination
- Adds SELECT field limiting
- Tests query performance
```

---

### 7. **Security & Vulnerability Agent** 🔒
**Purpose:** Identify and fix security issues

**Trigger Phrases:**
- "ตรวจสอบ vulnerability..."
- "ปรับปรุง authentication..."
- "เพิ่ม role-based access control..."
- "ตรวจสอบ SQL injection..."
- "เพิ่ม input validation..."

**Responsibilities:**
- ✅ Run security audits
- ✅ Implement authentication/authorization
- ✅ Add input validation
- ✅ Prevent SQL injection
- ✅ Manage secrets & environment variables
- ✅ Update dependencies for CVEs

**Example Request:**
```
Agent: "ตรวจสอบและแก้ไข security vulnerability ในการอัพโหลด Excel"
Response:
- Validates file type & size
- Scans for malicious content
- Implements rate limiting
- Adds file type whitelist
```

---

### 8. **Documentation & Knowledge Agent** 📚
**Purpose:** Create and maintain project documentation

**Trigger Phrases:**
- "เขียน API documentation สำหรับ..."
- "สร้าง README สำหรับ component..."
- "อัพเดต architecture diagram..."
- "เขียน troubleshooting guide..."
- "ทำให้ documentation ชัดเจน..."

**Responsibilities:**
- ✅ Write API documentation
- ✅ Create architecture diagrams
- ✅ Document component usage
- ✅ Write troubleshooting guides
- ✅ Maintain knowledge base
- ✅ Generate code comments

---

## 🔄 Development Workflows

### Workflow 1: Adding a New Feature

**Scenario:** "ต้องการเพิ่มฟีเจอร์ export data เป็น PDF"

**Step-by-step with Agents:**

1. **Plan & Design** (Documentation Agent)
   ```
   Request: "เขียน requirement สำหรับ PDF export feature"
   Agent creates: PRD, API design, UI mockup
   ```

2. **Backend Development** (Backend Agent)
   ```
   Request: "สร้าง API endpoint POST /api/reports/export-pdf"
   Agent creates: 
   - Controller method
   - Service layer
   - Prisma queries
   - Unit tests
   ```

3. **Frontend Development** (Frontend Agent)
   ```
   Request: "สร้าง component สำหรับ PDF export"
   Agent creates:
   - Vue component with form
   - API integration
   - Error handling
   - Tailwind styling
   ```

4. **Testing** (Testing Agent)
   ```
   Request: "เขียน E2E test สำหรับ PDF export"
   Agent creates: Playwright tests
   ```

5. **Deployment** (DevOps Agent)
   ```
   Request: "ปรับปรุง docker setup สำหรับ feature ใหม่"
   Agent updates: docker-compose.yml, Dockerfile
   ```

---

### Workflow 2: Bug Fix

**Scenario:** "API endpoint สำหรับวิเคราะห์ข้อมูลเสีย"

**Step-by-step:**

1. **Diagnosis** (Backend Agent)
   ```
   Request: "ตรวจหา bug ในการคำนวณค่าเฉลี่ยคะแนน"
   Agent investigates: Logs, queries, data flow
   ```

2. **Fix** (Backend Agent)
   ```
   Request: "แก้ไข bug และเพิ่ม test case"
   Agent fixes: Code, unit tests
   ```

3. **Verification** (Testing Agent)
   ```
   Request: "ทดสอบ bug fix"
   Agent verifies: Unit tests, integration tests
   ```

4. **Deploy** (DevOps Agent)
   ```
   Request: "ปรับใช้ fix บน production"
   Agent deploys: Build, push, restart services
   ```

---

### Workflow 3: Performance Optimization

**Scenario:** "Dashboard โหลดช้า"

**Step-by-step:**

1. **Profile** (Performance Agent)
   ```
   Request: "วิเคราะห์ performance issue ใน dashboard"
   Agent identifies: Slow queries, large payloads
   ```

2. **Optimize Backend** (Backend Agent + Performance Agent)
   ```
   Request: "ปรับปรุง API query สำหรับ analytics"
   Agent optimizes: Adds indexes, pagination, caching
   ```

3. **Optimize Frontend** (Frontend Agent + Performance Agent)
   ```
   Request: "ลด bundle size และปรับปรุง render"
   Agent optimizes: Code splitting, lazy loading, memoization
   ```

4. **Test** (Testing Agent)
   ```
   Request: "ทดสอบ performance improvement"
   Agent measures: Response time, load time
   ```

---

## 🧪 Testing & Quality Assurance

### Unit Tests (Backend)

**Trigger:** "เขียน unit test สำหรับ controller..."

```bash
# Agent will create:
tests/unit/analyticsController.test.js
tests/unit/userService.test.js
```

### E2E Tests (Frontend)

**Trigger:** "เขียน E2E test สำหรับ survey flow..."

```bash
# Agent will create:
tests/e2e/survey-complete.spec.ts
tests/e2e/analytics-dashboard.spec.ts
```

### Test Coverage

**Goal:** > 80% code coverage

**Commands:**
```bash
# Backend tests
npm run test

# Frontend E2E tests
npm run test:e2e

# Coverage report
npm run coverage
```

---

## 🚀 Deployment & DevOps

### Development Environment

**Start Dev Containers:**
```bash
make dev
# or
docker-compose -f docker-compose.dev.yml up
```

**Services running:**
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- MySQL: localhost:3307

### Production Environment

**Build Production Images:**
```bash
make prod-build
# or
docker-compose -f docker-compose.yml up -d
```

**Services:**
- Backend: http://localhost:5000
- Frontend: http://localhost:80
- MySQL: Internal network

### Database Migrations

**Agent:** "ปรับใช้ migration บน production"

```bash
# Auto-run via docker-compose command
npx prisma migrate deploy
```

### Backup & Recovery

**Agent:** "สร้างสคริปต์ backup database"

```bash
# Agent creates backup script
scripts/backup-db.sh
```

---

## 🔧 Troubleshooting & Problem Solving

### Common Issues

#### 1. Database Connection Error

**Trigger:** "Database connect ไม่ได้"

**Agent Diagnostics:**
- Check MySQL health
- Verify DATABASE_URL
- Test connection string
- Check port availability

#### 2. API Timeout

**Trigger:** "API timeout เมื่อดึงข้อมูล analytics"

**Agent Diagnostics:**
- Profile slow queries
- Check server logs
- Monitor memory usage
- Identify N+1 queries

#### 3. Frontend Build Error

**Trigger:** "Build error ใน frontend"

**Agent Diagnostics:**
- Check TypeScript compilation
- Verify Vue component syntax
- Check import paths
- Review package dependencies

#### 4. Docker Network Issues

**Trigger:** "Backend ไม่สามารถเชื่อมต่อ MySQL ใน Docker"

**Agent Diagnostics:**
- Verify network config
- Check container health
- Test network connectivity
- Review port mappings

---

## 📋 Common Use Cases

### Use Case 1: Add New Survey Category

**User Request:** "เพิ่มหมวดหมู่คำถามใหม่ชื่อ 'Safety Leadership'"

**Agents Involved:**
1. Backend Agent: Create API endpoints for category CRUD
2. Frontend Agent: Create category management UI
3. Database Agent: Update Prisma schema
4. Testing Agent: Write tests

**Estimated Time:** 2-4 hours

---

### Use Case 2: Fix Authentication Bug

**User Request:** "บาง user ไม่สามารถ login ได้"

**Agents Involved:**
1. Backend Agent: Debug authentication middleware
2. Database Agent: Check user data
3. Security Agent: Verify token handling
4. Testing Agent: Write regression tests

**Estimated Time:** 1-2 hours

---

### Use Case 3: Improve Analytics Performance

**User Request:** "Analytics dashboard โหลดช้า"

**Agents Involved:**
1. Performance Agent: Profile slow queries
2. Backend Agent: Optimize queries & add caching
3. Frontend Agent: Optimize chart rendering
4. Testing Agent: Benchmark improvements

**Estimated Time:** 4-6 hours

---

### Use Case 4: Add Email Notification

**User Request:** "ส่ง email เมื่อ user ทำ survey เสร็จ"

**Agents Involved:**
1. Backend Agent: Implement email service
2. Database Agent: Add email templates table
3. Security Agent: Secure email credentials
4. Testing Agent: Mock email sending

**Estimated Time:** 3-5 hours

---

## 🎯 Agent Communication Best Practices

### When to Use Each Agent

| Situation | Agent | Example |
|-----------|-------|---------|
| API endpoint problem | Backend | "แก้ไข GET /api/analytics" |
| UI component issue | Frontend | "สร้าง component filter" |
| Query too slow | Database | "ปรับปรุง query ข้อมูลผู้ใช้" |
| Test coverage low | Testing | "เพิ่ม unit test" |
| Container issue | DevOps | "แก้ไข docker-compose" |
| Slow performance | Performance | "ปรับปรุง load time" |
| Security concern | Security | "ตรวจสอบ SQL injection" |
| Update README | Documentation | "เขียน API guide" |

### Tips for Effective Agent Use

1. **Be Specific**
   ❌ "แก้ไข bug"
   ✅ "แก้ไข bug เมื่อวันที่ filter ไม่ทำงาน"

2. **Provide Context**
   ❌ "สร้าง API"
   ✅ "สร้าง API สำหรับดึงข้อมูล survey ตามแผนก โดยมี pagination"

3. **Define Success Criteria**
   ❌ "ปรับปรุง performance"
   ✅ "ปรับปรุง API response time จาก 5000ms เหลือ < 1000ms"

4. **Request Tests**
   ❌ "เพิ่ม feature"
   ✅ "เพิ่ม feature พร้อมกับ unit test และ E2E test"

---

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| API Endpoints | 50+ |
| Database Models | 10+ |
| Vue Components | 30+ |
| Test Cases | 100+ |
| Docker Services | 3 (MySQL, Backend, Frontend) |
| Supported Companies | Unlimited |
| Survey Questions | 100+ |

---

## 🔗 Related Documentation

- [README.md](./README.md) - Project overview
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation guide
- [GRAPH_AND_CALCULATION_FILES.md](./GRAPH_AND_CALCULATION_FILES.md) - Analytics calculations

---

## 📞 Support & Questions

สำหรับคำถามหรือประเด็นที่ไม่ชัดเจน ให้ใช้หัวข้อ:

1. **Bug Reports** → Backend Agent + Testing Agent
2. **Feature Requests** → Planning + All Agents
3. **Performance Issues** → Performance Agent + relevant Agent
4. **Deployment Issues** → DevOps Agent
5. **Documentation** → Documentation Agent

---

**Last Updated:** May 17, 2026  
**Version:** 1.0.0  
**Maintainer:** Development Team

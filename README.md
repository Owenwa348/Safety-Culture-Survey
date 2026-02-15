# Safety Culture Survey Platform 🛡️

**แพลตฟอร์มแบบประเมินวัฒนธรรมความปลอดภัยภายในองค์กร**

ระบบบริหารจัดการและวิเคราะห์แบบสอบถามวัฒนธรรมความปลอดภัยองค์กร (Safety Culture Maturity Survey) แบบครบวงจร พัฒนาด้วย **Node.js**, **Express**, **Vue 3**, **Prisma ORM** และ **MySQL** รองรับการประเมินแบบ 3 ระดับผู้ใช้งาน (User/Admin/SuperAdmin) พร้อมระบบวิเคราะห์ข้อมูลและแสดงผลแบบ real-time

---

## 📋 สารบัญ

1. [ภาพรวมโปรเจค](#ภาพรวมโปรเจค)
2. [สถาปัตยกรรมระบบ](#สถาปัตยกรรมระบบ)
3. [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
4. [โครงสร้างฐานข้อมูล](#โครงสร้างฐานข้อมูล)
5. [API Endpoints](#api-endpoints)
6. [Business Logic](#business-logic)
7. [Authentication & Authorization](#authentication--authorization)
8. [Frontend Architecture](#frontend-architecture)
9. [Analytics & Reporting](#analytics--reporting)
10. [การติดตั้งและใช้งาน](#การติดตั้งและใช้งาน)
11. [Docker Deployment](#docker-deployment)
12. [Security Considerations](#security-considerations)

---

## ภาพรวมโปรเจค

### วัตถุประสงค์
ระบบนี้ถูกพัฒนาขึ้นเพื่อ:
- **ประเมินระดับวัฒนธรรมความปลอดภัย** ภายในองค์กรแบบ structured survey
- **วิเคราะห์ข้อมูล** แบบแบ่งกลุ่มตาม Department, Position, WorkGroup, Experience
- **แสดงผลกราฟ** แบบ real-time (Horizontal Bar Chart, Stacked Bar Chart)
- **จัดการผู้ใช้งาน** แบบ multi-company และ multi-role
- **Seed ข้อมูลตัวอย่าง** สำหรับ testing และ demo

### คุณสมบัติหลัก
✅ **3-Tier Authentication**: User (Evaluator) / Admin / SuperAdmin  
✅ **Survey System**: คำถามแบบ 1-5 rating scale (Current vs Future)  
✅ **Excel Import**: อัปโหลดรายชื่อผู้ใช้จากไฟล์ Excel  
✅ **Master Data Management**: หมวดหมู่, คำถาม, ตัวเลือก, แผนก, ตำแหน่ง  
✅ **Analytics Dashboard**: กราฟแสดงผลแยกตามบริษัท, ตำแหน่ง, แผนก  
✅ **Docker Support**: รองรับทั้ง Development (hot reload) และ Production  
✅ **Responsive Design**: ใช้ Tailwind CSS รองรับทุกอุปกรณ์  

---

## สถาปัตยกรรมระบบ

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Frontend      │◄────►│    Backend       │◄────►│   MySQL DB      │
│   Vue 3 + Vite  │ HTTP │  Express + Node  │ ORM  │   Prisma        │
│   Port 5173     │      │  Port 5000       │      │   Port 3307     │
└─────────────────┘      └──────────────────┘      └─────────────────┘
        │                         │
        │                         ├──► bcryptjs (Password Hashing)
        │                         ├──► CORS (Multi-origin support)
        │                         └──► Multer (Excel Upload)
        │
        ├──► Vue Router (Navigation)
        ├──► Axios (HTTP Client)
        ├──► Chart.js (Data Visualization)
        └──► Pinia (State Management)
```

### Architecture Pattern
- **3-Tier Architecture**: Frontend / Backend API / Database
- **RESTful API**: Stateless HTTP endpoints
- **MVC Pattern**: Controller-based routing
- **ORM**: Prisma Client สำหรับ database operations

---

## เทคโนโลยีที่ใช้

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20 Alpine | JavaScript runtime |
| Express.js | 5.1.0 | Web framework |
| Prisma ORM | 6.16.3 | Database ORM |
| MySQL | 8.0 | Relational database |
| bcryptjs | 3.0.2 | Password hashing |
| cors | 2.8.5 | Cross-origin resource sharing |
| multer | 1.4.5-lts.1 | File upload middleware |
| exceljs | 4.4.0 | Excel file parsing |

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Vue.js | 3.5.18 | Progressive JavaScript framework |
| Vite | 7.1.2 | Build tool & dev server |
| TypeScript | 5.8.3 | Type safety |
| Vue Router | 4.5.1 | Client-side routing |
| Pinia | 3.0.3 | State management |
| Axios | 1.12.2 | HTTP client |
| Chart.js | 4.5.0 | Data visualization |
| Tailwind CSS | 4.1.13 | Utility-first CSS |

### DevOps
- **Docker** + **Docker Compose** (containerization)
- **Nginx** (production web server)
- **nodemon** (development hot reload)
- **Vite HMR** (frontend hot module replacement)

---

## โครงสร้างฐานข้อมูล

### Database Schema (15 Models)

#### 1. **Authentication Models**

##### `user_excel`
รายชื่อผู้มีสิทธิ์ใช้งานระบบ (อัปโหลดจาก Excel)
```prisma
model user_excel {
  id             Int      @id @default(autoincrement())
  email_user     String   @unique
  company_user   String
  division_user  String?
  createdAt      DateTime @default(now())
}
```

##### `User`
ผู้ใช้งานที่ลงทะเบียนแล้ว (Evaluator)
```prisma
model User {
  id                Int      @id @default(autoincrement())
  title_user        String?
  name_user         String
  email_user        String   @unique
  company_user      String
  phone_user        String?
  password_user     String?
  position_user     String?
  job_field_user    String?   // แผนก/สายงาน
  work_group_user   String?   // กลุ่มงาน
  years_of_service  String?   // ประสบการณ์
  section_user      String?   // ฝ่าย/แผนกย่อย
  role_user         String   @default("user")
  status            String   @default("registered")  // registered, active, inactive
  surveyStatus      String   @default("not_started") // not_started, in_progress, done
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  surveyAnswers     SurveyAnswer[]
}
```

##### `AdminList`
ผู้ดูแลระบบระดับบริษัท
```prisma
model AdminList {
  id          Int       @id @default(autoincrement())
  email       String    @unique
  companyName String
  firstName   String?
  lastName    String?
  phone       String?
  password    String?   // bcrypt hashed
  role        String    @default("Admin")
  status      String    @default("PENDING")  // PENDING, ACTIVE
  joinedAt    DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

##### `SuperAdminList`
ผู้ดูแลระบบระดับสูงสุด
```prisma
model SuperAdminList {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  phone     String?   @unique
  pin       String?   // 6-digit PIN (bcrypt hashed)
  password  String?   // bcrypt hashed
  role      String    @default("Super Admin")
  status    String    @default("PENDING")  // PENDING, ACTIVE
  lastLogin DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

#### 2. **Master Data Models**

##### `Department`
สายงาน/แผนกหลัก (เช่น CEO, REP, COO, CFO, SSE, PSE, CME)
```prisma
model Department {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

##### `Experience`
ระดับประสบการณ์ทำงาน (เช่น 0-3 ปี, 3-5 ปี, 5-10 ปี, 10-15 ปี, 15+ ปี)
```prisma
model Experience {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

##### `Position`
ตำแหน่งงาน (เช่น ผู้บริหารระดับสูง, ผู้จัดการ, พนักงาน, ผู้รับเหมา)
```prisma
model Position {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

##### `WorkGroup`
กลุ่มงาน (เช่น Operation, Maintenance, Engineering, Supporting)
```prisma
model WorkGroup {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### 3. **Survey Content Models**

##### `Category`
หมวดหมู่คำถาม (เช่น Leadership & Vision, Risk Management, Communication)
```prisma
model Category {
  id         Int         @id @default(autoincrement())
  name       String
  questions  Question[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}
```

##### `Question`
คำถามในแบบสอบถาม
```prisma
model Question {
  id          Int        @id @default(autoincrement())
  text        String
  categoryId  Int
  category    Category   @relation(fields: [categoryId], references: [id])
  options     Option[]
  order       Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  surveyAnswers SurveyAnswer[]
}
```

##### `Option`
ตัวเลือกคำตอบ (1-5 rating scale)
```prisma
model Option {
  id          Int        @id @default(autoincrement())
  text        String
  questionId  Int
  question    Question   @relation(fields: [questionId], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

#### 4. **Survey Response Model**

##### `SurveyAnswer`
คำตอบของผู้ใช้แต่ละข้อ
```prisma
model SurveyAnswer {
  id                 Int      @id @default(autoincrement())
  userId             Int
  user               User     @relation(fields: [userId], references: [id])
  questionId         Int
  question           Question @relation(fields: [questionId], references: [id])
  currentScore       Int      // 1-5: คะแนนสถานการณ์ปัจจุบัน
  expectedScore      Int      // 1-5: คะแนนคาดหวังในอนาคต
  comment            String?  // ความคิดเห็นเพิ่มเติม
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@unique([userId, questionId])  // User ตอบได้คำถามละ 1 ครั้ง
}
```

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  user_excel  │       │     User     │       │ SurveyAnswer │
│              │       │              │──────►│              │
│ - email      │       │ - email      │ 1   M │ - userId     │
│ - company    │       │ - company    │       │ - questionId │
└──────────────┘       │ - status     │       │ - current    │
                       │ - surveyStatus       │ - expected   │
                       └──────────────┘       │ - comment    │
                                              └──────┬───────┘
                                                     │
                                                     │ M
                       ┌──────────────┐       ┌─────▼────────┐
                       │   Category   │       │   Question   │
                       │              │──────►│              │
                       │ - name       │ 1   M │ - text       │
                       └──────────────┘       │ - order      │
                                              └──────┬───────┘
                                                     │
                                                     │ 1
                                              ┌─────▼────────┐
                                              │    Option    │
                                              │              │
                                              │ - text       │
                                              └──────────────┘
```

---

## API Endpoints

### 📁 API Groups (13 ชุด)

#### 1. **Excel Upload** (`/excel-upload`)
```http
POST /excel-upload/upload
Content-Type: multipart/form-data

Body: file (Excel file)
```
**Logic:**
- รับไฟล์ Excel ผ่าน multer middleware
- Parse ด้วย ExcelJS (อ่าน sheet แรก, skip header row)
- Upsert ข้อมูลลง `user_excel` table (update ถ้า email ซ้ำ)

#### 2. **Company Management** (`/api/companies`)
```http
GET /api/companies                    # ดึงรายชื่อบริษัททั้งหมด (distinct)
POST /api/companies                   # เพิ่มบริษัทใหม่
PUT /api/companies/:id                # แก้ไขบริษัท
DELETE /api/companies/:id             # ลบบริษัท
```

#### 3. **Admin Authentication** (`/api/admin`)
```http
POST /api/admin/add                   # SuperAdmin เพิ่ม Admin ใหม่
GET /api/admin/list                   # ดึงรายชื่อ Admin ทั้งหมด
POST /api/admin/check-email           # ตรวจสอบ email ก่อนตั้งรหัสผ่าน
PUT /api/admin/setup-account          # Admin ตั้งรหัสผ่านครั้งแรก
POST /api/admin/login                 # Admin login
POST /api/admin/verify-reset          # ยืนยันตัวตนสำหรับรีเซ็ตรหัสผ่าน
PUT /api/admin/reset-password         # รีเซ็ตรหัสผ่าน
PUT /api/admin/update/:id             # แก้ไขข้อมูล Admin
PUT /api/admin/status/:id             # เปลี่ยนสถานะ Admin (ACTIVE/PENDING)
DELETE /api/admin/delete/:id          # ลบ Admin
```

**Admin Authentication Logic:**
1. **Setup Flow:**
   - SuperAdmin เพิ่ม Admin โดยระบุ `email` + `companyName`
   - สถานะเริ่มต้น: `PENDING`
   - Admin เข้า `check-email` endpoint → ถ้าพบและ status = PENDING → redirect ไป setup form
   - Admin กรอก `firstName`, `lastName`, `phone`, `password` → เรียก `setup-account`
   - ระบบ hash password ด้วย bcrypt (salt 10 rounds) → เปลี่ยนสถานะเป็น `ACTIVE`

2. **Login Flow:**
   - Admin กรอก `email` + `password`
   - ระบบหา admin จาก email → ตรวจสอบ `status === 'ACTIVE'`
   - ใช้ `bcrypt.compare()` เปรียบเทียบรหัสผ่าน
   - Return: `{ role: 'Admin', email, companyName }`

#### 4. **SuperAdmin Management** (`/api/super-admins`)
```http
GET /api/super-admins                 # ดึงรายชื่อ SuperAdmin ทั้งหมด
POST /api/super-admins                # เพิ่ม SuperAdmin ใหม่
POST /api/super-admins/check-email    # ตรวจสอบ email + status
POST /api/super-admins/setup          # ตั้งค่าบัญชีครั้งแรก (PIN + Password)
POST /api/super-admins/login          # Login
POST /api/super-admins/verify-for-reset   # ยืนยันตัวตนด้วย email + phone + PIN
POST /api/super-admins/reset-password     # รีเซ็ตรหัสผ่าน
PUT /api/super-admins/:id             # แก้ไขข้อมูล
PUT /api/super-admins/status/:id      # เปลี่ยนสถานะ
DELETE /api/super-admins/:id          # ลบ SuperAdmin
```

**SuperAdmin Authentication Logic:**
1. **Setup Flow:**
   - เพิ่ม SuperAdmin ด้วย `email` → status = `PENDING`
   - Check email → ถ้าพบและ status = PENDING → แสดงฟอร์ม setup
   - กรอก `phone`, `pin` (6 หลัก), `password`
   - Hash ทั้ง PIN และ Password ด้วย bcrypt
   - เปลี่ยนสถานะเป็น `ACTIVE`

2. **Login Flow:**
   - กรอก `email` + `password`
   - ตรวจสอบ `status === 'ACTIVE'`
   - bcrypt compare password
   - Update `lastLogin` timestamp
   - Return: `{ role: 'Super Admin' }`

#### 5. **User Management** (`/api/users`)
```http
GET /api/users                        # ดึงรายชื่อผู้ใช้ทั้งหมด
POST /api/users/check-email           # ตรวจสอบ email ในระบบ user_excel
POST /api/users/register              # ลงทะเบียนผู้ใช้ใหม่
POST /api/users/login                 # User login
POST /api/users/forgot-password       # ขอรีเซ็ตรหัสผ่าน
POST /api/users/reset-password        # รีเซ็ตรหัสผ่าน
DELETE /api/users/by-email/:email     # ลบ User ด้วย email
```

**User Registration & Login Logic:**
1. **Registration Flow:**
   - User เข้าหน้า Login Evaluator → กรอก email
   - ระบบเรียก `check-email` → ค้นหาใน `user_excel` table
   - ถ้าพบ → redirect ไปหน้า Registration form
   - User กรอกข้อมูล: `name`, `phone`, `position`, `department`, `workGroup`, `workExperience`, `password`
   - Hash password ด้วย bcrypt
   - สร้างข้อมูลใน `User` table พร้อม:
     - `status = 'registered'`
     - `surveyStatus = 'not_started'`
     - `role_user = 'user'`

2. **Login Flow:**
   - กรอก `email` + `password`
   - หา user จาก `email_user`
   - bcrypt compare password
   - Return: `{ role: 'user', name, email, surveyStatus }`

#### 6. **Assessment** (`/api/assessment`)
```http
GET /api/assessment                   # ดึงข้อมูลคำถามทั้งหมดพร้อม options
POST /api/assessment/answer           # บันทึกคำตอบ
GET /api/assessment/answers/:userId   # ดึงคำตอบของ user นี้
GET /api/assessment/progress/:userId  # ดึงสถานะการทำแบบสอบถาม
```

**Survey Submission Logic:**
```javascript
POST /api/assessment/answer
Body: {
  userId: int,
  questionId: int,
  currentScore: int (1-5),
  expectedScore: int (1-5),
  comment: string (optional)
}
```

**Algorithm:**
1. Validate input: `userId`, `questionId`, `currentScore`, `expectedScore` (1-5)
2. Upsert `SurveyAnswer`:
   - ถ้ามีข้อมูลเดิม (userId + questionId) → UPDATE
   - ถ้าไม่มี → CREATE
3. นับจำนวนคำถามที่ตอบแล้ว vs คำถามทั้งหมด
4. Update `User.surveyStatus`:
   - ถ้าตอบครบทุกข้อ → `done`
   - ถ้าตอบแล้วบางข้อ → `in_progress`
   - ถ้ายังไม่ตอบเลย → `not_started`
5. Return: saved answer + updated user status

**Auto-save Feature (Frontend):**
- ใช้ `localStorage` เก็บคำตอบชั่วคราว
- Watch `answers` array → debounce 1 วินาที → save to localStorage
- เมื่อ refresh หน้า → restore จาก localStorage
- เมื่อกด Submit → POST ทุกคำตอบไป backend → ลบ localStorage

#### 7. **Analytics** (`/api/analytics`)
```http
GET /api/analytics/survey-data       # ข้อมูลกราฟแยกตามคะแนน 1-5
GET /api/analytics/aggregated        # ข้อมูลรวมทั้งหมด (avg scores)
GET /api/analytics/demographic       # วิเคราะห์ตามกลุ่มประชากร
GET /api/analytics/trend             # แนวโน้มตามเวลา (รายเดือน)
GET /api/analytics/user-completion   # สถานะการทำแบบสอบถามของ User
GET /api/analytics/stacked-chart     # ข้อมูลสำหรับ Stacked Bar Chart
GET /api/analytics/companies         # รายชื่อบริษัททั้งหมด
GET /api/analytics/assessment-years  # รายการปีที่มีข้อมูล
GET /api/analytics/question-results  # ผลลัพธ์แยกตามคำถาม
GET /api/analytics/workgroup-raw     # ข้อมูลดิบแยกตาม WorkGroup
GET /api/analytics/workgroup-evaluation  # ข้อมูลประเมินแยกตาม WorkGroup
GET /api/analytics/evaluation-data   # ข้อมูลประเมินแบบ General
```

**Analytics Algorithm Example: `getSurveyDataForChart`**
```javascript
// ดึงข้อมูลคำตอบแยกตามคะแนน 1-5 สำหรับคำถามเฉพาะ
GET /api/analytics/survey-data?questionId=1&companyId=combined&year=2025

Algorithm:
1. Validate: questionId required
2. Build WHERE condition:
   - Filter by questionId
   - Filter by companyId (if not 'combined')
   - Filter by year (startOfYear to endOfYear)
3. Fetch SurveyAnswers พร้อม user.company_user
4. Initialize count arrays:
   - current = [0, 0, 0, 0, 0]  // คะแนน 1-5
   - future = [0, 0, 0, 0, 0]
5. Loop through answers:
   - นับ currentScore → current[score - 1]++
   - นับ expectedScore → future[score - 1]++
6. Return: {
     questionId,
     questionText,
     category: { id, name },
     companyId,
     current: [จำนวนคน score 1, 2, 3, 4, 5],
     future: [จำนวนคน score 1, 2, 3, 4, 5],
     totalResponses
   }
```

#### 8-11. **Master Data CRUD**
```http
# Department
GET /api/departments                  # ดึงรายชื่อแผนกทั้งหมด
POST /api/departments                 # เพิ่มแผนกใหม่
PUT /api/departments/:id              # แก้ไขแผนก
DELETE /api/departments/:id           # ลบแผนก

# Experience
GET /api/experiences                  # ดึงรายการประสบการณ์
POST /api/experiences                 # เพิ่มระดับประสบการณ์
PUT /api/experiences/:id              # แก้ไข
DELETE /api/experiences/:id           # ลบ

# Position
GET /api/positions                    # ดึงรายการตำแหน่ง
POST /api/positions                   # เพิ่มตำแหน่ง
PUT /api/positions/:id                # แก้ไข
DELETE /api/positions/:id             # ลบ

# WorkGroup
GET /api/workgroups                   # ดึงรายการกลุ่มงาน
POST /api/workgroups                  # เพิ่มกลุ่มงาน
PUT /api/workgroups/:id               # แก้ไข
DELETE /api/workgroups/:id            # ลบ
```

#### 12. **Category & Question Management** (`/api/categories`, `/api/questions`)
```http
# Category
GET /api/categories                   # ดึงหมวดหมู่ทั้งหมด (พร้อม questions)
POST /api/categories                  # เพิ่มหมวดหมู่ใหม่
PUT /api/categories/:id               # แก้ไขชื่อหมวดหมู่
DELETE /api/categories/:id            # ลบหมวดหมู่ (cascade delete questions + options)

# Question
GET /api/questions                    # ดึงคำถามทั้งหมด (พร้อม options + comments)
POST /api/questions                   # เพิ่มคำถามใหม่พร้อม options
PUT /api/questions/:id                # แก้ไขคำถาม + options
PUT /api/questions/:id/category       # ย้ายคำถามไปหมวดหมู่อื่น
PUT /api/questions/reorder            # เรียงลำดับคำถาม
DELETE /api/questions/:id             # ลบคำถาม (cascade delete options + answers)
```

**Question Ordering Logic:**
- ทุกคำถามมี `order` field (global order, ไม่ใช่แยกตาม category)
- เมื่อเพิ่มคำถามใหม่ → หา max(order) + 1
- เมื่อแก้ไข order → ถ้า newOrder < oldOrder → shift คำถามอื่นใน category ขึ้น (+1)
- เมื่อแก้ไข order → ถ้า newOrder > oldOrder → shift คำถามอื่นใน category ลง (-1)
- เมื่อย้าย category → เก็บ order เดิมไว้ (ไม่ reorder)

---

## Business Logic

### 1. **User Registration Flow**
```
┌────────────────────────────────────────────────────────────────────┐
│  User เข้าหน้าล็อกอิน → กรอก email → กดตรวจสอบ                         │
└─────────────────────────┬──────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│  Backend: POST /api/users/check-email                              │
│  - ค้นหา email ใน user_excel table                                 │
│  - ถ้าไม่พบ (404) → แสดง "อีเมลไม่มีสิทธิ์"                          │
│  - ถ้าพบแล้ว register (409) → redirect ไปหน้า Login                │
│  - ถ้าพบแต่ยังไม่ register (200) → redirect ไปหน้า Registration     │
└─────────────────────────┬──────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│  User กรอกข้อมูล: name, phone, position, department, etc.         │
│  + ตั้งรหัสผ่าน (ต้องตรงกับ confirm password)                       │
└─────────────────────────┬──────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│  Backend: POST /api/users/register                                 │
│  1. Hash password ด้วย bcrypt (10 rounds)                         │
│  2. Create User:                                                   │
│     - status = 'registered'                                        │
│     - surveyStatus = 'not_started'                                 │
│     - role_user = 'user'                                           │
│  3. Return user data                                               │
└─────────────────────────┬──────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│  Frontend: แสดงข้อความสำเร็จ → redirect ไปหน้า Login               │
└────────────────────────────────────────────────────────────────────┘
```

### 2. **Survey Assessment Flow**
```
┌────────────────────────────────────────────────────────────────────┐
│  User Login → router.push('/assessment')                          │
└─────────────────────────┬──────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│  Frontend: GET /api/assessment                                     │
│  - ดึง categories + questions + options                           │
│  - Flatten เป็น array of questions                                │
│  - Initialize answers array (length = questions.length)           │
│  - Check localStorage สำหรับ draft (key: `survey_draft_${userId}`)│
└─────────────────────────┬──────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│  User ทำแบบสอบถาม:                                                  │
│  - เลือก Radio button: currentScore (1-5)                          │
│  - เลือก Radio button: expectedScore (1-5)                         │
│  - พิมพ์ comment (optional)                                        │
│  - กด Next → currentIndex++                                        │
│  - Auto-save ไป localStorage ทุก 1 วินาที (debounce)              │
└─────────────────────────┬──────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────────┐
│  User กด Submit ข้อสุดท้าย:                                         │
│  - Validate: ทุกคำถามต้องมี currentScore + expectedScore           │
│  - Loop: POST /api/assessment/answer สำหรับแต่ละคำถาม             │
│  - Backend: Upsert SurveyAnswer (unique: userId + questionId)     │
│  - Backend: Update User.surveyStatus → 'done'                     │
│  - Frontend: ลบ localStorage → แสดงข้อความสำเร็จ → redirect /home  │
└────────────────────────────────────────────────────────────────────┘
```

### 3. **Analytics Calculation**

#### Score Distribution Algorithm
```javascript
// นับจำนวนคนที่ให้คะแนนแต่ละระดับ (1-5)
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

#### Stacked Bar Chart Data Preparation
```javascript
// สำหรับ Stacked Bar Chart: แสดงคำถามทุกข้อแยกตามระดับ 1-5
GET /api/analytics/stacked-chart?areaId=combined&year=2025

Algorithm:
1. Fetch categories + questions (ordered by question.order)
2. Build WHERE: questionIds, company filter, year filter
3. Fetch all SurveyAnswers
4. Initialize dataByQuestion = {
     questionId: { current: [0,0,0,0,0], future: [0,0,0,0,0] }
   }
5. Loop surveyAnswers → นับคะแนนแต่ละระดับ
6. Prepare chart data:
   - labels = ["Q1: Category A", "Q2: Category A", "Q3: Category B", ...]
   - current = [
       [Q1-score1, Q2-score1, Q3-score1, ...],  // คน score 1
       [Q1-score2, Q2-score2, Q3-score2, ...],  // คน score 2
       ...
     ]
   - future = (same structure)
7. Return: { labels, current, future, areas, categories }
```

### 4. **Role-Based Access Control**

#### Route Guard (Frontend)
```javascript
// router/index.ts
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;

  // Protected routes
  if (to.path === '/dashboard' && userRole !== 'Admin') {
    return next('/');  // Redirect to login
  }
  if (to.path === '/settings' && userRole !== 'Super Admin') {
    return next('/');
  }
  if (to.path === '/assessment' && userRole !== 'user') {
    return next('/');
  }

  next();
});
```

#### Authorization Matrix
| Route | User (Evaluator) | Admin | SuperAdmin |
|-------|:----------------:|:-----:|:----------:|
| `/` (Login Evaluator) | ✅ | ❌ | ❌ |
| `/evaluator-registration` | ✅ | ❌ | ❌ |
| `/Login-all` | ❌ | ✅ | ✅ |
| `/assessment` | ✅ | ❌ | ❌ |
| `/home` | ✅ | ❌ | ❌ |
| `/dashboard` | ❌ | ✅ | ❌ |
| `/settings` | ❌ | ❌ | ✅ |
| `/admin` | ❌ | ✅ | ✅ |
| `/superadmin` | ❌ | ❌ | ✅ |

---

## Authentication & Authorization

### Password Hashing (bcrypt)
```javascript
const bcrypt = require('bcryptjs');

// Registration/Setup
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

// Login
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

### Session Storage
```javascript
// Frontend: localStorage (NO JWT)
localStorage.setItem('user', JSON.stringify({
  email: 'user@example.com',
  role: 'Admin',  // 'user', 'Admin', 'Super Admin'
  companyName: 'ACME Corp',
  firstName: 'John',
  lastName: 'Doe'
}));

// Access user data
const user = JSON.parse(localStorage.getItem('user') || '{}');
```

⚠️ **Security Note:** 
โปรเจคนี้ยังไม่ใช้ JWT หรือ Session-based authentication ซึ่งอาจมีความเสี่ยงด้านความปลอดภัย (ดู [Security Considerations](#security-considerations))

### SuperAdmin PIN System
- SuperAdmin มี 2-step authentication:
  1. **Setup**: email + phone + PIN (6 digits) + password
  2. **Login**: email + password
  3. **Password Reset**: email + phone + PIN (ยืนยันตัวตน) → ตั้งรหัสใหม่

---

## Frontend Architecture

### Component Structure
```
src/
│
├── components/
│   ├── NavBar.vue                    # Top navigation (User side)
│   ├── Footer.vue                    # Bottom footer
│   └── NavbarDashboard.vue           # Admin/SuperAdmin navigation
│
├── views/
│   │
│   ├── Login/
│   │   ├── LoginEvaluator/
│   │   │   ├── LoginEvaluator.vue           # User login form
│   │   │   ├── EvaluatorRegistration.vue    # User registration
│   │   │   └── ForgotPasswordEvaluator.vue  # Password reset
│   │   │
│   │   └── Administrator/
│   │       ├── LoginAll.vue                 # Admin/SuperAdmin unified login
│   │       ├── SetPasswordAdmin.vue         # Admin first-time setup
│   │       └── SetPasswordSuperAdmin.vue    # SuperAdmin first-time setup
│   │
│   ├── Assessor/
│   │   └── PageAssessment/
│   │       ├── Assessment.vue               # Main survey form
│   │       └── data/
│   │           └── questions.js             # Static question data (unused?)
│   │
│   ├── Dashboard/
│   │   ├── DashboardView.vue                # Admin dashboard home
│   │   ├── Users/
│   │   │   ├── UserList.vue                 # Users (Evaluators)
│   │   │   ├── AdminList.vue                # Admin management
│   │   │   └── SuperAdmin/
│   │   │       └── SuperAdminList.vue       # SuperAdmin management
│   │   │
│   │   ├── Analytics/
│   │   │   ├── QuestionResults.vue          # Stacked bar chart
│   │   │   ├── OpinionResults.vue           # Comment display
│   │   │   └── WorkGroupEvaluationResults.vue  # WorkGroup analysis
│   │   │
│   │   ├── Showgraph/
│   │   │   ├── StackedBar.vue               # Stacked bar component
│   │   │   └── HorizontalBarChart.vue       # Horizontal bar component
│   │   │
│   │   ├── SettingsDashboard/
│   │   │   ├── SettingsView.vue             # SuperAdmin settings home
│   │   │   ├── ExcelUploadView.vue          # Upload user list
│   │   │   ├── InquiryManagement.vue        # Contact form management
│   │   │   └── EditQuestions/
│   │   │       ├── EditQuestions.vue        # Question editor
│   │   │       └── Questions.js             # Question data helper
│   │   │
│   │   └── CompanyManagement.vue            # Company CRUD
│   │
│   └── other/
│       ├── Home.vue                         # User home page
│       ├── AboutUs.vue                      # About page
│       ├── Contact.vue                      # Contact form
│       └── NotFound.vue                     # 404 page
│
└── router/
    └── index.ts                             # Vue Router config
```

### Key Frontend Features

#### 1. **State Management**
```javascript
// Pinia Store (example)
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isAuthenticated: false,
    surveyProgress: 0
  }),
  actions: {
    setUser(user) {
      this.currentUser = user;
      this.isAuthenticated = true;
    },
    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
    }
  }
});
```

#### 2. **Chart Integration (Chart.js)**
```vue
<!-- StackedBar.vue -->
<script setup>
import { defineProps, watch, ref, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const props = defineProps({
  chartData: Object,
  options: Object
});

// Chart configuration
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true },
    y: { stacked: true, beginAtZero: true }
  },
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Survey Results' }
  }
};
</script>
```

#### 3. **API Service Layer**
```javascript
// services/api.js (example)
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor สำหรับ error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default {
  // Assessment
  getAssessmentData: () => apiClient.get('/assessment'),
  submitAnswer: (data) => apiClient.post('/assessment/answer', data),
  
  // Analytics
  getSurveyData: (params) => apiClient.get('/analytics/survey-data', { params }),
  getCompanies: () => apiClient.get('/companies'),
  
  // Auth
  loginUser: (credentials) => apiClient.post('/users/login', credentials),
  registerUser: (data) => apiClient.post('/users/register', data)
};
```

---

## Analytics & Reporting

### Dashboard Features

#### 1. **Question Results (Stacked Bar Chart)**
- แสดงผลการตอบคำถามทุกข้อแยกตามระดับ 1-5
- Filter by: Company, Position, Year
- Toggle: Compare (Current vs Future) / Current only / Future only
- Data source: `GET /api/analytics/stacked-chart`

#### 2. **Opinion Results**
- แสดง comments จากผู้ใช้ทุกคน (ที่กรอก comment)
- Group by: Question
- Data: `GET /api/questions` (include surveyAnswers.comment)

#### 3. **WorkGroup Evaluation**
- วิเคราะห์ข้อมูลแยกตาม WorkGroup (Operation, Maintenance, Engineering, Supporting)
- แสดงค่าเฉลี่ย currentScore และ expectedScore ของแต่ละ category
- Radar chart หรือ Bar chart
- Data source: `GET /api/analytics/workgroup-evaluation`

#### 4. **User Completion Status**
- แสดงรายชื่อผู้ใช้พร้อมสถานะการทำแบบสอบถาม:
  - ✅ `done`: ทำเสร็จแล้ว
  - 🔄 `in_progress`: กำลังทำ
  - ⏸️ `not_started`: ยังไม่เริ่มทำ
  - ❌ `not_registered`: อยู่ใน user_excel แต่ยังไม่ลงทะเบียน
- Data source: `GET /api/analytics/user-completion`

### Chart Color Scheme
```javascript
// คะแนน 1-5 ใช้สีแยกตาม severity
const scoreColors = {
  1: '#ef4444',  // Red (ไม่ดี)
  2: '#f97316',  // Orange (พอใช้)
  3: '#eab308',  // Yellow (ปานกลาง)
  4: '#84cc16',  // Lime (ดี)
  5: '#22c55e'   // Green (ดีมาก)
};

// Current vs Future
const versionColors = {
  current: '#3b82f6',   // Blue
  future: '#8b5cf6'     // Purple
};
```

---

## การติดตั้งและใช้งาน

### Prerequisites
- **Node.js** 20.x หรือใหม่กว่า
- **npm** 10.x หรือใหม่กว่า
- **MySQL** 8.0 หรือใหม่กว่า
- **Docker** + **Docker Compose** (optional, แนะนำ)

### 1. Clone Repository
```bash
git clone <repository-url>
cd Safety-Culture-Survey
```

### 2. Backend Setup
```bash
cd "Backend Safety-Culture-Survey"

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env
cat > .env << EOF
DATABASE_URL="mysql://user:password@localhost:3307/survey_db"
PORT=5000
EOF

# Generate Prisma Client
npx prisma generate

# รัน migrations
npx prisma migrate deploy

# Seed ข้อมูล (SuperAdmin + ตัวอย่าง)
npx prisma db seed

# เริ่มต้น development server
npm run dev
```

**Seed Data:**
- **SuperAdmin:**
  - Email: `superadmin@tunwa.com`
  - Password: `Admin@123`
  - PIN: `123456`

### 3. Frontend Setup
```bash
cd "Frontend Safety-Culture-Survey"

# ติดตั้ง dependencies
npm install

# เริ่มต้น Vite dev server
npm run dev
```

เปิดเบราว์เซอร์: `http://localhost:5173`

### 4. Database Setup (Manual)
```sql
-- สร้างฐานข้อมูล
CREATE DATABASE survey_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ตรวจสอบ
USE survey_db;
SHOW TABLES;
```

---

## Docker Deployment

### Development Mode (Hot Reload)
```bash
# ใช้ package.json scripts
npm run dev

# หรือใช้ Makefile
make dev

# หรือใช้ docker-compose โดยตรง
docker-compose -f docker-compose.dev.yml up --build
```

**Services:**
- **Frontend**: `http://localhost:5173` (Vite dev server + HMR)
- **Backend**: `http://localhost:5000` (nodemon auto-restart)
- **MySQL**: `localhost:3307`

**Hot Reload:**
- Frontend: Vite HMR (instant update)
- Backend: nodemon watches `server.js`, `controllers/*`, `routes/*`, `prisma/schema.prisma`

### Production Mode
```bash
# ใช้ package.json scripts
npm run prod

# หรือใช้ Makefile
make prod

# หรือใช้ docker-compose โดยตรง
docker-compose up --build
```

**Services:**
- **Frontend**: `http://localhost` (Nginx serving static files)
- **Backend**: `http://localhost:5000` (Node.js production)
- **MySQL**: `localhost:3307`

**Nginx Configuration:**
```nginx
# frontend/nginx.conf
server {
  listen 80;
  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Proxy API requests to backend
  location /api/ {
    proxy_pass http://backend:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### Docker Management Commands
```bash
# Start services
npm run dev          # Development mode
npm run prod         # Production mode

# Stop services
npm run dev:down     # Stop dev containers
npm run prod:down    # Stop prod containers

# View logs
npm run dev:logs     # Dev logs
npm run prod:logs    # Prod logs

# Clean up
docker-compose down -v          # Remove containers + volumes
docker system prune -a --volumes  # Remove all unused Docker data
```

### Environment Variables
```env
# .env (Backend)
DATABASE_URL="mysql://root:rootpassword@mysql:3306/survey_db"
PORT=5000
NODE_ENV=production
```

---

## Security Considerations

### ⚠️ Current Security Issues

#### 1. **No JWT Authentication**
- ใช้ localStorage เก็บ user data โดยไม่มี token
- ไม่มี session expiration
- API endpoints ไม่มี authentication middleware

**Recommendation:**
```javascript
// ควรเพิ่ม JWT
const jwt = require('jsonwebtoken');

// Login response
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

#### 2. **CORS Configuration**
- อนุญาตทุก origin ใน development
- ควร whitelist specific domains ใน production

#### 3. **Input Validation**
- ไม่มี validation middleware (เช่น Joi, express-validator)
- ควรเพิ่ม schema validation สำหรับ request body

#### 4. **Rate Limiting**
- ไม่มี rate limiting สำหรับ login endpoints
- เสี่ยงต่อ brute force attacks

**Recommendation:**
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // 5 requests
  message: 'Too many login attempts, please try again later.'
});

app.post('/api/users/login', loginLimiter, loginUser);
```

#### 5. **SQL Injection**
- Prisma ORM ป้องกัน SQL injection โดยอัตโนมัติ ✅
- แต่ต้องระวังการใช้ `$queryRaw` (ควรใช้ parameterized queries)

#### 6. **Password Policy**
- ไม่มีข้อกำหนดความแข็งแรงของรหัสผ่าน
- ควรกำหนด minimum length, complexity requirements

### ✅ Security Best Practices (Implemented)
- ✅ Password hashing ด้วย bcrypt (salt rounds 10)
- ✅ HTTPS-ready (nginx สามารถเพิ่ม SSL certificate ได้)
- ✅ ใช้ environment variables สำหรับ sensitive data
- ✅ Prisma ORM ป้องกัน SQL injection
- ✅ CORS configuration (multi-origin support)

---

## File Structure Summary

```
Safety-Culture-Survey/
│
├── Backend Safety-Culture-Survey/
│   ├── server.js                     # Express server entry point
│   ├── package.json                  # Dependencies
│   ├── .env                          # Environment variables (gitignored)
│   ├── .env.example                  # Template for .env
│   │
│   ├── controllers/                  # Business logic
│   │   ├── Admin/
│   │   │   └── adminAuthController.js
│   │   ├── SuperAdmin/
│   │   │   └── superAdminController.js
│   │   ├── User/
│   │   │   └── userController.js
│   │   ├── Assessment/
│   │   │   └── assessmentController.js
│   │   ├── Analytics/
│   │   │   └── analyticsController.js
│   │   ├── Category/
│   │   │   └── categoryController.js
│   │   ├── Questions/
│   │   │   └── questionController.js
│   │   ├── Department/
│   │   │   └── departmentController.js
│   │   ├── Experience/
│   │   │   └── experienceController.js
│   │   ├── Position/
│   │   │   └── positionController.js
│   │   ├── Workgroup/
│   │   │   └── workGroupController.js
│   │   └── Company/
│   │       └── companyController.js
│   │
│   ├── routes/                       # Route definitions
│   │   ├── index.js                  # Central route registrar
│   │   ├── Admin/
│   │   ├── SuperAdmin/
│   │   ├── User/
│   │   ├── Assessment/
│   │   ├── Analytics/
│   │   ├── Category/
│   │   ├── Questions/
│   │   ├── Department/
│   │   ├── Experience/
│   │   ├── Position/
│   │   ├── Workgroup/
│   │   ├── Company/
│   │   └── UploadExcel/
│   │
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema
│   │   ├── seed.js                   # Database seeding
│   │   └── migrations/               # Migration history
│   │
│   ├── src/
│   │   ├── index.js                  # Unused (kept for compatibility)
│   │   ├── prisma.js                 # Prisma client instance
│   │   └── UploadExcel/
│   │       └── excelUpload.js        # Excel upload logic
│   │
│   ├── Dockerfile                    # Backend container
│   └── nodemon.json                  # Nodemon config (dev mode)
│
├── Frontend Safety-Culture-Survey/
│   ├── index.html                    # Entry HTML
│   ├── package.json                  # Dependencies
│   ├── vite.config.ts                # Vite config
│   ├── tsconfig.json                 # TypeScript config
│   ├── tailwind.config.js            # Tailwind config
│   │
│   ├── src/
│   │   ├── App.vue                   # Root component
│   │   ├── main.ts                   # Vue app entry
│   │   ├── style.css                 # Global styles
│   │   │
│   │   ├── components/               # Reusable components
│   │   ├── views/                    # Page components
│   │   ├── router/                   # Vue Router
│   │   └── assets/                   # Static assets
│   │
│   ├── Dockerfile                    # Frontend container (multi-stage)
│   ├── nginx.conf                    # Nginx config (production)
│   └── public/                       # Public assets
│
├── docker-compose.yml                # Production Docker setup
├── docker-compose.dev.yml            # Development Docker setup
├── package.json                      # Root scripts (docker shortcuts)
├── Makefile                          # Make commands
│
├── README.md                         # This file
├── API_DOCUMENTATION.md              # API detailed docs
├── SETUP_GUIDE.md                    # Setup instructions
└── Postman_API_Collection.json       # Postman collection
```

---

## Development Workflow

### 1. **Local Development (Without Docker)**
```bash
# Terminal 1: Backend
cd "Backend Safety-Culture-Survey"
npm run dev

# Terminal 2: Frontend
cd "Frontend Safety-Culture-Survey"
npm run dev

# Terminal 3: MySQL (ถ้าไม่ใช่ Docker)
mysql -u root -p
```

### 2. **Docker Development**
```bash
# เริ่มต้นทั้งหมดพร้อมกัน
npm run dev

# ดู logs แบบ real-time
npm run dev:logs

# Restart service เฉพาะ
docker-compose -f docker-compose.dev.yml restart backend
docker-compose -f docker-compose.dev.yml restart frontend
```

### 3. **Database Operations**
```bash
# สร้าง migration ใหม่
cd "Backend Safety-Culture-Survey"
npx prisma migrate dev --name add_new_field

# Reset database (ลบข้อมูลทั้งหมด + seed ใหม่)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio
```

### 4. **Code Style & Linting**
```bash
# Frontend
cd "Frontend Safety-Culture-Survey"
npm run lint
npm run type-check

# Backend
cd "Backend Safety-Culture-Survey"
npm run lint  # (ถ้ามี ESLint config)
```

---

## Testing

### Manual Testing Checklist

#### User Flow
- [ ] ลงทะเบียนผู้ใช้ใหม่ (email ต้องอยู่ใน user_excel)
- [ ] Login ผู้ใช้
- [ ] ทำแบบสอบถาม (เลือก current + expected score)
- [ ] บันทึก draft ลง localStorage
- [ ] Submit แบบสอบถาม
- [ ] ตรวจสอบ surveyStatus เปลี่ยนเป็น 'done'

#### Admin Flow
- [ ] SuperAdmin เพิ่ม Admin (email + companyName)
- [ ] Admin ตั้งรหัสผ่านครั้งแรก (setup account)
- [ ] Admin login
- [ ] ดู Dashboard (UserList, Analytics)
- [ ] Export ข้อมูล (ถ้ามี feature)

#### SuperAdmin Flow
- [ ] เพิ่ม SuperAdmin ใหม่
- [ ] Setup account (PIN + password)
- [ ] Login
- [ ] Upload Excel (user list)
- [ ] จัดการ Categories/Questions
- [ ] ดู Analytics ทั้งหมด

#### Analytics
- [ ] เลือก Company filter → ดูกราฟเปลี่ยน
- [ ] เลือก Position filter → ดูกราฟแยกตามตำแหน่ง
- [ ] Toggle Current/Future/Compare → กราฟแสดงตามที่เลือก
- [ ] เปลี่ยนปี → ดูข้อมูลย้อนหลัง

---

## API Testing

### Postman Collection
ดูไฟล์ `Postman_API_Collection.json` สำหรับ API endpoints ทั้งหมด

### Example cURL Commands
```bash
# Check user email
curl -X POST http://localhost:5000/api/users/check-email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Register user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "0812345678",
    "password": "SecurePass123",
    "company": "ACME Corp",
    "position": "Engineer",
    "department": "Engineering",
    "workGroup": "Operation",
    "workExperience": "3-5 ปี"
  }'

# Submit survey answer
curl -X POST http://localhost:5000/api/assessment/answer \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "questionId": 1,
    "currentScore": 3,
    "expectedScore": 5,
    "comment": "ควรปรับปรุงระบบสื่อสาร"
  }'

# Get survey data
curl "http://localhost:5000/api/analytics/survey-data?questionId=1&companyId=combined&year=2025"
```

---

## Troubleshooting

### Common Issues

#### 1. **Port Already in Use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

#### 2. **Docker Build Fails**
```bash
# ลบ cache และ rebuild
docker-compose down -v
docker system prune -a
docker-compose up --build --force-recreate
```

#### 3. **Prisma Client Out of Sync**
```bash
npx prisma generate
npx prisma migrate deploy
```

#### 4. **Frontend CORS Error**
- ตรวจสอบ `server.js` → `allowedOrigins` array
- ตรวจสอบ `vite.config.ts` → proxy configuration

#### 5. **MySQL Connection Error**
```bash
# ตรวจสอบ MySQL container
docker ps
docker logs survey-tunwa-mysql-1

# Test connection
mysql -h localhost -P 3307 -u root -p
```

---

## Performance Optimization

### Backend
- ใช้ Prisma `select` เฉพาะ fields ที่ต้องการ
- ใช้ `include` แทน multiple queries
- Enable query caching (Redis - ยังไม่ implement)
- Paginate API responses for large datasets

### Frontend
- Code splitting ด้วย Vue Router lazy loading
- Image optimization (WebP format)
- Compress static assets (Vite build)
- Use virtual scrolling for long lists

### Database
- Add indexes บน frequently queried columns:
  ```sql
  CREATE INDEX idx_user_email ON User(email_user);
  CREATE INDEX idx_survey_user_question ON SurveyAnswer(userId, questionId);
  CREATE INDEX idx_survey_created ON SurveyAnswer(createdAt);
  ```

---

## Future Enhancements

### Phase 1: Security
- [ ] Implement JWT authentication
- [ ] Add rate limiting
- [ ] Input validation middleware (Joi)
- [ ] Password strength requirements
- [ ] Two-factor authentication (2FA)

### Phase 2: Features
- [ ] Email notifications (assessment reminders)
- [ ] PDF report generation
- [ ] Data export (CSV, Excel)
- [ ] Advanced analytics (Machine Learning insights)
- [ ] Multi-language support (i18n)

### Phase 3: DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing (Jest, Playwright)
- [ ] Error tracking (Sentry)
- [ ] Logging system (Winston, ELK Stack)
- [ ] Kubernetes deployment

### Phase 4: UX/UI
- [ ] Dark mode
- [ ] Progressive Web App (PWA)
- [ ] Mobile responsive improvements
- [ ] Accessibility (WCAG compliance)

---

## Contributing

### Git Workflow
```bash
# สร้าง feature branch
git checkout -b feature/new-feature

# Commit messages
git commit -m "feat: add JWT authentication"
git commit -m "fix: resolve CORS issue on production"
git commit -m "docs: update API documentation"

# Push and create PR
git push origin feature/new-feature
```

### Commit Message Convention
```
feat: ฟีเจอร์ใหม่
fix: แก้ไข bug
docs: แก้ไขเอกสาร
style: จัดรูปแบบโค้ด (ไม่เปลี่ยน logic)
refactor: ปรับโครงสร้างโค้ด
test: เพิ่ม/แก้ไข tests
chore: งานอื่นๆ (update dependencies, config)
```

---

## License

MIT License (หรือ license ที่ต้องการ)

---

## Contact & Support

- **Email**: support@example.com
- **GitHub Issues**: [Link to GitHub Issues]
- **Documentation**: [Link to detailed docs]

---

## Credits

**Developed by:** [Your Team/Organization]  
**Tech Stack:** Node.js, Express, Vue 3, Prisma, MySQL, Docker, Tailwind CSS  
**Chart Library:** Chart.js  
**Icon Library:** Heroicons (SVG)

---

## Changelog

### Version 1.0.0 (2025-01-XX)
- ✨ Initial release
- ✅ Complete authentication system (User/Admin/SuperAdmin)
- ✅ Survey assessment with auto-save
- ✅ Analytics dashboard with charts
- ✅ Docker support (dev + prod)
- ✅ Excel import for user list
- ✅ Master data management
- ✅ Responsive design (Tailwind CSS)

---

**Last Updated:** 2025-01-12  
**README Version:** 1.0.0

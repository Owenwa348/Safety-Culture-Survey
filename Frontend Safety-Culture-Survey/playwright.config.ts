import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* รันทดสอบไฟล์แบบขนาน */
  fullyParallel: true,
  /* ล้มเหลวหากทิ้ง test.only ไว้ใน CI */
  forbidOnly: !!process.env.CI,
  /* Retry เฉพาะใน CI */
  retries: process.env.CI ? 2 : 0,
  /* ไม่ทำ parallel ใน CI */
  workers: process.env.CI ? 1 : undefined,
  /* ตั้ง timeout ทั้งหมด */
  timeout: 30 * 1000, // 30 วินาที
  expect: {
    timeout: 5 * 1000, // 5 วินาที สำหรับ assertion
  },
  /* Reporter ใช้ HTML */
  reporter: [
    ['html'],
    ['list'], // แสดงผลใน console
  ],
  /* ตั้งค่าทั่วไปสำหรับทุก test */
  use: {
    /* Base URL - ชี้ไปที่เซิร์ฟเวอร์ dev */
    baseURL: 'http://localhost:5173',
    /* Record video เฉพาะ test ที่ fail */
    video: 'retain-on-failure',
    /* เก็บ screenshot เมื่อ fail */
    screenshot: 'only-on-failure',
    /* Trace สำหรับ debugging */
    trace: 'on-first-retry',
  },

  /* ตั้งค่า Browser */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Mobile tests (หากต้องการทำ) */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* เปิดเซิร์ฟเวอร์ dev ก่อนรันทดสอบ */
  webServer: {
    command: 'npm run dev', // รันคำสั่ง dev
    url: 'http://localhost:5173', // รอให้ URL นี้พร้อม
    reuseExistingServer: !process.env.CI, // ไม่เปิด server ใหม่ถ้ามีตัวเดิม
    timeout: 120 * 1000, // รอ 2 นาที
  },
});

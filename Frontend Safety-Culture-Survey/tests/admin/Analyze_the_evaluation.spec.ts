import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'สำหรับบุคลากรภายใน' }).click();
  await page.getByRole('button', { name: 'Admin', exact: true }).click();
  await page.getByRole('textbox', { name: 'admin@company.com' }).click();
  await page.getByRole('textbox', { name: 'admin@company.com' }).fill('admin@tunwa.com');
  await page.getByRole('button', { name: 'ถัดไป' }).click();
  await page.getByRole('textbox', { name: 'ระบุรหัสผ่าน' }).click();
  await page.getByRole('textbox', { name: 'ระบุรหัสผ่าน' }).fill('Admin@123');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ Admin' }).click();
  await page.getByRole('button', { name: 'วิเคราะห์ผลการประเมิน' }).click();
  await page.getByRole('link', { name: 'ผลประเมินตามกลุ่มงาน' }).click();
  await page.getByRole('link', { name: 'ผลประเมินตามข้อคำถาม' }).click();
  await page.getByRole('link', { name: 'สรุปข้อคิดเห็น' }).click();
});
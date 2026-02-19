import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'สำหรับบุคลากรภายใน' }).click();
  await page.getByRole('button', { name: 'SuperAdmin' }).click();
  await page.getByRole('textbox', { name: 'superadmin@company.com' }).click();
  await page.getByRole('textbox', { name: 'superadmin@company.com' }).fill('superadmin@tunwa.com');
  await page.getByRole('button', { name: 'ถัดไป' }).click();
  await page.getByRole('textbox', { name: 'ระบุรหัสผ่าน' }).click();
  await page.getByRole('textbox', { name: 'ระบุรหัสผ่าน' }).fill('Admin@123');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ SuperAdmin' }).click();
  await page.getByRole('link', { name: 'อัปโหลดรายชื่อผู้ประเมิน' }).click();
});
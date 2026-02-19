import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'name@company.com' }).click();
  await page.getByRole('textbox', { name: 'name@company.com' }).fill('assessor@tunwa.com');
  await page.getByRole('button', { name: 'ดำเนินการต่อ' }).click();
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่านของคุณ' }).click();
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่านของคุณ' }).fill('Admin@123');
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่านของคุณ' }).press('Enter');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await page.getByRole('button', { name: 'ติดต่อสอบถาม' }).click();
  await page.getByRole('textbox', { name: 'กรุณาระบุชื่อ - นามสกุล' }).click();
  await page.getByRole('textbox', { name: 'กรุณาระบุชื่อ - นามสกุล' }).fill('สมชาย ใจดี');
  await page.getByRole('textbox', { name: 'example@email.com' }).click();
  await page.getByRole('textbox', { name: 'example@email.com' }).fill('assessor@tunwa.com');
  await page.getByRole('textbox', { name: '0812345678' }).click();
  await page.getByRole('textbox', { name: '0812345678' }).fill('0812345678');
  await page.getByRole('textbox', { name: 'กรุณากรอกข้อความที่ต้องการสอบถาม' }).click();
  await page.getByRole('textbox', { name: 'กรุณากรอกข้อความที่ต้องการสอบถาม' }).fill('ทดสอบระบบครับ');
  await page.getByRole('button', { name: 'ส่งข้อความ' }).click();
});
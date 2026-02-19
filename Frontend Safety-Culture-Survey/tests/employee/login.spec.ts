import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'name@company.com' }).click();
  await page.getByRole('textbox', { name: 'name@company.com' }).fill('somchai.jai@example.com');
  await page.getByRole('button', { name: 'ดำเนินการต่อ' }).click();
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่านของคุณ' }).click();
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่านของคุณ' }).fill('User@123');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
});
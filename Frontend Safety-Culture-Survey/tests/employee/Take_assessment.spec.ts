import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'name@company.com' }).click();
  await page.getByRole('textbox', { name: 'name@company.com' }).fill('assessor@tunwa.com');
  await page.getByRole('button', { name: 'ดำเนินการต่อ' }).click();
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่านของคุณ' }).click();
  await page.getByRole('textbox', { name: 'กรอกรหัสผ่านของคุณ' }).fill('Admin@123');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await page.getByRole('button', { name: 'ทำแบบประเมิน' }).click();
  await page.locator('div:nth-child(5) > .grid.grid-cols-12 > .col-span-3 > .grid > div > .relative > .w-5').first().click();
  await page.getByText('5มากที่สุด').click();
  await page.locator('.px-6.py-4.hover\\:bg-gray-50.transition-colors.duration-200.bg-blue-50 > .grid.grid-cols-12 > .col-span-3 > .grid > div:nth-child(2) > .relative > .w-5').click();
  await page.getByRole('button', { name: 'ถัดไป' }).click();
  await page.locator('.w-5.h-5.rounded-full').first().click();
  await page.locator('div:nth-child(5) > .grid.grid-cols-12 > .col-span-3 > .grid > div:nth-child(2) > .relative > .w-5').click();
  await page.getByRole('button', { name: 'ถัดไป' }).click();
  await page.locator('div:nth-child(2) > .grid.grid-cols-12 > .col-span-3 > .grid > div > .relative > .w-5').first().click();
  await page.locator('div:nth-child(5) > .grid.grid-cols-12 > .col-span-3 > .grid > div:nth-child(2) > .relative').click();
  await page.getByRole('textbox', { name: 'กรุณากรอกความคิดเห็นของคุณเกี่ยวกับข้อคำถามนี้... (ถ้ามี)' }).click();
  await page.getByRole('textbox', { name: 'กรุณากรอกความคิดเห็นของคุณเกี่ยวกับข้อคำถามนี้... (ถ้ามี)' }).fill('อาจจะต้องปรับปรุง');
  await page.getByRole('button', { name: 'ถัดไป' }).click();
  await page.locator('div:nth-child(3) > .grid.grid-cols-12 > .col-span-3 > .grid > div > .relative > .w-5').first().click();
  await page.locator('div:nth-child(5) > .grid.grid-cols-12 > .col-span-3 > .grid > div:nth-child(2) > .relative > .w-5').click();
  await page.getByRole('button', { name: 'ถัดไป' }).click();
  await page.locator('div:nth-child(2) > .grid.grid-cols-12 > .col-span-3 > .grid > div > .relative > .w-5').first().click();
  await page.locator('div:nth-child(5) > .grid.grid-cols-12 > .col-span-3 > .grid > div:nth-child(2) > .relative > .w-5').click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'ส่งแบบประเมิน' }).click();
});
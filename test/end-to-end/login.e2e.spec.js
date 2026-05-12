test('login success', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.fill('#email', 'test@email.com');
  await page.fill('#password', '123456');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/);
});

// Test API bằng Playwright (ít người biết)
// Playwright cũng test API được (nhưng thường dùng Supertest tốt hơn cho backend)
test('API login', async ({ request }) => {
  const res = await request.post('/api/login', {
    data: {
      email: 'test@email.com',
      password: '123456',
    },
  });

  expect(res.status()).toBe(200);
});
import { test, expect } from '@playwright/test'

test.describe('My Bookings', () => {
  test('shows empty state when no bookings', async ({ page }) => {
    // Очищаем localStorage
    await page.goto('/my-bookings')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    
    // Проверяем сообщение о пустом состоянии
    await expect(page.locator('text=У вас пока нет бронирований')).toBeVisible()
    await expect(page.locator('text=Найти мероприятия')).toBeVisible()
  })

  test('displays booking after creation', async ({ page }) => {
    // Создаем бронирование
    await page.goto('/')
    await page.waitForSelector('[data-testid="event-card"]')
    
    // Находим мероприятие с доступными билетами
    const activeCard = page.locator('[data-testid="event-card"]').filter({
      has: page.locator('button:has-text("Подробнее"):not([disabled])')
    }).first()
    await activeCard.locator('button:has-text("Подробнее")').click()
    await page.click('text=Забронировать')
    
    // Заполняем форму
    await page.locator('[data-testid^="ticket-quantity-"]').first().click()
    await page.fill('input[type="email"]', 'test@example.com')
    await page.locator('input[type="text"]').first().fill('Test User')
    await page.click('button[type="submit"]')
    
    // Ждем успеха
    await page.waitForURL(/\/booking\/success/, { timeout: 10000 })
    
    // Переходим в "Мои бронирования"
    await page.click('text=Мои билеты')
    
    // Проверяем что бронирование отображается (проверяем email или статус)
    await expect(page.locator('text=test@example.com').or(page.locator('text=подтверждено'))).toBeVisible()
  })

  test('booking has download PDF button', async ({ page }) => {
    // Создаем бронирование
    await page.goto('/')
    await page.waitForSelector('[data-testid="event-card"]')
    
    // Находим мероприятие с доступными билетами
    const activeCard = page.locator('[data-testid="event-card"]').filter({
      has: page.locator('button:has-text("Подробнее"):not([disabled])')
    }).first()
    await activeCard.locator('button:has-text("Подробнее")').click()
    await page.click('text=Забронировать')
    
    await page.locator('[data-testid^="ticket-quantity-"]').first().click()
    await page.fill('input[type="email"]', 'pdf-test@example.com')
    await page.locator('input[type="text"]').first().fill('PDF Test User')
    await page.click('button[type="submit"]')
    
    await page.waitForURL(/\/booking\/success/, { timeout: 10000 })
    await page.click('text=Мои билеты')
    
    // Проверяем кнопку PDF или ссылку на PDF
    await expect(page.locator('a[href*="pdf"]').or(page.locator('button:has-text("PDF")')).first()).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test('complete booking process', async ({ page }) => {
    // 1. Открываем главную страницу
    await page.goto('/')
    await expect(page).toHaveTitle(/MI Booking/)
    
    // 2. Ждем загрузки мероприятий
    await page.waitForSelector('[data-testid="event-card"]')
    
    // 3. Находим мероприятие с доступными билетами (кнопка не disabled)
    const activeCard = page.locator('[data-testid="event-card"]').filter({
      has: page.locator('button:has-text("Подробнее"):not([disabled])')
    }).first()
    await activeCard.locator('button:has-text("Подробнее")').click()
    
    // 4. Проверяем что мы на странице деталей
    await expect(page).toHaveURL(/\/events\/\d+/)
    await expect(page.locator('h1')).toBeVisible()
    
    // 5. Кликаем "Забронировать"
    await page.click('text=Забронировать')
    
    // 6. Проверяем что мы на странице бронирования
    await expect(page).toHaveURL(/\/events\/\d+\/book/)
    
    // 7. Выбираем билеты (кликаем кнопку плюс)
    const plusButton = page.locator('[data-testid^="ticket-quantity-"]').first()
    await plusButton.click()
    await plusButton.click() // Выбираем 2 билета
    
    // 8. Заполняем контактные данные
    await page.fill('input[type="email"]', 'test@example.com')
    // Имя - это textbox после Email
    await page.locator('input[type="text"]').first().fill('Иван Петров')
    await page.fill('input[type="tel"]', '+7 999 123-45-67')
    
    // 9. Отправляем форму
    await page.click('button[type="submit"]')
    
    // 10. Ждем перехода на страницу успеха
    await page.waitForURL(/\/booking\/success/, { timeout: 10000 })
    
    // 11. Проверяем сообщение об успехе
    await expect(page.locator('text=Бронирование подтверждено')).toBeVisible()
    
    // 12. Проверяем что есть кнопка скачивания PDF
    await expect(page.locator('text=Скачать PDF').or(page.locator('a[href*="pdf"]'))).toBeVisible()
  })

  test('cannot book without selecting tickets', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="event-card"]')
    
    // Находим мероприятие с доступными билетами
    const activeCard = page.locator('[data-testid="event-card"]').filter({
      has: page.locator('button:has-text("Подробнее"):not([disabled])')
    }).first()
    await activeCard.locator('button:has-text("Подробнее")').click()
    await page.click('text=Забронировать')
    
    // Пытаемся отправить без выбора билетов
    await page.fill('input[type="email"]', 'test@example.com')
    await page.locator('input[type="text"]').first().fill('Test User')
    
    // Кнопка должна быть disabled (или форма не отправится)
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeDisabled()
  })

  test('shows sold out events', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="event-card"]')
    
    // Находим карточку с "Билеты проданы"
    const soldOutCard = page.locator('text=Билеты проданы').first()
    
    if (await soldOutCard.isVisible().catch(() => false)) {
      // Если есть проданные, проверяем что их кнопка disabled
      const card = page.locator('[data-testid="event-card"]').filter({
        has: page.locator('text=Билеты проданы')
      }).first()
      await expect(card.locator('button[disabled]')).toBeVisible()
    } else {
      // Нет проданных мероприятий - тест пропускаем
      test.skip()
    }
  })
})

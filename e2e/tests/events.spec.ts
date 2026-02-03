import { test, expect } from '@playwright/test'

test.describe('Events Catalog', () => {
  test('displays events list', async ({ page }) => {
    await page.goto('/')
    
    // Проверяем заголовок (частичное совпадение с градиентным текстом)
    await expect(page.locator('h1')).toContainText('события')
    
    // Проверяем что есть карточки мероприятий (ждём загрузки)
    await page.waitForSelector('[data-testid="event-card"]', { timeout: 30000 })
    const events = page.locator('[data-testid="event-card"]')
    const count = await events.count()
    expect(count).toBeGreaterThan(0)
  })

  test('event card displays correct information', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="event-card"]')
    
    const firstCard = page.locator('[data-testid="event-card"]').first()
    
    // Проверяем наличие основных элементов
    await expect(firstCard.locator('h3')).toBeVisible() // Название
    await expect(firstCard.locator('text=от')).toBeVisible() // Цена
    await expect(firstCard.locator('button:has-text("Подробнее")')).toBeVisible()
  })

  test('navigation to event details works', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="event-card"]')
    
    // Находим карточку с активной кнопкой (не disabled)
    const activeCard = page.locator('[data-testid="event-card"]').filter({
      has: page.locator('button:has-text("Подробнее"):not([disabled])')
    }).first()
    
    const eventTitle = await activeCard.locator('h3').textContent()
    
    // Кликаем "Подробнее"
    await activeCard.locator('button:has-text("Подробнее")').click()
    
    // Проверяем что открылась страница с правильным названием
    await expect(page.locator('h1')).toContainText(eventTitle || '')
  })

  test('event details page shows ticket types', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="event-card"]')
    
    // Находим карточку с активной кнопкой (мероприятие с билетами)
    const activeCard = page.locator('[data-testid="event-card"]').filter({
      has: page.locator('button:has-text("Подробнее"):not([disabled])')
    }).first()
    
    await activeCard.locator('button:has-text("Подробнее")').click()
    
    // Проверяем наличие секции с билетами
    await expect(page.locator('h2:has-text("Билеты")')).toBeVisible()
    // Проверяем что есть кнопка "Забронировать"
    await expect(page.locator('button:has-text("Забронировать")')).toBeVisible()
  })

  test('back navigation works', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="event-card"]')
    
    // Находим карточку с активной кнопкой
    const activeCard = page.locator('[data-testid="event-card"]').filter({
      has: page.locator('button:has-text("Подробнее"):not([disabled])')
    }).first()
    
    await activeCard.locator('button:has-text("Подробнее")').click()
    await expect(page).toHaveURL(/\/events\/\d+/)
    
    // Возвращаемся назад
    await page.click('text=Назад к мероприятиям')
    await expect(page).toHaveURL('/')
  })
})

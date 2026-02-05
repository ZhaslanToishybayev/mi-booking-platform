import { test, expect } from '@playwright/test';

test.describe('Generate Screenshots', () => {
  test.use({ 
    viewport: { width: 1280, height: 800 },
    colorScheme: 'dark' // Ensure dark mode preference matches our theme
  });

  test('capture all pages', async ({ page }) => {
    // 1. Home Page
    console.log('Capturing Home Page...');
    await page.goto('/');
    await page.waitForSelector('[data-testid="event-card"]', { state: 'visible', timeout: 60000 });
    // Wait a bit for animations to settle
    await page.waitForTimeout(2000); 
    await page.screenshot({ path: '../docs/screenshots/home.png', fullPage: true });

    // 2. Event Details
    console.log('Capturing Event Details...');
    // Click the first "Подробнее" button (assuming event with ID 1 or similar exists)
    await page.locator('[data-testid="event-card"]').first().getByRole('button', { name: 'Подробнее' }).click();
    await page.waitForURL(/\/events\/\d+/);
    await page.waitForSelector('h1', { state: 'visible' });
    await page.waitForTimeout(1000); // Wait for hero image/animations
    await page.screenshot({ path: '../docs/screenshots/details.png', fullPage: true });

    // 3. Booking Page
    console.log('Capturing Booking Page...');
    // Click "Забронировать"
    await page.getByRole('button', { name: 'Забронировать' }).click();
    await page.waitForURL(/\/book/);
    await page.waitForSelector('input[type="email"]', { state: 'visible' });
    await page.waitForTimeout(1000);
    
    // Select some tickets to make the summary look good
    const plusButton = page.locator('[data-testid^="ticket-quantity-"]').first();
    await plusButton.click();
    await plusButton.click();
    await page.waitForTimeout(500); // Allow totals to update
    await page.screenshot({ path: '../docs/screenshots/booking.png', fullPage: true });

    // 4. Complete Booking & Capture My Tickets
    console.log('Capturing My Tickets...');
    // Fill form
    await page.fill('input[type="email"]', 'screenshot@example.com');
    await page.fill('input[type="text"]', 'Screenshot User');
    // Submit
    await page.getByRole('button', { name: 'Забронировать' }).click();
    await page.waitForURL(/\/booking\/success/);
    
    // Go to My Bookings
    await page.click('text=Мои билеты');
    await page.waitForURL(/\/my-bookings/);
    await page.waitForSelector('[data-testid="ticket-card"]', { state: 'visible', timeout: 10000 }).catch(() => {
        // Fallback: maybe we need to expand tickets first? 
        // Or wait for the booking card to appear.
        // BookingCard is visible, but tickets might be hidden behind toggle.
    });
    
    // Expand tickets if needed (usually hidden by default in my implementation)
    const toggleBtn = page.locator('[data-testid="toggle-tickets"]').first();
    if (await toggleBtn.isVisible()) {
        await toggleBtn.click();
        await page.waitForSelector('[data-testid="ticket-card"]', { state: 'visible' });
    }

    await page.waitForTimeout(1000);
    await page.screenshot({ path: '../docs/screenshots/tickets.png', fullPage: true });
  });
});

import { test, expect } from '@playwright/test';

test('debug frontend', async ({ page }) => {
  // Log all console messages
  page.on('console', msg => console.log(`BROWSER CONS: ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`BROWSER ERR: ${err.message}`));
  page.on('requestfailed', request => console.log(`BROWSER REQ FAILED: ${request.url()} - ${request.failure().errorText}`));

  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`BROWSER RESP ERROR: ${response.status()} ${response.url()}`);
    }
  });

  console.log('Navigating to home...');
  await page.goto('/');
  
  console.log('Waiting for network idle...');
  await page.waitForLoadState('networkidle');
  
  console.log('Checking for event cards...');
  try {
    await page.waitForSelector('[data-testid="event-card"]', { timeout: 5000 });
    console.log('SUCCESS: Event cards found!');
  } catch (e) {
    console.log('TIMEOUT: Event cards not found.');
    // Take a screenshot of the failure state
    await page.screenshot({ path: 'debug-failure.png' });
  }
});

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Sequential to ensure stability for screenshots
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 1, // Single worker for screenshots
  timeout: 60000, // 60s timeout
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost', // Default to Docker Production
    trace: 'on-first-retry',
    screenshot: 'on', // Always take screenshots if requested
    actionTimeout: 15000,
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // webServer block removed to rely on running Docker containers
})

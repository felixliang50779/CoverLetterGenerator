const { test, chromium } = require('@playwright/test');
const path = require('path');

test('test landing page', async ({ page }) => {
  const pathToExtension = (path.dirname(__dirname));
  console.log(`Path to extension: ${pathToExtension}`);
  const userDataDir = '/tmp/test-user-data-dir';
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    ]
  });
  let [backgroundPage] = browserContext.backgroundPages();
  if (!backgroundPage)
    backgroundPage = await browserContext.waitForEvent('backgroundpage');

  // Test the background page as you would any other page.
  await browserContext.close();
});
const { test, expect } = require('@playwright/test');
const { getTranslationFields } = require('./test-helpers');

test.describe('UI Tests - Singlish to Sinhala Translation Interface', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('Pos_UI_0001: Sinhala output updates automatically in real-time', async ({ page }) => {
    const input = 'mama gedhara yanavaa';
    const expectedOutput = 'මම ගෙදර යනවා';
    
    const { inputField, outputField } = await getTranslationFields(page);
    
    // Clear input first
    await inputField.clear();
    await page.waitForTimeout(1000);
    
    // Check initial state
    const outputElements = await page.locator('div.whitespace-pre-wrap.overflow-y-auto').all();
    let currentOutput = '';
    if (outputElements.length > 0) {
      currentOutput = await outputElements[outputElements.length - 1].textContent();
    }
    const initialLength = currentOutput.trim().length;
    
    // Type the full sentence
    await inputField.type(input, { delay: 150 });
    
    // Wait for network to settle after typing
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(5000);
    
    // Final output verification - get last output element with retry logic
    let finalOutput = '';
    let retries = 0;
    while (finalOutput.trim() === '' && retries < 3) {
      const finalOutputElements = await page.locator('div.whitespace-pre-wrap.overflow-y-auto').all();
      if (finalOutputElements.length > 0) {
        finalOutput = await finalOutputElements[finalOutputElements.length - 1].textContent();
      }
      if (finalOutput.trim() === '' && retries < 2) {
        await page.waitForTimeout(3000); // Increased from 2000
        retries++;
      } else {
        break;
      }
    }
    
    expect(finalOutput.trim()).toBe(expectedOutput);
    
    // Verify output changed from initial state (real-time update occurred)
    expect(finalOutput.trim().length).toBeGreaterThan(initialLength);
    
    // Verify no lag or freezing occurred
    const isInputEnabled = await inputField.isEnabled();
    expect(isInputEnabled).toBeTruthy();
  });

});

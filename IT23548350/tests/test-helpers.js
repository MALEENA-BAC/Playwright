const { test, expect } = require('@playwright/test');

/**
 * Helper function to get input and output fields with correct selectors
 */
async function getTranslationFields(page) {
  const inputField = page.locator('textarea[placeholder*="Input Your Singlish Text"]');
  const outputField = page.locator('div.whitespace-pre-wrap.overflow-y-auto').last();
  return { inputField, outputField };
}

/**
 * Helper function to perform translation test
 */
async function performTranslationTest(page, input, expectedOutput) {
  const { inputField, outputField } = await getTranslationFields(page);
  
  // Clear and fill input
  await inputField.clear();
  await page.waitForTimeout(500);
  await inputField.fill(input);
  
  // Trigger translation by clicking outside the input field or pressing Tab
  // This is more reliable than Space+Backspace which can interfere with punctuation
  await inputField.press('Tab');
  
  // Wait for any network activity to settle
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  
  // Wait for the output field to have content
  // Use a more robust wait strategy: wait for the output div to not be empty
  const outputSelector = 'div.whitespace-pre-wrap.overflow-y-auto';
  
  try {
    // Wait up to 25 seconds for output to appear (increased from 20)
    await page.waitForFunction(
      (selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return false;
        const lastElement = elements[elements.length - 1];
        const text = lastElement.textContent || '';
        return text.trim().length > 0;
      },
      outputSelector,
      { timeout: 25000 }
    );
  } catch (error) {
    console.log('Timeout waiting for translation output:', error.message);
    // Try one more time with a longer wait
    await page.waitForTimeout(3000);
  }
  
  // Get the actual output
  let actualOutput = '';
  try {
    const outputElements = await page.locator(outputSelector).all();
    if (outputElements.length > 0) {
      actualOutput = await outputElements[outputElements.length - 1].textContent();
    }
  } catch (error) {
    console.log('Error getting output:', error.message);
  }
  
  return actualOutput.trim();
}

module.exports = { getTranslationFields, performTranslationTest };

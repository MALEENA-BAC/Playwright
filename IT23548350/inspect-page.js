const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://www.swifttranslator.com/');
  await page.waitForLoadState('networkidle');
  
  console.log('\n=== Finding Input and Output Fields ===\n');
  
  // Try to find all textareas
  const textareas = await page.locator('textarea').count();
  console.log(`Found ${textareas} textarea elements`);
  
  for (let i = 0; i < textareas; i++) {
    const textarea = page.locator('textarea').nth(i);
    const placeholder = await textarea.getAttribute('placeholder').catch(() => 'N/A');
    const id = await textarea.getAttribute('id').catch(() => 'N/A');
    const className = await textarea.getAttribute('class').catch(() => 'N/A');
    const isReadonly = await textarea.getAttribute('readonly').catch(() => null);
    
    console.log(`Textarea ${i}:`);
    console.log(`  ID: ${id}`);
    console.log(`  Placeholder: ${placeholder}`);
    console.log(`  Class: ${className}`);
    console.log(`  Readonly: ${isReadonly !== null}`);
    console.log('');
  }
  
  // Try to find the correct input field
  console.log('\n=== Testing Input Field ===\n');
  
  try {
    const inputField = page.locator('textarea').first();
    await inputField.fill('mama gedhara yanavaa');
    console.log('✓ Successfully filled first textarea');
    
    await page.waitForTimeout(3000);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    console.log('✓ Screenshot saved as debug-screenshot.png');
    
    // Get page content to analyze structure
    console.log('\n=== Analyzing page structure ===\n');
    
    // Look for elements with specific text patterns
    const allDivs = await page.locator('div').count();
    console.log(`Total divs on page: ${allDivs}`);
    
    // Try to find the output container by looking near the textarea
    const parentSection = page.locator('textarea').locator('..');
    const parentHTML = await parentSection.innerHTML().catch(() => 'N/A');
    console.log('\nParent of textarea (first 500 chars):');
    console.log(parentHTML.substring(0, 500));
    
    // Check for a second major section
    console.log('\n=== Looking for second major section ===\n');
    const sections = await page.locator('section, main, div[class*="container"]').count();
    console.log(`Found ${sections} major sections`);
    
    // Look for elements containing Sinhala characters after input
    await page.waitForTimeout(1000);
    const bodyHTML = await page.locator('body').innerHTML();
    
    // Find all div elements and check their content
    const divsWithContent = await page.locator('div').evaluateAll(divs => {
      return divs
        .map((div, index) => {
          const text = div.textContent || '';
          const hasSinhala = /[\u0D80-\u0DFF]/.test(text);
          const isVisible = div.offsetParent !== null;
          return {
            index,
            hasSinhala,
            isVisible,
            text: text.substring(0, 100),
            className: div.className,
            id: div.id
          };
        })
        .filter(item => item.hasSinhala && item.isVisible && item.text.length > 5);
    });
    
    console.log('\nDivs with Sinhala content:');
    console.log(JSON.stringify(divsWithContent, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\n=== Page Title ===');
  console.log(await page.title());
  
  await page.waitForTimeout(5000);
  await browser.close();
})();

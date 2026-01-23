
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'],
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  try {
    await page.goto('http://aicmr.local/install', { waitUntil: 'networkidle0' });
    const text = await page.evaluate(() => document.body.innerText);
    console.log('Page Text Content (First 500 chars):');
    console.log(text.substring(0, 500));
    
    // Check if there are any visible error messages on the page itself (alert-danger, etc)
    const errorElements = await page.$$('.text-red-500, .bg-red-50, .alert-danger');
    if (errorElements.length > 0) {
        console.log(`Found ${errorElements.length} potential error elements on page.`);
        for (const el of errorElements) {
            const errText = await el.evaluate(e => e.innerText);
            console.log('Error Text:', errText);
        }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();

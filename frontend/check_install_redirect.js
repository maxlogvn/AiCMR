
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'],
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  try {
    console.log('Navigating to http://aicmr.local/install ...');
    await page.goto('http://aicmr.local/install', { waitUntil: 'networkidle0' });
    
    console.log('Final URL:', page.url());
    const title = await page.title();
    console.log('Page Title:', title);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();

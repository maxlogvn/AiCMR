
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'],
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  const results = {
    'Install Page': { console: [], network: [] }
  };

  const pageErrors = results['Install Page'];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      pageErrors.console.push(msg.text());
    }
  });

  page.on('response', response => {
    if (!response.ok() && response.status() >= 400) {
       pageErrors.network.push(`${response.status()} ${response.url()}`);
    }
  });
  
  page.on('requestfailed', request => {
     if (request.failure().errorText !== 'net::ERR_ABORTED') {
        pageErrors.network.push(`FAILED ${request.url()} : ${request.failure().errorText}`);
     }
  });

  try {
    console.log('Checking Install Page (http://aicmr.local/install)...');
    await page.goto('http://aicmr.local/install', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Also try to fill something to see if it triggers errors
    // Just simple interaction check if page loaded
    const title = await page.title();
    console.log('Page Title:', title);

  } catch (error) {
    console.error('Navigation error:', error.message);
    pageErrors.console.push(`Navigation Error: ${error.message}`);
  } finally {
    await browser.close();
    console.log(JSON.stringify(results, null, 2));
  }
})();

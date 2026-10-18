// Renders scripts/og.html to public/og.png. Needs Playwright (npx playwright install chromium).
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto(new URL('./og.html', import.meta.url).href);
await p.screenshot({ path: fileURLToPath(new URL('../public/og.png', import.meta.url)) });
await b.close();

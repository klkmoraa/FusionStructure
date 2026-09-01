import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const out='/tmp/claude-0/-home-user-FusionStructure/6283d21d-eb25-5ade-923a-e4dcccb1d959/scratchpad/shots';
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });
await p.click('.fs-action--primary'); await p.waitForTimeout(2000);
await p.click('.sc-home-nav--console [aria-label="Plantillas"]'); await p.waitForTimeout(1200);
await p.click('.sc-home-template-grid > button:nth-child(4)'); await p.waitForTimeout(3500);
await p.click('.console__analyze'); await p.waitForTimeout(3000);
await p.mouse.move(720, 450); await p.waitForTimeout(700);
await p.screenshot({ path: `${out}/model2.png` });
// resultados: momento
try { await p.click('.canvas-evidence-rail button:nth-child(3)'); await p.waitForTimeout(1200); await p.mouse.move(720,450); await p.waitForTimeout(500); await p.screenshot({ path: `${out}/model2-moment.png` }); } catch(e) { console.log('rail', String(e).slice(0,80)); }
await b.close();

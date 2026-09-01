const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const artifactsDir = '../../artifacts/calibration';
  if (!fs.existsSync(artifactsDir)){
      fs.mkdirSync(artifactsDir, { recursive: true });
  }

  // --- PHASE 1C CALIBRATION ---
  await page.goto('http://localhost:3000/dev/hanna-calibration');
  await page.waitForLoadState('networkidle');
  
  async function clickButton(text) {
    await page.getByRole('button', { name: text, exact: true }).click();
    await page.waitForTimeout(500); // give react time to re-render
  }

  // ... (keep the 10 old ones briefly to ensure regression works, or just do the new ones? 
  // User asked "Ajouter un script de validation visuelle pour capturer au minimum: A, B, C, D, E, F".
  // Let's do all.)

  await page.locator('select').selectOption('CLOSED_BACK');
  await clickButton('Master');
  await page.screenshot({ path: `${artifactsDir}/1_Closed_Master.png` });

  await clickButton('Reconstruction');
  await page.screenshot({ path: `${artifactsDir}/2_Closed_Reconstruction.png` });

  await clickButton('Difference');
  await page.screenshot({ path: `${artifactsDir}/3_Closed_Difference.png` });

  await page.locator('select').selectOption('OPEN_ENVELOPE');
  await clickButton('Master');
  await page.screenshot({ path: `${artifactsDir}/4_Open_Master.png` });

  await clickButton('Reconstruction');
  await page.screenshot({ path: `${artifactsDir}/5_Open_Reconstruction.png` });

  await clickButton('Difference');
  await page.screenshot({ path: `${artifactsDir}/6_Open_Difference.png` });

  await clickButton('Reconstruction');
  const cardCheckbox = page.getByLabel('Show Card inside envelope');
  if (!(await cardCheckbox.isChecked())) await cardCheckbox.check();
  const shadowCheckbox = page.getByLabel('Show Slot Shadow');
  if (!(await shadowCheckbox.isChecked())) await shadowCheckbox.check();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${artifactsDir}/7_Card_Inside_Envelope.png` });

  await clickButton('0°');
  await page.screenshot({ path: `${artifactsDir}/8_Flap_0.png` });

  await clickButton('90°');
  await page.screenshot({ path: `${artifactsDir}/9_Flap_90.png` });

  await clickButton('180°');
  await page.screenshot({ path: `${artifactsDir}/10_Flap_180.png` });


  // --- PHASE 2A MOTION ---
  console.log("Navigating to hanna-motion...");
  await page.goto('http://localhost:3000/dev/hanna-motion');
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for entrance animation to reach a middle state (say 0.5s)
  await clickButton('Replay Entrance');
  await page.waitForTimeout(500); 
  await page.screenshot({ path: `${artifactsDir}/11_Motion_Entering.png` });

  await clickButton('Force Idle');
  await page.screenshot({ path: `${artifactsDir}/12_Motion_Idle_Front.png` });

  await clickButton('45°');
  await page.screenshot({ path: `${artifactsDir}/13_Motion_Flip_45.png` });

  await clickButton('90°');
  await page.screenshot({ path: `${artifactsDir}/14_Motion_Flip_90.png` });

  await clickButton('135°');
  await page.screenshot({ path: `${artifactsDir}/15_Motion_Flip_135.png` });

  await clickButton('180°');
  await page.screenshot({ path: `${artifactsDir}/16_Motion_Flip_180.png` });

  await browser.close();
  console.log("Screenshots captured successfully!");
})();

const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const artifactsDir = '../../artifacts/calibration';
  if (!fs.existsSync(artifactsDir)){
      fs.mkdirSync(artifactsDir, { recursive: true });
  }

  await page.goto('http://localhost:3000/dev/hanna-calibration');
  await page.waitForLoadState('networkidle');
  
  // A helper to click a button with specific text
  async function clickButton(text) {
    await page.getByRole('button', { name: text, exact: true }).click();
    await page.waitForTimeout(500); // give react time to re-render
  }

  // 1. Closed Master
  await page.locator('select').selectOption('CLOSED_BACK');
  await clickButton('Master');
  await page.screenshot({ path: `${artifactsDir}/1_Closed_Master.png` });

  // 2. Closed Reconstruction
  await clickButton('Reconstruction');
  await page.screenshot({ path: `${artifactsDir}/2_Closed_Reconstruction.png` });

  // 3. Closed Difference
  await clickButton('Difference');
  await page.screenshot({ path: `${artifactsDir}/3_Closed_Difference.png` });

  // 4. Open Master
  await page.locator('select').selectOption('OPEN_ENVELOPE');
  await clickButton('Master');
  await page.screenshot({ path: `${artifactsDir}/4_Open_Master.png` });

  // 5. Open Reconstruction
  await clickButton('Reconstruction');
  await page.screenshot({ path: `${artifactsDir}/5_Open_Reconstruction.png` });

  // 6. Open Difference
  await clickButton('Difference');
  await page.screenshot({ path: `${artifactsDir}/6_Open_Difference.png` });

  // 7. Card Inside Envelope
  await clickButton('Reconstruction');
  // Check the "Show Card inside envelope" checkbox if not already checked
  const cardCheckbox = page.getByLabel('Show Card inside envelope');
  if (!(await cardCheckbox.isChecked())) {
    await cardCheckbox.check();
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${artifactsDir}/7_Card_Inside_Envelope.png` });

  // 8. Flap 0°
  await clickButton('0°');
  await page.screenshot({ path: `${artifactsDir}/8_Flap_0.png` });

  // 9. Flap 90°
  await clickButton('90°');
  await page.screenshot({ path: `${artifactsDir}/9_Flap_90.png` });

  // 10. Flap 180°
  await clickButton('180°');
  await page.screenshot({ path: `${artifactsDir}/10_Flap_180.png` });

  await browser.close();
  console.log("Screenshots captured successfully!");
})();

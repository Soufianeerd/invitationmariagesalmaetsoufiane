const CONFIG = {
  OWNER_EMAIL:  'soufiane.erd@gmail.com',
  SHEET_NAME:   'RSVP Invités',
  COUPLE:       'Soufiane & Salma'
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date', 'Nom', 'Email', 'Presence', 'Allergies', 'Message']);
    }

    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      (data.attendance === 'oui' ? '✅ Présent(e)' : '❌ Absent(e)'),
      data.allergies || 'Aucune',
      data.message || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

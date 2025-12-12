function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');

    // Basic spam guard (honeypot)
    if (data.hp_field) {
      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById('SPREADSHEET_ID'); // <-- REPLACE with your Google Sheet ID
    const sheet = ss.getSheetByName('Responses') || ss.insertSheet('Responses');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp','Name','Mobile','Email','Message']);
    }

    const t = new Date();
    sheet.appendRow([
      t,
      data.name || '',
      data.mobile || '',
      data.email || '',
      data.message || ''
    ]);

    // Email notification (optional)
    MailApp.sendEmail({
      to: 'chaturvedfinance@gmail.com', // <-- change to your email if different
      subject: 'New form submission: ' + (data.name || ''),
      htmlBody: `
        <b>Time:</b> ${t}<br>
        <b>Name:</b> ${data.name || ''}<br>
        <b>Mobile:</b> ${data.mobile || ''}<br>
        <b>Email:</b> ${data.email || ''}<br>
        <b>Message:</b> ${data.message || ''}
      `
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

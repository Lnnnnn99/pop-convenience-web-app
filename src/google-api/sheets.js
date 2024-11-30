const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function getSheetData(sheetId, range) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });
  return res.data.values;
}

async function appendData(sheetId, range, values) {
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'RAW',
    resource: {
      values,
    },
  });
  return res.data;
}

module.exports = { getSheetData, appendData };

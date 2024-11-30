const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/credentials.json',
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

async function listFiles() {
  const res = await drive.files.list({
    pageSize: 10,
    fields: 'files(id, name)',
  });
  return res.data.files;
}

async function uploadFile(fileName, mimeType, filePath) {
  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType,
    },
    media: {
      mimeType,
      body: fs.createReadStream(filePath),
    },
  });
  return res.data;
}

module.exports = { listFiles, uploadFile };

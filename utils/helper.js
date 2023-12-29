const { google } = require("googleapis");
const { Readable } = require("stream");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

// Use Multer to handle form data
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });

async function createFolder(folderName) {
  try {
    const folderResponse = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      },
    });
    return folderResponse.data.id;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

async function uploadFileToDrive(fileName, mimeType, parents, fileBuffer) {
  const fileMetadata = {
    name: fileName,
    mimeType: mimeType,
    parents: [parents],
  };

  const media = {
    mimeType: mimeType,
    body: Readable.from(fileBuffer),
  };

  const driveResponse = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });

  return driveResponse.data.id;
}

async function generatePublicUrl(fileId) {
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });

    return result.data.webViewLink; // TO view online file
    // return result.data.webContentLink; //To download
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

module.exports = {
  createFolder,
  uploadFileToDrive,
  generatePublicUrl,
  upload, // Include Multer instance for use in routes
};

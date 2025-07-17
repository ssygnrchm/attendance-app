const { google } = require("googleapis");
// const fetch = require("node-fetch"); // jangan lupa install
// const path = require("path");
const fs = require("fs");

const serviceAccount = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
};


const credentials = serviceAccount;

// const base64 = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;
// const jsonString = Buffer.from(base64, 'base64').toString('utf-8');
// const credentials = JSON.parse(jsonString);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const { data, month } = body;

    const sheetName = `Sheet_${month.replace("-", "_")}`;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 1️⃣ Cek sheet ada atau belum
    const sheetsMeta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetExists = sheetsMeta.data.sheets.some(
      (s) => s.properties.title === sheetName
    );

    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: sheetName } } }],
        },
      });
      console.log(`Sheet "${sheetName}" berhasil dibuat`);
    }

    // 2️⃣ Format data
    const values = [
      ["Nama Siswa", "Kelas", "Hadir", "Absen", "Izin"],
      ...data.map((row) => [
        row.name,
        row.className,
        row.Present,
        row.Absent,
        row.Excused,
      ]),
    ];

    // 3️⃣ Tulis data ke sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:E${values.length}`,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    // 4️⃣ Panggil Google Apps Script untuk sorting
    const sortURL = `https://script.google.com/macros/s/${process.env.SCRIPT_ID}/exec`;
    try {
      const sortRes = await fetch(sortURL, { method: "POST" });
      const result = await sortRes.text();
      console.log("Sort result:", result);
    } catch (sortErr) {
      console.error("Gagal memanggil Google Script:", sortErr);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Data berhasil dikirim ke tab "${sheetName}"`,
      }),
    };
  } catch (error) {
    console.error("Error saat menulis ke sheet:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal menulis ke Google Sheets" }),
    };
  }
};

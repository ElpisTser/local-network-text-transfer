import express from 'express';
import { getLocalIPAddress } from './utils/getLocalIP.js';
import 'dotenv/config';
import QRCode from 'qrcode';

const app = express();
const PORT = process.env.PORT || 8080;

const ipAddress = getLocalIPAddress();
const serverUrl = `http://${ipAddress}:${PORT}`

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/ping', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is available' });
});

app.get('/qr', async (req, res) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(serverUrl);
    res.send(`
      <html>
        <head><title>Server QR Code</title></head>
        <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
          <h2>Scan this QR code in the app</h2>
          <img src="${qrDataUrl}" alt="QR Code" />
          <p>${serverUrl}</p>
        </body> 
      </html>
    `);
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    res.status(500).send('Could not generate QR code');
  }
});

app.post('/log', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ status: 'error', message: 'Text is required' });
    }
    console.log(`Received text: ${text}`);
    res.status(200).json( {status: 'success', message: 'Text logged' });
})

app.listen(PORT, () => {
  console.log(`Server is running at: ${serverUrl}`);
});

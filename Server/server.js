import express from 'express';
import { getLocalIPAddress } from './utils/getLocalIP.js';
import 'dotenv/config';
import qrcode from 'qrcode-terminal';
import bonjour from 'bonjour';

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
  qrcode.generate(serverUrl, {small: true});
  console.log('Manually input the server address or scan the QR code above to connect');
});

const bonjourInstance = bonjour();
const bonjourService =  bonjourInstance.publish({
  name: 'Bonjour Broadcast',
  type: 'http',
  port: PORT,
  txt: {
    serverAddress: serverUrl
  }
});

bonjourService.on('up', () => {
  console.log(`Server is being broadcasted on the local network as ${bonjourService.name}`);
});

bonjourService.on('error', (err) => {
  console.log('Bonjour error:', err)
});


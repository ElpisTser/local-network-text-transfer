import express from 'express';
import { getLocalIPAddress } from './utils/getLocalIP.js';
import 'dotenv/config';
import qrcode from 'qrcode-terminal';
import bonjour from 'bonjour';
import path from 'path';
import { fileURLToPath } from 'url';
import { Expo } from 'expo-server-sdk';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

const ipAddress = getLocalIPAddress();
const serverUrl = `http://${ipAddress}:${PORT}`;

const expo = new Expo();

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const devices = []; 

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/pingDevice', (req, res) => {
  res.render('pingDevice', { devices });
});

app.post('/ping', (req, res) => {
  const { token, deviceName } = req.body;

  if (!deviceName || !token) {
    return res.status(400).json({ error: 'Missing deviceName or token' });
  }

  const existingDevice = devices.find(d => d.deviceName === deviceName);

  if (existingDevice) {
    existingDevice.token = token;
  } else {
    devices.push({ deviceName, token });
  }

  res.status(200).json({ status: 'ok', message: 'Server is available' });
});

app.post('/notify/:token', async (req, res) => {
  const token = req.params.token;

  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).send('Invalid Expo push token.');
  }

  const messages = [{
    to: token,
    sound: 'default',
    title: 'Find My Device',
    body: 'Tap to dismiss',
    priority: 'high',
    channelId: 'find-device'
  }];

  try {
    const ticketChunk = await expo.sendPushNotificationsAsync(messages);
    console.log('Notification sent:', ticketChunk);
    res.status(200).send('Notification sent successfully.');
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).send('Failed to send notification.');
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


// server.js
import express from 'express';
import { getLocalIPAddress } from './utils/getLocalIP.js';

const app = express();
const PORT = 3000;

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
  const ipAddress = getLocalIPAddress();
  console.log(`Server is running at: http://${ipAddress}:${PORT}`);
});

// server.js
import express from 'express';
import { getLocalIPAddress } from './utils/getLocalIP.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  const ipAddress = getLocalIPAddress();
  console.log(`Server is running at: http://${ipAddress}:${PORT}`);
});

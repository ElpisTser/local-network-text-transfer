# Text Logger App

A project consisting of a mobile app (built with Expo) and a Node.js server. The mobile app sends text to the server, which logs it. Both parts run on the same local Wi-Fi network.

---

## 📦 Server

- Built with **Express.js**
- Provides two endpoints:
  - `GET /ping`: check server availability
  - `POST /log`: receive and log text sent from the mobile app
  - `GET /qr`: returns a QR code containing the server URL for easier mobile connection
- On startup, logs the local IP address and port the server is running on

---

## 📱 Mobile App

- Built with **React Native** using **Expo**
- Uses **axios** to send requests

### Screens

- **Connection Screen**
  - Lets the user manually input the server address
  - Sends a `GET /ping` request to verify connectivity
  - Displays success or error feedback
- **Text Transfer Screen**
  - Shown only after a successful connection
  - Allows the user to input and send text
  - Sends the text to the `POST /log` endpoint on the server

---

## 🚀 Running the Project

### 1. Start the server

```bash
cd server
npm run start
```

- Copy the server URL (e.g. `http://192.168.1.42:3000`) from the terminal logs.

### 2. Start the mobile app

```bash
cd mobile
npm run start
```

- Scan the QR code with **Expo Go** on your physical device.
- The app should load and display a connection screen.
- Enter the server address and press "Connect to Server".
- Upon a successful response, you'll be redirected to the text sending screen where you can log text to the server.

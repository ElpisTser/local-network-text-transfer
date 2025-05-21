# Text Logger App

A project consisting of a mobile app (built with Expo) and a Node.js server. The mobile app sends text to the server, which logs it. Both parts run on the same local Wi-Fi network.

---

## 📦 Server

- Built with **Express.js**
- Provides two endpoints:
  - `GET /ping`: check server availability
  - `POST /log`: receive and log text sent from the mobile app
- On startup, logs the local IP address and port the server is running on
- Displays a QR code containing the server URL in the terminal for easy scanning and connection

---

## 📱 Mobile App

- Built with **React Native** using **Expo**
- Communicates with the server via **axios**
- Supports both **manual input** and **QR code scanning** for server setup

### Screens

- **Connection Screen**
  - Enter the server URL manually or scan the QR code displayed in the server terminal
  - Performs a `GET /ping` request to verify connectivity
  - Displays connection status and navigates to the next screen upon success
- **Text Transfer Screen**
  - Appears after a successful connection
  - Allows the user to input and send text
  - Sends data to the server's `POST /log` endpoint

---

## 🚀 Running the Project

### 1. Start the server

```bash
cd server
npm install
npm run start
```

- The server URL (e.g. `http://192.168.1.42:3000`) and its QR code will be displayed in the terminal
- Scan the QR code or manually input the URL on the mobile app to connect

### 2. Start the mobile app

```bash
cd mobile
npm install
npm run start
```

- Scan the QR code with **Expo Go** on your physical device
- The app should load and display a connection screen
- Enter the server address manually or tap “Scan QR code” to auto-fill the address
- Upon a successful response, you'll be redirected to the text sending screen where you can log text to the server

---

## Requirements

- Mobile device and server must be on the same local network
- Install **Expo Go** on your phone
- Node.js and npm installed on your development machine
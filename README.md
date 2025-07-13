# Text Logger App

A project consisting of a mobile app (built with Expo) and a Node.js server. The mobile app sends text to the server, which logs it. After connecting, the server can send push notifications to the app to trigger an alert sound. Both parts run on the same local Wi-Fi network.

---

## 📦 Server

- Built with **Express.js**
- Provides endpoints:
  - `POST /ping`: check server availability and register device push tokens
  - `POST /log`: receive and log text sent from the mobile app
  - `GET /pingDevice`: web interface to view connected devices and send push notifications
  - `POST /notify/:token`: send push notification to a specific device using its token
- On startup, logs the local IP address and port the server is running on
- Displays a QR code containing the server URL in the terminal for easy scanning and connection
- Broadcasts its presence on the local network for automatic discovery by the mobile app
- Stores connected devices' push tokens for notification functionality

---

## 📱 Mobile App

- Built with **React Native** using **Expo**
- Communicates with the server via **axios**
- Supports **manual input**, **QR code scanning**, and **network scanning** for server setup
- Enables push notifications and sends device push token to server during connection

### Screens

- **Connection Screen**
  - Enter the server URL manually or scan the QR code displayed in the server terminal
  - Scan the local network to automatically discover available servers
  - Performs a `POST /ping` request to verify connectivity and register device
  - Navigates to the next screen upon success
- **Text Transfer Screen**
  - Appears after a successful connection
  - Allows the user to input and send text
  - Sends data to the server's `POST /log` endpoint

---

## 🔔 Push Notifications

- The mobile app automatically registers for push notifications and sends its token to the server
- Access the device management interface by visiting `http://[server-ip]:[server-port]/pingDevice` in your browser
- View all connected devices and send push notifications with alert sounds to help locate your device
  
---

## 🚀 Running the Project

### 1. Start the server

```bash
cd server
npm install
npm run start
```

- The server URL (e.g. `http://192.168.1.42:3000`) and its QR code will be displayed in the terminal
- The server will broadcast its presence on the local network for automatic discovery
- Scan the QR code or manually input the URL on the mobile app to connect, or use the network scan feature
- Access the device management interface at `http://[server-ip]:[server-port]/pingDevice`

### 2. Start the mobile app

```bash
cd mobile
npm install
npm run start
```

- Download and install the [development build](https://github.com/ElpisTser/local-network-text-transfer/releases/tag/v0.2.0-dev) on your Android device from the releases page.
- Open the app and connect to the Expo development server
- The app should load and display a connection screen
- Enter the server address manually, tap "Scan QR code", or use "Scan Network" to automatically discover servers on your local network
- Upon a successful response, you'll be redirected to the text sending screen where you can log text to the server

---

## Requirements

- Mobile device, Express server, and Expo development server must all be on the same local network
- Install the development build from the releases page on your phone
- Node.js and npm installed on your development machine

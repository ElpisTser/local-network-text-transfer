# Text Logger App

A project consisting of a mobile app (built with Expo) and a Node.js server. The mobile app sends text to the server, which logs it. Both parts run on the same local Wi-Fi network.

---

## 📦 Server

- Built with **Express.js**
- Provides two endpoints:
  - `GET /ping`: check server availability
  - `POST /log`: receive and log text sent from the mobile app
- On startup, logs the local IP address and port the server is running on

---

## 📱 Mobile App

- Built with **React Native** using **Expo**
- Lets the user input text and send it to the server
- Uses **axios** to send requests
- Current IP/port is hardcoded using a local `config.js` file

---

## 🚀 Running the Project

### 1. Start the server

```bash
cd server
npm run start
```

- Copy the server URL (e.g. `http://192.168.1.42:3000`) from the terminal logs.

### 2. Set up the mobile app

Inside the `mobile` directory:
- Create a file named `config.js`:

```js
export const SERVER_URL = 'http://YOUR_LOCAL_IP:PORT';
```

- Replace `YOUR_LOCAL_IP:PORT` with the server URL you copied.

### 3. Start the mobile app

```bash
cd mobile
npm run start
```

- Scan the QR code with **Expo Go** on your physical device.
- The app should load and allow you to sent text to the server. 



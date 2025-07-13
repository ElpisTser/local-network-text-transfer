import React, { useState, useEffect, useRef } from 'react';
import ConnectionScreen from './screens/ConnectionScreen';
import TextTransferScreen from './screens/TextTransferScreen';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform }from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function handleRegistrationError(errorMessage ) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('find-device', {
      name: 'Find Device',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 200, 500, 200, 500],
      sound: 'alert.wav',
      enableVibrate: true,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
      return;
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (err) {
      handleRegistrationError(err.message || String(err));
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}


export default function App() {
  const [serverAddress, setServerAddress] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('idle'); 
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token))
      .catch(err => {
        console.log('Error registering for push notifications:', err);
      })

      if (Platform.OS === 'android') {
        Notifications.getNotificationChannelAsync('find-device').then(value => {console.log(value)});
      }

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Received notification while app was in foreground', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Clicked on notification', response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <>
      {connectionStatus === 'success' ? (
        <TextTransferScreen 
          serverAddress={serverAddress} 
          setConnectionStatus={setConnectionStatus}  
        />
      ) : (
        <ConnectionScreen
          setServerAddress={setServerAddress}
          setConnectionStatus={setConnectionStatus}
          expoPushToken={expoPushToken}
        />
      )}
    </>
  );
}

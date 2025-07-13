import React, { useEffect, useMemo, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';
import Zeroconf from 'react-native-zeroconf';
import * as Device from 'expo-device';

export default function ConnectionScreen({ setServerAddress, setConnectionStatus, expoPushToken }) {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('idle');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [zeroconfScanning, setZeroconfScanning] = useState(false);
  const [abortController, setAbortController] = useState(null);

  const [permission, requestPermission] = useCameraPermissions();

  const zeroconf = useMemo(() => new Zeroconf(), []);

  useEffect(() => {
    if (!expoPushToken) return;

    zeroconf.on('start', () => {
      console.log('Zeroconf started scanning');
    });

    zeroconf.on('stop', () => {
      console.log('Zeroconf stopped scanning');
    });

    zeroconf.on('resolved', async (service) => {
      console.log('Service discovered:', service.name);
      if (service.name === 'Bonjour Broadcast') {
        console.log('Found our server');
        handlePing(service.txt.serverAddress);  
      }
    });

    zeroconf.on('error', (error) => {
      console.log('Zeroconf error:', error);
    });

    return () => {
      console.log('Cleaning up zeroconf');
      zeroconf.stop();
      zeroconf.removeDeviceListeners();
    }
  }, [expoPushToken]);

  const startZeroconfScan = () => {
    zeroconf.scan('http', 'tcp', 'local');
    setZeroconfScanning(true);
  }

  const stopZeroConfScan = () => {
    zeroconf.stop();
    setZeroconfScanning(false);
  }

  const handlePing = async (targetAddress) => {
    const controller = new AbortController();
    setAbortController(controller);
    console.log('Sending ping with token:', expoPushToken);
    try {
      Keyboard.dismiss();

      setStatus('pending');
      
      setZeroconfScanning(false);

      let url = targetAddress.startsWith('http') ? targetAddress : `http://${targetAddress}`;

      const deviceName = Device.deviceName ?? 'Unknown Device';

      const response = await axios.post(`${url}/ping`, {
        token: expoPushToken,
        deviceName: deviceName
      }, {
        timeout: 10000,
        signal: controller.signal
      });
      
      if (response.status === 200) {
        setServerAddress(url);
        setConnectionStatus('success');
        Alert.alert('Connection Successful', 'Server responded to ping!');
      } else {
        setStatus('fail');
        setAddress('');
        Alert.alert('Unexpected Response', `Status: ${response.status}`);
      }
    } catch (error) {
      if (axios.isCancel(error) || error.name === 'AbortError') {
        console.log('Request was cancelled');
        return;
      }

      setStatus('fail');
      setAddress('');
      if (error.response) {
        Alert.alert(
          'Connection Failed',
          `Server responded with status ${error.response.status}`
        );
      } else if (error.request) {
        Alert.alert('Connection Failed', 'No response from server.');
      } else {
        Alert.alert('Connection Failed', 'Could not send request.');
      }
    } finally {
      setAbortController(null);
    }
  };

  const handleCancelRequest = () => {
    if (abortController) {
      console.log('Aborting Request');
      abortController.abort();
    }
    setStatus('idle');
  }

  const handleScan = ({ data }) => {
    if (hasScanned) return;
    setHasScanned(true);
    setScannerVisible(false);
    handlePing(data);
  };

const handleStartScan = async () => {
  setHasScanned(false);
  if (permission?.granted) {
    setScannerVisible(true);
  } else {
    const { granted, canAskAgain } = await requestPermission();
    if (granted) {
      setScannerVisible(true);
    } else {
      Alert.alert(
        'Camera Permission Denied',
        canAskAgain
          ? 'Camera access is needed to scan QR codes. Please allow it in the prompt.'
          : 'Camera access is permanently denied. You can enable it in your device settings.'
      );
    }
  }
};

if (status === 'pending') {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.statusText}>
        Connecting to server
      </Text>
      <Button 
        title="Cancel" 
        onPress={handleCancelRequest} 
        color="gray"
      />
    </View>
  );
}

  return (
    <View style={styles.container}>
      {scannerVisible ? (
        <View style={StyleSheet.absoluteFill}>
          <CameraView
            style={StyleSheet.absoluteFill}
            zoom={0.3}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={handleScan}
          />
          <View style={styles.cancelOverlay}>
            <Button title='Cancel Scan' onPress={() => setScannerVisible(false)}/>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.label}>
            Enter server URL or scan QR code
          </Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder='Server address'
            autoCapitalize='none'
          />
          <Button 
            title='Connect to server' 
            onPress={() => handlePing(address)} 
          />
          <View style={{ marginTop: 10 }}>
            <Button 
              title='Scan QR code' 
              onPress={handleStartScan} 
            />  
          </View> 
          {zeroconfScanning ? (
              <View style={{ marginTop: 10}}>
                <Button 
                  title='Stop scanning for local server' 
                  onPress={stopZeroConfScan} 
                  color='red'
                />
              </View>
          ) : (
              <View style={{ marginTop: 10}}>
                <Button title='Scan for local server' onPress={startZeroconfScan} />
              </View> 
          )}
        </>
      )}
    </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
  },
  scanResult: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  cancelOverlay: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusText: {
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
});


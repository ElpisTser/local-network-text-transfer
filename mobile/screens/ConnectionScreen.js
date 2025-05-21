import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';

export default function ConnectionScreen({ setServerAddress, setConnectionStatus }) {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handlePing = async (targetAddress) => {
    try {
      let url = targetAddress.startsWith('http') ? targetAddress : `http://${targetAddress}`;
      const response = await axios.get(`${url}/ping`);

      if (response.status === 200) {
        setServerAddress(url);
        setConnectionStatus('success');
        setScannedData(null);
        Alert.alert('Connection Successful', 'Server responded to ping!');
      } else {
        setStatus('fail');
        Alert.alert('Unexpected Response', `Status: ${response.status}`);
      }
    } catch (error) {
      setStatus('fail');

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
    }
  };

  const handleScan = ({ data }) => {
    if (hasScanned) return;
    setHasScanned(true);
    setScannerVisible(false);
    setScannedData(data);
    handlePing(data);
  };

const handleStartScan = async () => {
  setHasScanned(false);
  setScannedData(null);
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
          <Button title='Connect to server' onPress={() => handlePing(address)} />
          <View style={{ marginTop: 10 }}>
            <Button title='Scan QR code' onPress={handleStartScan} />  
          </View> 
          {scannedData && (
            <Text style={styles.scanResult}>Scanned: {scannedData}</Text>
          )}
          {status === 'fail' && (
            <Text style={{ marginTop: 10, color:'red' }}>
              Connection Failed
            </Text>
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
});


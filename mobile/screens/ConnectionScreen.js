import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function ConnectionScreen() {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState(null);

const handlePing = async () => {
  try {
    let url = address.startsWith('http') ? address : `http://${address}`;
    const response = await axios.get(`${url}/ping`);
    
    if (response.status === 200) {
      setStatus('success');
      Alert.alert('Connection Successful', 'Server responded to ping!');
    } else {
      setStatus('fail');
      Alert.alert('Unexpected Response', `Status: ${response.status}`);
    }
  } catch (error) {
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

    setStatus('fail');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter server URL (e.g. http://192.168.1.42:3000)</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Server address"
        autoCapitalize="none"
      />
      <Button title="Connect to Server" onPress={handlePing} />
      {status && (
        <Text style={{ marginTop: 10, color: status === 'success' ? 'green' : 'red' }}>
          {status === 'success' ? 'Connected!' : 'Connection failed'}
        </Text>
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
});

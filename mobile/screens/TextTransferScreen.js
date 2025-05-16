import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import axios from 'axios';

export default function TextTransferScreen({ serverAddress }) {
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim()) {
      Alert.alert('Validation Error', 'Text cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(`${serverAddress}/log`, { text });

      if (response.status === 200) {
        Alert.alert('Success', 'Text sent to server!');
        setText('');
      } else {
        Alert.alert('Unexpected Response', `Status: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Server Error', `Status: ${error.response.status}`);
      } else if (error.request) {
        Alert.alert('Network Error', 'No response from server.');
      } else {
        Alert.alert('Error', 'Could not send request.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter text to send to the server:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type your message here"
      />
      <Button title="Send" onPress={handleSend} />
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

import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet} from 'react-native';
import axios from 'axios';
import { SERVER_URL } from './config.js';

export default function App() {
  const [text, setText] = useState('');

  const sendTextToServer = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/log`, {text});
      Alert.alert('Success', response.data.message)
      setText('');
    } catch (err) {
      console.error(err);
      if (err.response) {
        Alert.alert('Error', err.response.data.message || 'Server responded with an error');
      } else {
        Alert.alert('Error', 'Could not connect to server');
      }
    }
  }
  return (
    <View style={styles.container}>
      <TextInput 
        placeholder='Enter text to send'
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <Button title='Send to Server' onPress={sendTextToServer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
  },
});
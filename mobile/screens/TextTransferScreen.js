import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function TextTransferScreen({ serverAddress, setConnectionStatus }) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const handleSend = async () => {
    if (!text.trim()) {
      Alert.alert('Validation Error', 'Text cannot be empty.');
      return;
    }

    if (isSending) return;

    setIsSending(true);

    try {
      const response = await axios.post(`${serverAddress}/log`, { text }, {
        timeout: 5000
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Text sent to server!');
        setText('');
        setErrorCount(0);
      } else {
        handleRequestError('Unexpected Response', `Status: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        handleRequestError('Server Error', `Status: ${error.response.status}`);
      } else if (error.request) {
        handleRequestError('Network Error', 'No response from server.');
      } else {
        handleRequestError('Error', 'Could not send request.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleRequestError = (errorMessage) => {
    const newErrorCount = errorCount + 1;
    setErrorCount(newErrorCount);
  
    Alert.alert(
      'Sending Failed',
      newErrorCount >= 3 
        ? `${errorMessage}.\n\nHaving persistent issues? Try disconnecting and reconnecting to the server.`
        : errorMessage,
      newErrorCount >= 3
        ? [
            { text: 'OK' },
            { 
              text: 'Disconnect',
              onPress: () => setConnectionStatus('idle'),
              style: 'destructive'
            }
          ]
        : [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter text to send to the server:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type your message here"
        editable={!isSending}
      />
      {isSending ?(
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <Button 
          title='Send'
          onPress={handleSend}
          disabled={isSending}
        />
      )}
      <View style = {{marginTop: 10}}>
        <Button
          title="Disconnect"
          onPress={() => setConnectionStatus('idle')}
          disabled={isSending}
          color="#ff4444"
        />
      </View>
      {(errorCount > 0) && (
        <Text style={styles.errorHint}>
          {errorCount} failed attempt{errorCount > 1 && 's'}{errorCount >= 3 && ' - Consider reconnecting'}
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
  loader: {
    marginVertical: 15,
  },
  errorHint: {
    marginTop: 15,
    color: '#ff4444',
    textAlign: 'center',
  },
});

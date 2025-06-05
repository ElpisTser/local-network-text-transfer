import React, { useState } from 'react';
import ConnectionScreen from './screens/ConnectionScreen';
import TextTransferScreen from './screens/TextTransferScreen';

export default function App() {
  const [serverAddress, setServerAddress] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('idle'); // 'idle' | 'success' | 'fail'

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
        />
      )}
    </>
  );
}

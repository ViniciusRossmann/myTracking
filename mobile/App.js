import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from './navigation';
import Colors from './constants/Colors';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [telaInicial, setTelaInicial] = React.useState('Deslogado');

  return (
    <SafeAreaProvider>
      <Navigation telaInicial={telaInicial}/>
      <StatusBar backgroundColor={Colors.colorStatusBar} style="light" />
    </SafeAreaProvider>
  );
}

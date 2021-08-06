import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { AsyncStorage } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import Navigation from './navigation';
import Colors from './constants/Colors';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [telaInicial, setTelaInicial] = React.useState('Deslogado');

  React.useEffect(() => {
    async function asyncTasks() {
      try {
        await SplashScreen.preventAutoHideAsync();

        var user = null;
        try{
          user = await AsyncStorage.getItem('@myTracking:user');
        } catch{
          console.warn("Erro ao ler dados da memoria.");
        }

        if(user){
          setTelaInicial('Logado');
        } else{
          setTelaInicial('Deslogado');
        }

        await SplashScreen.hideAsync();
        setLoadingComplete(true);
      } catch (e) {
        console.warn(e);
      }
    }

    asyncTasks()
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation telaInicial={telaInicial}/>
        <StatusBar backgroundColor={Colors.colorStatusBar} style="light" />
      </SafeAreaProvider>
    );
  }
}

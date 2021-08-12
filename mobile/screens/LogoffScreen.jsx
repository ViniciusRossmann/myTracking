import React from 'react';
import { View, Text, ActivityIndicator, AsyncStorage } from 'react-native';

import Colors from '../constants/Colors';

export default function SairScreen({ route, navigation }) {

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        await AsyncStorage.removeItem('@myTracking:user');
        await AsyncStorage.removeItem('@myTracking:password');
        await AsyncStorage.removeItem('@myTracking:token');
      } catch (error) {
        console.warn(error);
      } finally{
        navigation.navigate("Deslogado");
      }
    });

    return unsubscribe;
  }, [navigation]);
  
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.colorBackground }}>
        <Text style={{color: Colors.colorText, fontSize: 25}}>Saindo</Text>
        <ActivityIndicator size="large" color={Colors.colorPrimary} />
      </View>
    );
  }
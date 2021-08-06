import React from 'react';
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';


//const Drawer = createDrawerNavigator();
function drawerPrincipal() {
    return (
        /*<Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={NavigationLancamento} />
            <Drawer.Screen name="Meus Lancamentos" component={MeusLancamentosScreen} />
            <Drawer.Screen name="Sair" component={LogoffScreen} />
        </Drawer.Navigator>*/
        <HomeScreen />
    )
}

const Stack = createStackNavigator();
export default function Navigation(props) {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={props.telaInicial} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Deslogado" component={LoginScreen} />
                <Stack.Screen name="Logado" component={drawerPrincipal} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

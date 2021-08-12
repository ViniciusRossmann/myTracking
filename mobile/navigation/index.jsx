import React from 'react';
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/DrawerContent';
import LoginScreen from '../screens/LoginScreen';
import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import LogoffScreen from '../screens/LogoffScreen';

const Drawer = createDrawerNavigator();
function drawerPrincipal() {
    return (
        <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{ headerStyle: { backgroundColor: Colors.colorStatusBar }, headerTintColor: Colors.colorText }}>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Sair" component={LogoffScreen} />
        </Drawer.Navigator>
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

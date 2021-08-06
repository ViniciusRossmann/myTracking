import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export default function HomeScreen({ route, navigation }){ 
    return (
        <SafeAreaView style={style.container}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Teste</Text>
        </View>
        </ScrollView>
        </SafeAreaView>
    );
}

//TextInput style
const inputTheme = { colors: {placeholder: Colors.colorText, text: Colors.colorText, primary: Colors.colorText, background: Colors.colorBackground}};

//elements width
const width = Layout.window.width * 0.8;

//stylesheet
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.colorBackground //3579b7
    }
});
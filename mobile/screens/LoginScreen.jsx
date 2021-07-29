import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet, Image, ScrollView, ActivityIndicator, AsyncStorage, SafeAreaView} from 'react-native';
import { SvgXml } from "react-native-svg"; 

import { TextInput } from 'react-native-paper';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

import Logo from '../assets/logo_my_tracking.svg';

//const requests = require('../network/Requests');

export default function LoginScreen({ route, navigation }){ 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const entrarPressionado = async () => {
        if((username == "")||(username==null)||(password=="")||(password==null)){
            Alert.alert("Preecha todos os campos!", "Favor preencher todos os campos para continuar.");
            return;
        }
        
        setLoading(true);
        /*var token = await requests.fazLogin(username, password);

        if (token == "!error"){
            setLoading(false);
            Alert.alert("Atenção!", "Erro ao acessar o servidor.");
        }
        else if(token){
            try{
                await AsyncStorage.setItem('@HMwheels:usuario', username);
                await AsyncStorage.setItem('@HMwheels:senha', password);
                await AsyncStorage.setItem('@HMwheels:token', token);
            }
            catch (error) {
                console.log("Erro ao gravar dados na memoria");
            }

            setLoading(false);
            navigation.navigate('Logado', { screen: 'Home' });
        }
        else{
            setLoading(false);
            Alert.alert("Login inválido!", "Usuário ou senha incorretos, favor verificar.");
            setPassword('');
        }*/

        setLoading(false);//
    }

    return (
        <SafeAreaView style={estilo.container}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View>
                <View style={{ alignItems: 'center' }}>
                    <Image resizeMode="contain" source={require('../assets/logo_my_tracking.png')} style={estilo.logo}/>
                </View>
            
                <TextInput theme={{ colors: {placeholder: Colors.colorText, text: Colors.colorText, primary: Colors.colorText, background: Colors.colorBackground}}} underlineColor={Colors.colorText} selectionColor={Colors.colorPrimary} value={username} autoCapitalize="characters" style={estilo.entrada} label="Usuário" onChangeText={username => setUsername(username)}/>
                <View style={estilo.separador}></View>
                <TextInput theme={{ colors: {placeholder: Colors.colorText, text: Colors.colorText, primary: Colors.colorText, background: Colors.colorBackground}}} underlineColor={Colors.colorText} selectionColor={Colors.colorPrimary} secureTextEntry={true} style={estilo.entrada} label="Senha" value={password} onChangeText={password => setPassword(password)}/>
                    <TouchableOpacity style={estilo.btEntrar} onPress={entrarPressionado}>
                        {loading ? 
                            (<ActivityIndicator size="large" color="#FFF" />) : 
                            (<Text style={estilo.txtEntrar}>Entrar</Text>)
                        }
                    </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
        </SafeAreaView>
    );
}

//constantes frequetemente usadas no estilo
const tamanhoBtns = 18;
const tamanho = 18;
const largura = Layout.window.width * 0.8;

//estilos dos elementos
const estilo = StyleSheet.create({
    separador: {
        height: 20
    },
    container: {
        flex: 1,
        backgroundColor: Colors.colorBackground //3579b7
    },
    entrada:{
        width: largura, //280
        height: 55,
        fontSize: tamanho,
    },
    txtCadastrar:{
        textAlign: "center",
        fontSize: tamanhoBtns,
        color: Colors.colorText,
        marginTop: 20,
        marginBottom: 40,
    },
    btEntrar:{
        backgroundColor: Colors.colorPrimary,
        width: largura,
        height: 45,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo:{
        //width: largura,
        height: 180
    },
    txtEntrar:{
        textAlign: "center",
        fontSize: tamanhoBtns,
        color: Colors.colorText,
    },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import Requests from '../services/Requests';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export default function HomeScreen({ route, navigation }) {
    const [items, setItems] = useState([]);
    const [refreshing, setRefreshing] = useState(true);

    React.useEffect(() => {
        onRefresh();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        Requests.getDeliveries((err, res) => {
            if (err) {
                console.warn(err);
                if (err === "Erro na autenticação.") {
                    navigation.navigate("Sair");
                }
            }
            else setItems(res);
            setRefreshing(false);
        });
    }, []);

    return (
        <SafeAreaView style={style.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        data={items}
                        renderItem={({ item }) =>
                            <TouchableOpacity /*onPress={() => seleciona(item)}*/>
                                <View>
                                    <Text>{item.description}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                        keyExtractor={item => item._id}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

//TextInput style
const inputTheme = { colors: { placeholder: Colors.colorText, text: Colors.colorText, primary: Colors.colorText, background: Colors.colorBackground } };

//elements width
const width = Layout.window.width * 0.8;

//stylesheet
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.colorBackground //3579b7
    }
});
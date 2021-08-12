import { AsyncStorage } from 'react-native';
import Endpoints from './Endpoints'

async function driverLogin(login, password, callback) {
    try {
        let response = await fetchWithTimeout(Endpoints.api + 'driver_auth',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: login,
                    password: password
                })
            });

        if (response.status != 200) {
            callback("Erro ao conectar-se ao servidor.", null);
            return;
        }

        let json_response = await response.json();
        if (!json_response.status) {
            callback(json_response.msg, null);
            return;
        }
        else callback(null, json_response.token);
    }
    catch(error) {
        console.log(error);
        callback("Erro ao conectar-se ao servidor.", null);
    }
}

async function getNewToken(){
    try {
        let login = await AsyncStorage.getItem('@myTracking:user');
        let password = await AsyncStorage.getItem('@myTracking:password');

        let response = await fetchWithTimeout(Endpoints.api + 'driver_auth',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: login,
                    password: password
                })
            });

        if (response.status != 200) return null;

        let json_response = await response.json();
        if (!json_response.status) return null;
        else {
            try{
                await AsyncStorage.setItem('@myTracking:token', json_response.token);
            }catch(err){
                console.warn(err);
            }
            return json_response.token;
        }
    }
    catch(err) {
        console.warn(err);
        return null;
    }
}

async function getDeliveries(callback) {
    try {
        let token = await AsyncStorage.getItem('@myTracking:token');
        let response = await fetchWithTimeout(Endpoints.api + 'get_deliveries',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json', 
                    'x-access-token': token
                }
            });

        if (response.status != 200) {
            token = await getNewToken();
            response = await fetchWithTimeout(Endpoints.api + 'get_deliveries',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json', 
                        'x-access-token': token
                    }
                });
            if (response.status != 200) {
                callback("Erro na autenticação.", null);
                return;
            }
        }

        let json_response = await response.json();
        if (!json_response.status) {
            callback(json_response.msg, null);
            return;
        }
        else callback(null, json_response.data);
    }
    catch(error) {
        console.log(error);
        callback("Erro ao conectar-se ao servidor.", null);
    }
}

async function fetchWithTimeout(resource, options) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);

    return response;
}

module.exports = { driverLogin, getDeliveries };
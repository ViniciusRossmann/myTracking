import { response } from 'express';
import api from './api';

async function getNewToken(){
    const login = localStorage.getItem("user");
    const password = localStorage.getItem("password");
    if (!login || !password){
        localStorage.clear();
        window.location.reload();
        return false;
    }
    var res = await api.post('user_auth', {login: login, password: password}, {headers:{'Content-Type': 'application/json'}});
    if (!res.data.status){
        localStorage.clear();
        window.location.reload();
    }
    else localStorage.setItem('token', res.data.token);
    return res.data.status;
}

async function getDeliveries(){
    var token = localStorage.getItem("token");
    var res;
    try{
        res = await api.post('get_deliveries', null, { headers: { 'Content-Type': 'application/json', 'x-access-token': token} });
        return res.data;
    }
    catch{
        if (await getNewToken()){
            token = localStorage.getItem("token");
            try{
                res = await api.post('get_deliveries', null, { headers: { 'Content-Type': 'application/json', 'x-access-token': token} });
            }
            catch{
                return null;
            }
        }
        return null;
    }
}

//module.exports = { getDeliveries }
export{
    getDeliveries
}
import api from './api';
import User from '../interfaces/User';

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
    }
    catch{
        if (await getNewToken()){
            token = localStorage.getItem("token");
            try{
                res = await api.post('get_deliveries', null, { headers: { 'Content-Type': 'application/json', 'x-access-token': token} });
            }
            catch{
                res = null;
            }
        }
        else res = null;
    }
    if (res?.data) return res.data;
    else return null;
}

async function login(user: string, password: string, callback: any){
    var res = await api.post('user_auth', { login: user, password: password}, { headers: { 'Content-Type': 'application/json' } });
    if (res.data.status) {
        localStorage.setItem('loggedin', "true");
        localStorage.setItem('user', user);
        localStorage.setItem('password', password);
        localStorage.setItem('token', res.data.token);
    }
    callback(res.data.status, res.data.msg);
}

async function register(user: User, callback: any) {
    var res = await api.post('user_register', user, { headers: { 'Content-Type': 'application/json' } });
    callback(res.data.status, res.data.msg);
}

//module.exports = { getDeliveries }
export{
    getDeliveries,
    login,
    register
}
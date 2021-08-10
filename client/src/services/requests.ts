import api from './api';
import * as types from '../types/interfaces';
import { AxiosResponse } from 'axios';

async function getNewToken(): Promise<boolean>{
    const login: string | null = localStorage.getItem("user");
    const password: string | null = localStorage.getItem("password");
    if (!login || !password){
        localStorage.clear();
        window.location.reload();
        return false;
    }
    var res: AxiosResponse = await api.post<types.ApiResponse>('user_auth', {login: login, password: password}, {headers:{'Content-Type': 'application/json'}});
    if (!res.data?.status){
        localStorage.clear();
        window.location.reload();
    }
    else localStorage.setItem('token', res.data.token || "");
    return res.data.status;
}

async function getDeliveries(): Promise<types.Delivery[]>{
    var token: string | null = localStorage.getItem("token");
    var res: AxiosResponse | null;
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
    if (res?.data) return res.data.data || [];
    else return [];
}

async function getDelivery(id: string): Promise<types.Delivery | null>{
    var token: string | null = localStorage.getItem("token");
    var res: AxiosResponse | null;
    try{
        res = await api.post('/delivery/'+id, null, { headers: { 'Content-Type': 'application/json', 'x-access-token': token} });
    }
    catch{
        if (await getNewToken()){
            token = localStorage.getItem("token");
            try{
                res = await api.post('/delivery/'+id, null, { headers: { 'Content-Type': 'application/json', 'x-access-token': token} });
            }
            catch{
                res = null;
            }
        }
        else res = null;
    }
    if (res?.data) return res.data.data || null;
    else return null;
}

async function login(loginReq: types.LoginRequest, callback: (status: boolean, msg: string) => void){
    var res = await api.post('user_auth', loginReq, { headers: { 'Content-Type': 'application/json' } });
    if (res.data.status) {
        localStorage.setItem('loggedin', "true");
        localStorage.setItem('user', loginReq.login);
        localStorage.setItem('password', loginReq.password);
        localStorage.setItem('token', res.data.token);
    }
    callback(res.data.status, res.data.msg);
}

async function register(user: types.User, callback: (status: boolean, msg: string) => void) {
    var res = await api.post('user_register', user, { headers: { 'Content-Type': 'application/json' } });
    callback(res.data.status, res.data.msg);
}

export{
    getDeliveries,
    login,
    register,
    getDelivery
}
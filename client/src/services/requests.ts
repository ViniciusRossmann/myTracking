import api from './api';
import * as types from '../types/interfaces';
import { AxiosResponse } from 'axios';
import { rest } from 'lodash';

function getHeaders(withAuth: boolean){
    if (!withAuth) return { headers: { 'Content-Type': 'application/json' }};
    return {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('x-access-token'),
            'x-refresh-token': localStorage.getItem('x-refresh-token')
        }
    }
}

async function verifyAuthentication(res: AxiosResponse){
    if (res.status == 401){ //unauthorized
        exit();
        return;
    }

    const newToken = res.headers['x-access-token'];
    if (newToken){
        console.log("novo token obtido");
        localStorage.setItem('x-access-token', newToken);
    }
}

function exit() {
    localStorage.clear();
    window.location.reload();
}

async function post(route: string, data: Object, withAuth: boolean): Promise<AxiosResponse> {
    var res; 
    try{
        res = await api.post(route, data, getHeaders(withAuth));
    } catch(error){
        res = error.response;
    }
    if (withAuth) verifyAuthentication(res);
    return res;
}

async function get(route: string, withAuth: boolean): Promise<AxiosResponse> {
    var res; 
    try{
        res = await api.get(route, getHeaders(withAuth));
    } catch(error){
        res = error.response;
    }
    if (withAuth) verifyAuthentication(res);
    return res;
}


async function login(loginReq: types.LoginRequest, callback: (status: number, msg: string) => void){
    const res = await post('user/authentication', loginReq, false);

    if (res?.status == 200){
        localStorage.setItem("loggedin", "true");
        localStorage.setItem("x-access-token", res.data.accessToken);
        localStorage.setItem("x-refresh-token", res.data.refreshToken);
        localStorage.setItem("user-name", res.data.user.name);
    }

    callback(res?.status || 0, res?.data.error || "Erro ao tentar efetuar login.");
}

async function logout(){
    await get('/user/logoff', true);
}

async function getDeliveries(): Promise<types.Delivery[]>{
    const res = await get('/user/deliveries', true);
    if (res?.data.msg) return [];
    return res?.data || [];
}

async function getDelivery(id: string): Promise<types.Delivery | null>{
    const res = await get(`/user/delivery/${id}`, true);
    if (res?.data.msg) return null;
    return res?.data || null;
}

async function register(user: types.User, callback: (status: number, msg: string) => void){
    const res = await post('/user/register', user, false);
    callback(res?.status || 0, res?.data.error || "Erro ao tentar cadastrar usuário.");
}

export{
    login,
    logout,
    getDeliveries,
    getDelivery,
    register
}
import jwt from 'jsonwebtoken';
import UserSession from './models/UserSessionModel';
import { omit } from 'lodash';

export function validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function decodeAcessToken(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        return { valid: true, expired: false, decoded };
    } catch (error) {
        return {
            valid: false,
            expired: error.message === "jwt expired",
            decoded: null,
        };
    }
}

export function getAccessToken(object: Object){
    const token = jwt.sign(object, process.env.SECRET, {
        expiresIn: '15min'
    });
    return token;
}

export async function getNewUserToken(refreshToken: string) {
    const userSession = await UserSession.findOne({token: refreshToken}).populate('user');
    if (!userSession || !userSession.isActive) return null;
    const { user } = userSession;
    const basicUserData = omit(user.toJSON(), "password");
    return getAccessToken({...basicUserData, type: "user"});
}
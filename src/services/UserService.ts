import { DocumentDefinition } from "mongoose";
import User, { UserDocument } from "../models/UserModel";
import UserSession from "../models/UserSessionModel";
import { omit } from 'lodash';

export async function createUser(input: DocumentDefinition<UserDocument>) {
    try {
        if (await User.findOne({email: input.email})) {
            return { error: "Esse email já está em uso." };
        }
        const user = await User.create(input);
        return omit(user.toJSON(), "password");
    } catch (e) {
        return { error: e.message };
    }
}

export async function validateUserPassword(email: string, password: string) {
    try{
        const user = await User.findOne({email});
        if (!user || !(await user.comparePassword(password))){
        return null;
        }
        return omit(user.toJSON(), "password");
    } catch (e) {
        return null;
    }
}


export async function userLogoff(userId: string, refreshToken: string) {
    try {
        if (refreshToken == undefined){
            return { error: 'É necessário informar um token.' };
        }

        const userSession = await UserSession.findOne({refreshToken});
        if (!userSession){
            return { error: 'Token inválido.' };
        }

        if (userSession.user != userId) {
            return { error: 'Sem permissão.' };
        }

        userSession.revoked = new Date(Date.now());
        userSession.save();
        return { msg: 'Token revogado.' };
    } catch (e) {
        return { error: e.message };
    }
}


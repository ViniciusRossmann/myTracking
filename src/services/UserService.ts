import { DocumentDefinition } from "mongoose";
import User, { UserDocument } from "../models/UserModel";
import { omit } from 'lodash';

export async function createUser(input: DocumentDefinition<UserDocument>) {
    try {
        if (await User.findOne({email: input.email})) {
            return { error: "Esse email já está em uso." };
        }
        const user = await User.create(input);
        return omit(user.toJSON(), "password");
    } catch (error) {
        throw new Error(error);
    }
}

export async function validatePassword(email: string, password: string) {
    const user = await User.findOne({email});
    if (!user || !(await user.comparePassword(password))){
      return null;
    }
    return omit(user.toJSON(), "password");
}


import { DocumentDefinition } from "mongoose";
import Driver, { DriverDocument } from "../models/DriverModel";
import { omit } from 'lodash';

export async function createDriver(input: DocumentDefinition<DriverDocument>) {
    try {
        if (await Driver.findOne({email: input.email})) {
            return { error: "Esse email já está em uso." };
        }
        const driver = await Driver.create(input);
        return omit(driver.toJSON(), "password");
    } catch (error) {
        throw new Error(error);
    }
}

export async function validatePassword(email: string, password: string) {
    const driver = await Driver.findOne({email});
    if (!driver || !(await driver.comparePassword(password))){
      return null;
    }
    return omit(driver.toJSON(), "password");
}


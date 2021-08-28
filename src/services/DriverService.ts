import { DocumentDefinition } from "mongoose";
import Driver, { DriverDocument } from "../models/DriverModel";
import DriverSession from "../models/DriverSessionModel";
import { omit } from 'lodash';

export async function createDriver(input: DocumentDefinition<DriverDocument>) {
    try {
        if (await Driver.findOne({ email: input.email })) {
            return { error: "Esse email já está em uso." };
        }
        const driver = await Driver.create(input);
        return omit(driver.toJSON(), "password");
    } catch (e) {
        return { error: e.message };
    }
}

export async function validateDriverPassword(email: string, password: string) {
    try {
        const driver = await Driver.findOne({ email });
        if (!driver || !(await driver.comparePassword(password))) {
            return null;
        }
        return omit(driver.toJSON(), "password");
    } catch (e) {
        return null;
    }
}

export async function driverLogoff(driverId: string, refreshToken: string) {
    try {
        if (refreshToken == undefined){
            return { error: 'É necessário informar um token.' };
        }

        const driverSession = await DriverSession.findOne({refreshToken});
        if (!driverSession){
            return { error: 'Token inválido.' };
        }

        if (driverSession.driver != driverId) {
            return { error: 'Sem permissão.' };
        }

        driverSession.revoked = new Date(Date.now());
        driverSession.save();
        return { msg: 'Token revogado.' };
    } catch (e) {
        return { error: e.message };
    }
}


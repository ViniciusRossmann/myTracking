import { DocumentDefinition } from "mongoose";
import Delivery, { DeliveryDocument } from "../models/DeliveryModel";
import { Location } from "../interfaces";
const { sendMessage } = require('../connectors/SocketConnector');

export async function createDelivery(input: DocumentDefinition<DeliveryDocument>) {
    try {
        const delivery = await Delivery.create(input);
        return delivery.toJSON();
    } catch (e) {
        return { error: e.message };
    }
}

export async function updateDelivery(id: string, driverId: string, status: number, location: Location) {
    const delivery = await Delivery.findOne({ _id: id });
    if (!delivery) {
        return { error: "Código de viagem inválido." };
    }
    if (delivery.driver != driverId) {
        return { error: "Tentativa de alterar viagem de outro motorista." };
    }

    if (location) {
        delivery.location = location;
    }
    if (status) {
        delivery.status = status;
    }
    try {
        delivery.save();

        if (location) {
            //send new location to clients
            sendMessage(String(delivery._id), 'update_location', location);
        }

        return delivery.toJSON();
    } catch (e) {
        return { error: e.message };
    }
}

export async function getDelivery(id: string, userId: string, userType: string) {
    try {
        var delivery;
        if (userType == 'user') {
            delivery = await Delivery.findOne({ _id: id }).populate('driver', '_id name email');
        }
        else { //driver
            delivery = await Delivery.findOne({ _id: id }).populate('user', '_id name email');
        }
        if (!delivery) {
            return { error: "Código de viagem inválido." };
        }
        if (delivery.get(userType) != userId) { //delivery belongs to current user/driver
            return { error: "Sem permissão para acessar essa viagem." };
        }
        return delivery.toJSON();
    } catch (e) {
        return { error: e.message };
    }
}

export async function getDeliveries(userId: string, userType: string) {
    try {
        var deliveries;
        if (userType === 'user') {
            deliveries = await Delivery.find({ user: userId }).populate('driver', '_id name email');
        }
        else { //driver
            deliveries = await Delivery.find({ driver: userId }).populate('user', '_id name email');
        }
        return deliveries;
    } catch (e) {
        return { error: e.message };
    }
}


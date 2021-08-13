import * as mongoose from "mongoose";
import { Position } from '../interfaces';

export interface DeliveryDocument extends mongoose.Document {
    description: string;
    user: string;
    driver: string;
    status: number;
    position: Position;
}

const DeliverySchema = new mongoose.Schema(
    {
        description: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
        status: { type: Number, default: 0 },
        position: { type: Object }
    }
);

const Delivery = mongoose.model<DeliveryDocument>("Delivery", DeliverySchema);

export default Delivery;
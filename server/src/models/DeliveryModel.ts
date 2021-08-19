import * as mongoose from "mongoose";
import { Location } from '../interfaces';

export interface DeliveryDocument extends mongoose.Document {
    description: string;
    user: string;
    driver: string;
    status: number;
    location: Location;
}

const DeliverySchema = new mongoose.Schema(
    {
        description: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
        status: { type: Number, default: 0 },
        location: { type: Object }
    },
    {
        versionKey: false
    }
);

const Delivery = mongoose.model<DeliveryDocument>("Delivery", DeliverySchema);

export default Delivery;
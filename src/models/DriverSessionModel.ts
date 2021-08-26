import mongoose from "mongoose";
import { DriverDocument } from "./DriverModel";

export interface DriverSessionDocument extends mongoose.Document {
  driver: DriverDocument["_id"];
  token: string;
  expires: Date;
  userAgent: string;
  created: Date;
  revoked: Date;
  isActive(): boolean;
}

const DriverSessionSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    token: String,
    expires: Date,
    userAgent: String,
    created: { type: Date, default: Date.now },
    revoked: Date
  },
  {
    versionKey: false
  }
);

DriverSessionSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expires;
});

DriverSessionSchema.virtual('isActive').get(function () {
  return !this.revoked && !this.isExpired;
});

const DriverSession = mongoose.model<DriverSessionDocument>("DriverSession", DriverSessionSchema);

export default DriverSession;
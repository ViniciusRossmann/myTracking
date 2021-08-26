import mongoose from "mongoose";
import { UserDocument } from "./UserModel";

export interface UserSessionDocument extends mongoose.Document {
  user: UserDocument["_id"];
  token: string;
  expires: Date;
  userAgent: string;
  created: Date;
  revoked: Date;
  isActive(): boolean;
}

const UserSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

UserSessionSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expires;
});

UserSessionSchema.virtual('isActive').get(function () {
  return !this.revoked && !this.isExpired;
});

const UserSession = mongoose.model<UserSessionDocument>("UserSession", UserSessionSchema);

export default UserSession;
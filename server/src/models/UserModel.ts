import * as mongoose from "mongoose";
const bcrypt = require("bcrypt");

export interface UserDocument extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
    }
);

UserSchema.pre("save", async function (next: mongoose.HookNextFunction) {
    let user = this as UserDocument;
    user.password = await bcrypt.hashSync(user.password, 10);
    return next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model<UserDocument>("user", UserSchema);

export default User;
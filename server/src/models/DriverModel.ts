import * as mongoose from "mongoose";
const bcrypt = require("bcrypt");

export interface DriverDocument extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const DriverSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
    }
);

DriverSchema.pre("save", async function (next: mongoose.HookNextFunction) {
    let driver = this as DriverDocument;
    driver.password = await bcrypt.hashSync(driver.password, 10);
    return next();
});

DriverSchema.methods.comparePassword = async function (candidatePassword: string) {
    const driver = this as DriverDocument;
    return bcrypt.compare(candidatePassword, driver.password).catch((e) => false);
};

const Driver = mongoose.model<DriverDocument>("Driver", DriverSchema);

export default Driver;
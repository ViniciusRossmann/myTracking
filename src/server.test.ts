import connect from "./db/connect";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createUser } from "./services/UserService";
import { createDriver } from "./services/DriverService";
const test = require('tape');

(async () => {
    const mongod = await MongoMemoryServer.create();
    const dbUri = await mongod.getUri();

    test('Connecting to database', (t) => {
        connect(dbUri, (err, status) => {
            t.error(err, 'Error is null');
            t.isEqual(status, 'Database connected', 'Successful connection');
            t.end();
        });
    });

    test('Insert new user', async (t) => {
        const user: any = {
            name: "Joao das neves",
            email: "joao@gmail.com",
            password: "123456"
        }
        try{
            const res: any = await createUser(user);
            t.equal(res.error, undefined, "User created");
        } catch(err) {
            t.fail(err);
        }
        t.end();
    });

    test('Insert new user with email in use', async (t) => {
        const user: any = {
            name: "Joao das neves",
            email: "joao@gmail.com",
            password: "123456"
        }
        try{
            const res: any = await createUser(user);
            t.equal(res.error, "Esse email já está em uso.", "Duplicate email error");
        } catch(err) {
            t.fail(err);
        }
        t.end();
    });

    test('Insert new driver', async (t) => {
        const driver: any = {
            name: "José bacana",
            email: "jose@gmail.com",
            password: "123456"
        }
        try{
            const res: any = await createDriver(driver);
            t.equal(res.error, undefined, "Driver created");
        } catch(err) {
            t.fail(err);
        }
        t.end();
    });

    test('Insert new driver with email in use', async (t) => {
        const driver: any = {
            name: "José bacana",
            email: "jose@gmail.com",
            password: "123456"
        }
        try{
            const res: any = await createDriver(driver);
            t.equal(res.error, "Esse email já está em uso.", "Duplicate email error");
        } catch(err) {
            t.fail(err);
        }
        t.end();
    });
})()

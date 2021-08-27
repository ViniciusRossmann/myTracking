import connect from "./db/connect";
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from "./models/UserModel";
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
        const user = {
            name: "Joao das neves",
            email: "joao@gmail.com",
            password: "123456"
        }
        try{
            const res = await User.create(user);
            t.notEqual(res, null, "User created");
        } catch(err) {
            t.fail(err);
        }
        t.end();
    });

    test('Insert new user with email in use', async (t) => {
        const user = {
            name: "Joao das neves",
            email: "joao@gmail.com",
            password: "123456"
        }
        try{
            const res = await User.create(user);
            t.fail("Allowed to insert with duplicate email");
        } catch(err) {
            t.equal(String(err).includes("duplicate key"), true, "Duplicate key error");
        }
        t.end();
    });
})()

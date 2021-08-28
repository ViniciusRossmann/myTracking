import connect from "./connectors/DbConnector";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createUser, validateUserPassword } from "./services/UserService";
import { createDriver, validateDriverPassword } from "./services/DriverService";
import { createDelivery, getDelivery, getDeliveries } from "./services/DeliveryService";
const test = require('tape');

(async () => {
    const mongod = await MongoMemoryServer.create();
    const dbUri = await mongod.getUri();
    var insertedUserId, insertedDriverId;

    test('Connect to database', (t) => {
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
            var res: any = await createUser(user);
            t.equal(res.error, undefined, "User created - successful");
            insertedUserId = res._id;

            res = await createUser(user);
            t.equal(res.error, "Esse email já está em uso.", "Not allow duplicate email");
        } catch(err) {
            t.fail(err);
        }
    });

    test('User login', async (t) => {
        var res = await validateUserPassword('joao@gmail.com', '123456');
        t.notEqual(res, null, "Successful login");

        res = await validateUserPassword('joao@gmail.com', 'wrong');
        t.equal(res, null, "Invalid email or password");

        t.end();
    });

    test('Insert new driver', async (t) => {
        const driver: any = {
            name: "José bacana",
            email: "jose@gmail.com",
            password: "123456"
        }
        try{
            var res: any = await createDriver(driver);
            t.equal(res.error, undefined, "Driver created - successful");
            insertedDriverId = res._id;

            res = await createDriver(driver);
            t.equal(res.error, "Esse email já está em uso.", "Not allow duplicate email");
        } catch(err) {
            t.fail(err);
        }
    });

    test('Driver login', async (t) => {
        var res = await validateDriverPassword('jose@gmail.com', '123456');
        t.notEqual(res, null, "Successful login");

        res = await validateDriverPassword('joao@gmail.com', 'wrong');
        t.equal(res, null, "Invalid email or password");

        t.end();
    });

    test('Insert new Delivery', async (t) => {
        var delivery: any = {
            description: "Viagem teste",
            user: insertedUserId,
            driver: insertedDriverId
        }

        var res: any = await createDelivery(delivery);
        t.notEqual(res._id, null, "Delivery created");

        t.end();
    });

    test('Get deliveries', async (t) => {
        var res: any = await getDeliveries(insertedUserId, 'user');
        t.equal(res[0].description, 'Viagem teste', "Get user deliveries");

        res = await getDeliveries(insertedDriverId, 'driver');
        t.equal(res[0].description, 'Viagem teste', "Get driver deliveries");

        t.end();
    });
})()

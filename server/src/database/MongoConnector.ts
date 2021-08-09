import { User, Delivery, Driver, Position } from '../interfaces'
var mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const { sendMessage } = require('../socketControler');

class MongoConnector {

    async getDB(callback) {
        MongoClient.connect(process.env.DB_CONNECT, (err, client) => {
            if (err) callback(err, null);
            else {
                callback(null, client.db('myTrackingDB'));
            }
        });
    }

    async insertDriver(driver: Driver, callback) {
        this.getDB((err, db) => {
            if (err) callback(err, null);
            else db.collection('driver').save(driver, (err, result) => {
                if (err) callback(err, null);
                else callback(null, result);
            });
        });
    }

    async getDriverByEmail(email: string, callback) {
        var query = { email: email };
        this.getDB((err, db) => {
            if (err) callback(err, null);
            else db.collection("driver").find(query).toArray(function (err, result) {
                if (err) callback(err, null);
                else callback(null, result[0]);
            });
        });
    }

    async getDriverById(id: string, callback) {
        try {
            var o_id = new mongo.ObjectID(id);
            var query = { _id: o_id };
            this.getDB((err, db) => {
                if (err) callback(err, null);
                else db.collection("driver").find(query).toArray(function (err, result) {
                    if (err) callback(err, null);
                    else callback(null, result[0]);
                });
            });
        } catch (err) {
            callback(err, null);
        }
    }

    async insertUser(user: User, callback) {
        this.getDB((err, db) => {
            if (err) callback(err, null);
            else db.collection('user').save(user, (err, result) => {
                if (err) callback(err, null);
                else callback(null, result);
            });
        });
    }

    async getUserByEmail(email: string, callback) {
        var query = { email: email };
        this.getDB((err, db) => {
            if (err) callback(err, null);
            else db.collection("user").find(query).toArray(function (err, result) {
                if (err) callback(err, null);
                else callback(null, result[0]);
            });
        });
    }

    async getUserById(id: string, callback) {
        try {
            var o_id = new mongo.ObjectID(id);
            var query = { _id: o_id };
            this.getDB((err, db) => {
                if (err) callback(err, null);
                else db.collection("user").find(query).toArray(function (err, result) {
                    if (err) callback(err, null);
                    else callback(null, result[0]);
                });
            });
        } catch (err) {
            callback(err, null);
        }
    }

    async insertDelivery(delivery: Delivery, callback) {
        this.getDB((err, db) => {
            if (err) callback(err, null);
            else db.collection('delivery').save(delivery, (err, result) => {
                if (err) callback(err, null);
                else callback(null, result);
            });
        });
    }

    async getDeliveriesByUser(email: string, callback) {
        var query = { user_email: email };
        this.getDB((err, db) => {
            if (err) callback(err, null);
            else db.collection("delivery").find(query).toArray(function (err, result) {
                if (err) callback(err, null);
                else callback(null, result);
            });
        });
    }

    async getDeliveriesByDriver(email: string, callback) {
        var query = { driver_email: email };
        this.getDB((err, db) => {
            if (err) callback(err, null);
            else db.collection("delivery").find(query).toArray(function (err, result) {
                if (err) callback(err, null);
                else callback(null, result);
            });
        });
    }

    async getDeliveryById(id: string, callback) {
        try {
            var o_id = new mongo.ObjectID(id);
            var query = { _id: o_id };
            this.getDB((err, db) => {
                if (err) callback(err, null);
                else db.collection("delivery").find(query).toArray(function (err, result) {
                    if (err) callback(err, null);
                    else callback(null, result[0]);
                });
            });
        } catch (err) {
            callback(err, null);
        }
    }

    async updateDeliveryPosition(id: String, position: Position, callback) {
        try {
            var o_id = new mongo.ObjectID(id);
            var query = { _id: o_id };
            var newvalues = { $set: { position: position } };
            this.getDB((err, db) => {
                if (err) callback(err, null);
                else db.collection("delivery").updateOne(query, newvalues, function (err, result) {
                    if (err) callback(err, null);
                    else {
                        sendMessage(id, 'update_location', position);
                        callback(null, result);
                    }
                });
            });
        } catch (err) {
            callback(err, null);
        }
    }
}

export default new MongoConnector;
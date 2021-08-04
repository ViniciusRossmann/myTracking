var mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"

import { User } from '../interfaces'

class MongoConnector {

    async getDB(callback) {
        MongoClient.connect(uri, (err, client) => {
            if (err) callback(err, null);
            else {
                callback(null, client.db('myTrackingDB'));
            }
        });
    }

    async getDriver(email: string, callback) {
        var query = { email: email };
        this.getDB((err, db) => {
            if (err) callback(err, null);
            else db.collection("driver").find(query).toArray(function (err, result) {
                if (err) callback(err, null);
                else callback(null, result[0]);
            });
        });
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

}

export default new MongoConnector;
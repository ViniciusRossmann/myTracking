//configurando o mongoDB
var mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"

class MongoConnector {

    async getDB(callback) {
        MongoClient.connect(uri, (err, client) => {
            if (err) callback(err, null);
            else {
                callback(null, client.db('rastrearDB'));
            }
        });
    }

    async getViagens(user, callback) {
        var query = { cpf: user.cpf.replace(/[^0-9]/g, ""), cep: user.cep.replace(/[^0-9]/g, "") };
        this.getDB((err, db) => {
            if (err) callback(err, null);
            else db.collection("viagens").find(query).toArray(function (err, result) {
                if (err) callback(err, null);
                else callback(null, result);
            });
        });
    }

}

export default new MongoConnector;
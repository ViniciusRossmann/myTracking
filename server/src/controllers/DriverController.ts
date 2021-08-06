import * as express from 'express';
import MongoConnector from '../database/MongoConnector';

const bcrypt = require('bcrypt');
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

class DriverController {

  //authenticate driver login and returns an access token
  async authentication(request: express.Request, response: express.Response) {
    const { login, password } = request.body;
    if (login == "" || password == "" || (!login || !password)) {
      return response.json({ status: false, msg: "Dados insuficientes", token: null });
    }
    MongoConnector.getDriver(login, (err, driver) => {
      if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados", token: null });
      if (!driver || driver == {}) {
        return response.json({ status: false, msg: "Email inválido", token: null });
      }
      else {
        bcrypt.compare(password, driver.senha, function (e, r) {
          if (r) {
            const id = driver._id;
            const token = jwt.sign({ id: id, channel: "driver" }, process.env.SECRET, {
              expiresIn: 300 // expires in 5min
            });
            return response.json({ status: true, msg: "Autenticação efetuada", token: token });
          }
          else {
            return response.json({ status: false, msg: "Senha incorreta", token: null });
          }
        });
      }
    });
  }

}

export default new DriverController;
import * as express from 'express';
import MongoConnector from '../database/MongoConnector';
import { Driver } from '../interfaces'

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
    MongoConnector.getDriverByEmail(login, (err, driver) => {
      if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados", token: null });
      if (!driver) {
        return response.json({ status: false, msg: "Email inválido", token: null });
      }
      else {
        bcrypt.compare(password, driver.password, function (err, res) {
          if (res) {
            const id = driver._id;
            const token = jwt.sign({ id: id, channel: "driver" }, process.env.SECRET, {
              expiresIn: '3h' // expires in 3h
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

  //register a new driver
  async register(request: express.Request, response: express.Response) {
    var { name, email, password } = request.body;
    if (!name || !email || !password) return response.json({ status: false, msg: "Dados inválidos" });

    MongoConnector.getDriverByEmail(email, (err, res) => {
      if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados" });
      else if (res) {
        return response.json({ status: false, msg: "Email em uso" });
      }
      else {
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) {
            response.json({ status: false, msg: "Erro ao salvar motorista" });
          }
          else {
            var driver: Driver = {
              name: name,
              email: email,
              password: hash
            }

            MongoConnector.insertDriver(driver, (err, res) => {
              if (err) response.json({ status: false, msg: "Erro ao salvar motorista" });
              else response.json({ status: true, msg: "Motorista cadastrado" });
            });
          }
        });
      }

    });
  }

}

export default new DriverController;
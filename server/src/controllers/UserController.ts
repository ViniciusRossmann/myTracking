import * as express from 'express';
import MongoConnector from '../database/MongoConnector';
import { User } from '../interfaces'

const bcrypt = require('bcrypt');
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

class UserController {

  //authenticate user login and returns an access token
  async authentication(request: express.Request, response: express.Response) {
    const { login, password } = request.body;
    if (!login || !password) {
      return response.json({ status: false, msg: "Dados insuficientes", token: null });
    }
    MongoConnector.getUserByEmail(login, (err, user) => {
      if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados", token: null });
      if (!user) {
        return response.json({ status: false, msg: "Email inválido", token: null });
      }
      else {
        bcrypt.compare(password, user.password, function (err, res) {
          if (res) {
            const id = user._id;
            const token = jwt.sign({ id: id, channel: "user" }, process.env.SECRET, {
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

  //register a new user
  async register(request: express.Request, response: express.Response) {
    var { name, email, password } = request.body;
    if (!name || !email || !password) return response.json({ status: false, msg: "Dados inválidos" });

    MongoConnector.getUserByEmail(email, (err, res) => {
      if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados" });
      else if (res) {
        return response.json({ status: false, msg: "Email em uso" });
      }
      else {
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) {
            response.json({ status: false, msg: "Erro ao salvar usuário" });
          }
          else {
            var user: User = {
              name: name,
              email: email,
              password: hash
            }

            MongoConnector.insertUser(user, (err, res) => {
              if (err) response.json({ status: false, msg: "Erro ao salvar usuário" });
              else response.json({ status: true, msg: "Usuário cadastrado" });
            });
          }
        });
      }

    });
  }

}

export default new UserController;
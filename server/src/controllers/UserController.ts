import * as express from 'express';

import MongoConnector from '../database/MongoConnector';

class User {
  nome: string;
  cpf: string;
  cep: string;
}

declare module 'express-session' {
  interface SessionData {
    loggedin: Boolean;
    user: User;
  }
}

class UserController {

  async acessar(request: express.Request, response: express.Response) {
    const { nome, cpf, cep } = request.body;
    if (nome == "" || cpf == "" || cep == "" || (!nome || !cpf || !cep)) {
      return response.json({ status: false, msg: "Dados inválidos!" });
    }
    MongoConnector.getViagens({ cpf: cpf, cep: cep }, (err, data) => {
      if (err) return response.json({ status: false, msg: "Erro inesperado!" });
      if (data.length == 0) {
        return response.json({ status: false, msg: "Nenhuma viagem encontrada!" });
      }
      else {
        request.session.loggedin = true;
        var user: User = {
          nome: nome,
          cpf: cpf,
          cep: cep
        }
        request.session.user = user;
        return response.json({ status: true, msg: "Ok" });
      }
    });
  }

  async session(request: express.Request, response: express.Response) {
    if (request.session.loggedin) {
      return response.json({ status: true, user: request.session.user });
    }
    else return response.json({ status: false });
  }

  async logout(request: express.Request, response: express.Response) {
    request.session.loggedin = false;
    request.session.user = null;
    return response.json({});
  }

}

export default new UserController;
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

class DeliverController {

  async getDeliveries(request: express.Request, response: express.Response) {
    if (!request.session.loggedin) {
      return response.json({ status: false, msg: "Auth error", data: [] });
    }
    MongoConnector.getViagens({ cpf: request.session.user.cpf, cep: request.session.user.cep }, (err, data) => {
      if (err) return response.json({ status: false, msg: "Erro inesperado!", data: [] });
      else {
        return response.json({ status: true, msg: "Ok", data: data });
      }
    });
  }

}

export default new DeliverController;
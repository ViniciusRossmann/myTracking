import * as express from 'express';

import MongoConnector from '../database/MongoConnector';


class DeliverController {

  async getDeliveries(request: express.Request, response: express.Response) {
    const { userId } = request.body;
    return response.json({ status: true, msg: "Viagens do usuario: "+userId , data: [] });
  }

}

export default new DeliverController;
import * as express from 'express';

import MongoConnector from '../database/MongoConnector';

class MotoristaController {

  async authMotorista(request: express.Request, response: express.Response) {
    
        return response.json({ status: true, msg: "Ainda não configurado" });

  }

}

export default new MotoristaController;
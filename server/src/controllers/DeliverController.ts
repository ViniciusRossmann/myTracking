import * as express from 'express';
import MongoConnector from '../database/MongoConnector';
import { Delivery } from '../interfaces'


class DeliverController {

  async newDelivery(request: express.Request, response: express.Response) {
    /*
    description: string;
    user_email: string;
    driver_email: string;
    position?: Position;
    */

    var delivery: Delivery = {
      description: "",
      driver_email: "",
      user_email: ""
    }
    response.json({status: false, msg: "ainda não implementado"});
  }

  async getDeliveries(request: express.Request, response: express.Response) {
    const { userId } = request.body;
    if (!userId || userId==""){
      return response.json({ status: false, msg: "Não foi possivel identificar o usuário." , data: [] });
    }
    MongoConnector.getUserById(userId, (err, user)=>{
      if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados", data: [] });
      if (!user || user == {}) {
        return response.json({ status: false, msg: "Não foi possivel identificar o usuário. rere", data: [] });
      }
      MongoConnector.getDeliveriesByUser(user.email, (err, data)=>{
        if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados", data: [] });
        return response.json({ status: true, msg: "Lista de entragas do usuário "+userId, data: data });
      });
    });
  }

}

export default new DeliverController;
import * as express from 'express';
import MongoConnector from '../database/MongoConnector';
import { Delivery } from '../interfaces'


class DeliverController {

  async newDelivery(request: express.Request, response: express.Response) {
    const { userId, description, user_email } = request.body;
    if (!userId || userId==""){
      return response.json({ status: false, msg: "Não foi possivel identificar o motorista." });
    }
    if (!description || !user_email) return response.json({ status: false, msg: "Dados inválidos" });

    MongoConnector.getDriverById(userId, (err, driver)=>{
      if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados." });
      if (!driver || driver == {}) {
        return response.json({ status: false, msg: "Não foi possivel identificar o motorista." });
      }
      MongoConnector.getUserByEmail(user_email, (err, user) => {
        if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados." });
        if (!user) {
          return response.json({ status: false, msg: "Não existe usuário cadastrado com esse email." });
        }
        else{
          var delivery: Delivery = {
            description: description,
            user_email: user_email,
            driver_email: driver.email,
          }
          MongoConnector.insertDelivery(delivery, (err, res) => {
            if (err) response.json({ status: false, msg: "Erro ao salvar viagem." });
            else response.json({ status: true, msg: "Viagem cadastrada." });
          });
        }
      });
    });
  }

  async getDeliveries(request: express.Request, response: express.Response) {
    const { userId, userType } = request.body;
    if (!userId || userId=="" || (userType != 'user' && userType != 'driver')){
      return response.json({ status: false, msg: "Não foi possivel identificar o usuário." , data: [] });
    }
    if (userType == 'user') {
      MongoConnector.getUserById(userId, (err, user)=>{
        if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados.", data: [] });
        if (!user || user == {}) {
          return response.json({ status: false, msg: "Não foi possivel identificar o usuário.", data: [] });
        }
        MongoConnector.getDeliveriesByUser(user.email, (err, data)=>{
          if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados.", data: [] });
          return response.json({ status: true, msg: "Lista de entregas do usuário "+userId, data: data });
        });
      });
    }
    if (userType == 'driver') {
      MongoConnector.getDriverById(userId, (err, driver)=>{
        if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados", data: [] });
        if (!driver || driver == {}) {
          return response.json({ status: false, msg: "Não foi possivel identificar o motorista.", data: [] });
        }
        MongoConnector.getDeliveriesByDriver(driver.email, (err, data)=>{
          if (err) return response.json({ status: false, msg: "Erro inesperado ao acessar a base de dados", data: [] });
          return response.json({ status: true, msg: "Lista de entregas do motorista "+userId, data: data });
        });
      });
    }
  }

}

export default new DeliverController;
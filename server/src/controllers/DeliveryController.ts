import { Request, Response } from 'express';
import Delivery from '../models/DeliveryModel';
const { sendMessage } = require('../socketControler');

class DeliverController {

  async newDelivery(req: Request, res: Response) {
    try {
      // @ts-ignore
      await Delivery.create({...req.body, driver: req.user._id});
      return res.status(201).json({msg: "Entrega cadastrada com sucesso."});
    } catch (e) {
      return res.status(409).json({error: e.message});
    }
  }

  async updatePosition(req: Request, res: Response) {
    // @ts-ignore
    const { user } = req;
    const { position } = req.body;
    const { id } = req.params;
    if (!position || position.lat===undefined || position.long===undefined || !id){
      return res.status(400).json({ error: "Dados inválidos."});
    }
    const delivery = await Delivery.findOne({ _id: id });
    if (!delivery) {
      return res.status(400).json({ error: "Código de viagem inválido."});
    }
    if (delivery.driver!=user._id){
      return res.status(401).json({ error: "Sem permissão."});
    }
    delivery.position = position;
    delivery.save();

    //send socket message to clients
    sendMessage(delivery._id, 'update_location', position);

    return res.status(200).json({ msg: "Localização atualizada com sucesso." });
  }

  async getDelivery(req: Request, res: Response) {
    // @ts-ignore
    const { user } = req;
    const { id } = req.params;
    const delivery = await Delivery.findOne({ _id: id });
    if (!delivery) {
      return res.status(400).json({ error: "Código de viagem inválido."});
    }
    if (delivery.get(user.type)==user._id){
      return res.status(200).json({ ...delivery.toJSON() });
    }
    return res.status(401).json({ error: "Sem permissão."});
  }

  async getDeliveries(req: Request, res: Response) {
    // @ts-ignore
    const { user } = req;
    var deliveries;
    if (user.type === 'user'){
      deliveries = await Delivery.find({ user: user._id });
    }
    else { //driver
      deliveries = await Delivery.find({ driver: user._id });
    }
    return res.status(200).json(deliveries);
  }

}

export default new DeliverController;
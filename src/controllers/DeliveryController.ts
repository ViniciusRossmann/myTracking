import { Request, Response } from 'express';
import Delivery from '../models/DeliveryModel';
const { sendMessage } = require('../socketControler');

class DeliverController {
  //driver register new delivery
  async newDelivery(req: Request, res: Response) {
    try {
      // @ts-ignore
      await Delivery.create({ ...req.body, driver: req.user._id });
      return res.status(201).json({ msg: "Entrega cadastrada com sucesso." });
    } catch (e) {
      return res.status(409).json({ error: e.message });
    }
  }

  //driver update delivery status/location
  async update(req: Request, res: Response) {
    try {
      // @ts-ignore
      const { user } = req;
      const { location, status } = req.body;
      const { id } = req.params;
      if (!status && !location) {
        return res.status(400).json({ error: "Dados inválidos." });
      }
      const delivery = await Delivery.findOne({ _id: id });
      if (!delivery) {
        return res.status(400).json({ error: "Código de viagem inválido." });
      }
      if (delivery.driver != user._id) {
        return res.status(401).json({ error: "Sem permissão." });
      }

      if (location) {
        delivery.location = location;

        //send new location to clients
        sendMessage(String(delivery._id), 'update_location', location);
      }
      if (status) {
        delivery.status = status;
      }
      delivery.save();

      return res.status(200).json({ msg: "Registro atualizado com sucesso." });
    }
    catch (e) {
      return res.status(409).json({ error: e.message });
    }
  }

  //get delivery information by id (user/driver)
  async getDelivery(req: Request, res: Response) {
    try {
      // @ts-ignore
      const { user } = req;
      const { id } = req.params;
      var delivery;
      if (user.type=='user'){
        delivery = await Delivery.findOne({ _id: id }).populate('driver', '_id name email');
      }
      else{ //driver
        delivery = await Delivery.findOne({ _id: id }).populate('user', '_id name email');
      }
      if (!delivery) {
        return res.status(400).json({ error: "Código de viagem inválido." });
      }
      if (delivery.get(user.type) == user._id) { //delivery belongs to current user/driver
        return res.status(200).json({ ...delivery.toJSON() });
      }
      return res.status(401).json({ error: "Sem permissão." });
    }
    catch (e) {
      return res.status(409).json({ error: e.message });
    }
  }

  //get all deliveries by user/driver
  async getDeliveries(req: Request, res: Response) {
    // @ts-ignore
    const { user } = req;
    var deliveries;
    if (user.type === 'user') {
      deliveries = await Delivery.find({ user: user._id }).populate('driver', '_id name email');
    }
    else { //driver
      deliveries = await Delivery.find({ driver: user._id }).populate('user', '_id name email');
    }
    return res.status(200).json(deliveries);
  }
}

export default new DeliverController;
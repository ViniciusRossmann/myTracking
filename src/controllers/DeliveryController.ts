import { Response } from 'express';
import { RequestWithSession } from '../interfaces';
import { createDelivery, updateDelivery, getDelivery, getDeliveries } from '../services/DeliveryService';

class DeliverController {
  //register new delivery
  async newDelivery(req: RequestWithSession, res: Response) {
      req.body.driver = req.user._id;
      const savedDelivery = await createDelivery(req.body);
      const status = savedDelivery.hasOwnProperty('error') ? 409 : 201;
      return res.status(status).json(savedDelivery);
  }

  //update delivery status/location
  async update(req: RequestWithSession, res: Response) {
      const updatedDelivery = await updateDelivery(req.params.id, req.user._id, req.body.status, req.body.location);
      const statusRes = updatedDelivery.hasOwnProperty('error') ? 409 : 200;
      return res.status(statusRes).json(updatedDelivery);
  }

  //get delivery information by id
  async getDelivery(req: RequestWithSession, res: Response) {
      const delivery = await getDelivery(req.params.id, req.user._id, req.user.type);
      const status = delivery.hasOwnProperty('error') ? 409 : 200;
      return res.status(status).json(delivery);
  }

  //get all deliveries by user/driver
  async getDeliveries(req: RequestWithSession, res: Response) {
      const deliveries = await getDeliveries(req.user._id, req.user.type);
      const status = deliveries.hasOwnProperty('error') ? 409 : 200;
      return res.status(status).json(deliveries);
  }
}

export default new DeliverController;
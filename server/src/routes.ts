import { Router } from "express";
import DeliverController from "./controllers/DeliverController";
import DriverController from './controllers/DriverController';
import UserController from "./controllers/UserController";
const jwt = require('jsonwebtoken');

const routes = {
  user: [
    '/get_deliveries',
    '/delivery/:id'
  ],
  driver: [
    '/get_deliveries',
    '/new_delivery',
    '/update_position/:deliveryId',
    '/delivery/:id'
  ]
}

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    if (!routes[decoded.channel].includes(req.route.path)) {
      return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.body.userId = decoded.id;
    req.body.userType = decoded.channel;
    next();
  });
}

export default Router()
  .post("/user/auth", UserController.authentication)
  .post("/user/register", UserController.register)
  .post("/driver_register", DriverController.register)
  .post("/driver_auth", DriverController.authentication)
  .post("/get_deliveries", verifyToken, DeliverController.getDeliveries)
  .post("/new_delivery", verifyToken, DeliverController.newDelivery)
  .post("/update_position/:deliveryId", verifyToken, DeliverController.updatePosition)
  .post("/delivery/:id", verifyToken, DeliverController.getDelivery)





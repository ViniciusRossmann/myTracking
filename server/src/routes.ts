import { Router } from "express";
import DeliverController from "./controllers/DeliverController";
import DriverController from './controllers/DriverController';
import UserController from "./controllers/UserController";
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    req.body.userId = decoded.id;
    next();
  });
}

export default Router()
  .post("/user_auth", UserController.authentication)
  .post("/user_register", UserController.register)
  .post("/driver_register", DriverController.register)
  .post("/driver_auth", DriverController.authentication)
  .post("/get_deliveries", verifyToken, DeliverController.getDeliveries)






import { Router } from "express";
import DeliverController from "./controllers/DeliverController";
import DriverController from './controllers/DriverController';
import UserController from "./controllers/UserController";
import { Request, Response, NextFunction } from "express"; 
import { decodeAcessToken, getNewUserToken } from "./utils";
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
    if (err) return res.status(500).json({ msg: 'Failed to authenticate token.' });
    if (!routes[decoded.channel].includes(req.route.path)) {
      return res.status(401).json({ msg: 'User unauthorized for this route.' });
    }
    req.body.userId = decoded.id;
    req.body.userType = decoded.channel;
    next();
  });
}

async function authorize(req: Request, res: Response, next: NextFunction){
  const accessToken = req.header('x-access-token');
  const refreshToken = req.header('x-refresh-token');

  if (!accessToken){
    return res.status(401).json({ msg: 'No token provided.' });
  }

  const { decoded, expired } = decodeAcessToken(accessToken);

  if (decoded) {
    // @ts-ignore
    req.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await getNewUserToken(refreshToken);
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      const { decoded } = decodeAcessToken(newAccessToken);

      // @ts-ignore
      req.user = decoded;
      return next();
    }

    return res.status(500).json({ msg: 'Failed to authenticate token.' });
  }

  return res.status(500).json({ msg: 'Failed to authenticate token.' });
}

export default Router()
  .post("/user/auth", UserController.authentication)
  .post("/user/register", UserController.register)
  .post("/user/logoff", authorize, UserController.logoff)
  .post("/driver_register", DriverController.register)
  .post("/driver_auth", DriverController.authentication)
  .post("/get_deliveries", authorize, DeliverController.getDeliveries)
  .post("/new_delivery", verifyToken, DeliverController.newDelivery)
  .post("/update_position/:deliveryId", verifyToken, DeliverController.updatePosition)
  .post("/delivery/:id", verifyToken, DeliverController.getDelivery)





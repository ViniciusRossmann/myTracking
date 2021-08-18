import { Router } from "express";
import DeliveryController from "./controllers/DeliveryController";
import DriverController from './controllers/DriverController';
import UserController from "./controllers/UserController";
import { Request, Response, NextFunction } from "express"; 
import { decodeAcessToken, getNewUserToken, getNewDriverToken } from "./utils";

const authorize = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.header('x-access-token');
    const refreshToken = req.header('x-refresh-token');
  
    if (!accessToken){
      return res.status(401).json({ msg: 'No token provided.' });
    }
  
    const { decoded, expired } = decodeAcessToken(accessToken);
  
    if (decoded) {
      // @ts-ignore
      if (decoded.type === role){
        // @ts-ignore
        req.user = decoded;
        return next();
      }
      return res.status(401).json({ msg: 'Unauthorized.' });
    }
  
    if (expired && refreshToken) {
      let newAccessToken;
      if (role === 'user') newAccessToken = await getNewUserToken(refreshToken);
      else if (role === 'driver') newAccessToken = await getNewDriverToken(refreshToken);

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
}

export default Router()
  //user routes
  .post("/user/register", UserController.register)
  .post("/user/authentication", UserController.authentication)
  .get("/user/logoff", authorize('user'), UserController.logoff)

  //driver routes
  .post("/driver/register", DriverController.register)
  .post("/driver/authentication", DriverController.authentication)
  .get("/driver/logoff", authorize('driver'), DriverController.logoff)

  //delivery routes
  .post("/delivery", authorize('driver'), DeliveryController.newDelivery)
  .post("/delivery/:id", authorize('driver'), DeliveryController.update)

  .get("/user/delivery/:id", authorize('user'), DeliveryController.getDelivery)
  .get("/driver/delivery/:id", authorize('driver'), DeliveryController.getDelivery)
  
  .get("/user/deliveries", authorize('user'), DeliveryController.getDeliveries)
  .get("/driver/deliveries", authorize('driver'), DeliveryController.getDeliveries)






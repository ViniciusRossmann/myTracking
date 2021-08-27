import { Router } from "express";
import DeliveryController from "./controllers/DeliveryController";
import DriverController from './controllers/DriverController';
import UserController from "./controllers/UserController";
import { Request, Response, NextFunction } from "express"; 
import { decodeAcessToken, getNewUserToken, getNewDriverToken } from "./utils";

//validate requests that needs permissions (user or driver authentication)
const authorize = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //get tokens from requests
    const accessToken = req.header('x-access-token');
    const refreshToken = req.header('x-refresh-token');
  
    //no access token -> unauthorized
    if (!accessToken){
      return res.status(401).json({ msg: 'No token provided.' });
    }
  
    const { decoded, expired } = decodeAcessToken(accessToken);
  
    //valid access token
    if (decoded) {
      // @ts-ignore
      if (decoded.type === role){ //access token compatible with route
        // @ts-ignore
        req.user = decoded;
        return next();
      }
      return res.status(401).json({ msg: 'Unauthorized.' });
    }
  
    //access token expired, but have a refresh token
    if (expired && refreshToken) {
      //generate a new access token
      let newAccessToken;
      if (role === 'user') newAccessToken = await getNewUserToken(refreshToken);
      else if (role === 'driver') newAccessToken = await getNewDriverToken(refreshToken);

      if (newAccessToken) {
        //sends a new access token in response
        res.setHeader("x-access-token", newAccessToken);
        const { decoded } = decodeAcessToken(newAccessToken);
  
        // @ts-ignore
        req.user = decoded;
        return next();
      }
      return res.status(401).json({ msg: 'Failed to generate new access-token' });
    }
    return res.status(401).json({ msg: 'Failed to authenticate token.' });
  }
}

export default Router()
  //user routes
  .post("/user/register", UserController.register)
  .post("/user/authentication", UserController.authentication)
  .get("/user/logoff", authorize('user'), UserController.logoff)
  .get("/users", authorize('driver'), UserController.getUsers)

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





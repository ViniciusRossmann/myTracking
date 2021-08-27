import { Router } from "express";
import { AnySchema } from "yup";
import DeliveryController from "./controllers/DeliveryController";
import DriverController from './controllers/DriverController';
import UserController from "./controllers/UserController";
import { Request, Response, NextFunction } from "express";
import { decodeAcessToken, getNewUserToken, getNewDriverToken } from "./utils";
import * as userSchemes from './schemes/userSchemes';
import * as driverSchemes from './schemes/driverSchemes';

//validate requests that needs permissions (user or driver authentication)
const authorize = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //get tokens from requests
    const accessToken = req.header('x-access-token');
    const refreshToken = req.header('x-refresh-token');

    //no access token -> unauthorized
    if (!accessToken) {
      return res.status(401).json({ error: 'No token provided.' });
    }

    const { decoded, expired } = decodeAcessToken(accessToken);

    //valid access token
    if (decoded) {
      // @ts-ignore
      if (decoded.type === role) { //access token compatible with route
        // @ts-ignore
        req.user = decoded;
        return next();
      }
      return res.status(401).json({ error: 'Unauthorized.' });
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
      return res.status(401).json({ error: 'Failed to generate new access-token' });
    }
    return res.status(401).json({ error: 'Failed to authenticate token.' });
  }
}

const validate = (schema: AnySchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate(req.body);
    return next();
  } catch (e) {
    return res.status(400).json({ error: e.errors.join(', ') });
  }
}

export default Router()
  //user routes
  .post("/user/register", validate(userSchemes.create), UserController.register)
  .post("/user/authentication", validate(userSchemes.login), UserController.authentication)
  .get("/user/logoff", authorize('user'), UserController.logoff)
  .get("/users", authorize('driver'), UserController.getUsers)

  //driver routes
  .post("/driver/register", validate(driverSchemes.create), DriverController.register)
  .post("/driver/authentication", validate(driverSchemes.login), DriverController.authentication)
  .get("/driver/logoff", authorize('driver'), DriverController.logoff)

  //delivery routes
  .post("/delivery", authorize('driver'), DeliveryController.newDelivery)
  .post("/delivery/:id", authorize('driver'), DeliveryController.update)

  .get("/user/delivery/:id", authorize('user'), DeliveryController.getDelivery)
  .get("/driver/delivery/:id", authorize('driver'), DeliveryController.getDelivery)

  .get("/user/deliveries", authorize('user'), DeliveryController.getDeliveries)
  .get("/driver/deliveries", authorize('driver'), DeliveryController.getDeliveries)






import { Router } from "express";
import DeliveryController from "./controllers/DeliveryController";
import DriverController from './controllers/DriverController';
import UserController from "./controllers/UserController";
import * as userSchemes from './schemes/userSchemes';
import * as driverSchemes from './schemes/driverSchemes';
import * as deliverySchemas from './schemes/deliverySchemes';
import authorize from "./middlewares/authorize";
import validate from './middlewares/validateSchema';

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
  .post("/delivery", validate(deliverySchemas.create), authorize('driver'), DeliveryController.newDelivery)
  .post("/delivery/:id", validate(deliverySchemas.update), authorize('driver'), DeliveryController.update)

  .get("/user/delivery/:id", authorize('user'), DeliveryController.getDelivery)
  .get("/driver/delivery/:id", authorize('driver'), DeliveryController.getDelivery)

  .get("/user/deliveries", authorize('user'), DeliveryController.getDeliveries)
  .get("/driver/deliveries", authorize('driver'), DeliveryController.getDeliveries)






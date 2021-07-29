import { Router } from "express";
import DeliverController from "./controllers/DeliverController";
import userController from './controllers/UserController';
import MotoristaController from './controllers/MotoristaController';

export default Router()
  .post("/acessar", userController.acessar)
  .post("/current-session", userController.session)
  .post("/logout", userController.logout)
  .post("/get-deliveries", DeliverController.getDeliveries)
  .post("/auth_motorista", MotoristaController.authMotorista)
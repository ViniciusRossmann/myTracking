import { Request, Response } from 'express';
import { RequestWithSession } from '../interfaces';
import DriverSession from '../models/DriverSessionModel';
import { getAccessToken } from '../utils';
import { createDriver, validateDriverPassword, driverLogoff } from "../services/DriverService";
const crypto = require("crypto");

class DriverController {
  //register a new driver
  async register(req: Request, res: Response) {
    const savedDriver = await createDriver(req.body);
    const status = savedDriver.hasOwnProperty('error') ? 409 : 201;
    return res.status(status).json(savedDriver);
  }

  //authenticate driver login and returns an access token
  async authentication(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const basicDriverData = await validateDriverPassword(email, password);
      if (!basicDriverData) return res.status(401).json({ error: "Email ou senha inválidos." });

      //generate access token
      const accessToken = getAccessToken({ ...basicDriverData, type: "driver" });

      //generate refresh token
      const refreshToken = new DriverSession({
        driver: basicDriverData._id,
        token: crypto.randomBytes(40).toString('hex'),
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), //expires in 1y
        userAgent: req.get("user-agent") || ""
      });
      refreshToken.save();

      //return driver basic data, accessToken and refreshToken
      return res.json({ driver: basicDriverData, accessToken, refreshToken: refreshToken.token });
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  //revoke refreshToken
  async logoff(req: RequestWithSession, res: Response) {
    const token = req.header('x-refresh-token');
    const response = await driverLogoff(req.user._id, token);
    const status = response.hasOwnProperty('error') ? 400 : 200;
    return res.status(status).json(response);
  }
}

export default new DriverController;
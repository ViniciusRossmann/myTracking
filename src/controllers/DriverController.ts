import { Request, Response } from 'express';
import Driver from "../models/DriverModel";
import DriverSession from '../models/DriverSessionModel';
import { omit } from 'lodash';
import { validateEmail, getAccessToken } from '../utils';
import { createDriver, validatePassword } from "../services/DriverService";
const crypto = require("crypto");

class DriverController {
  //authenticate driver login and returns an access token
  async authentication(req: Request, res: Response) {
    const { email, password } = req.body;

    const basicDriverData = await validatePassword(email, password);
    if (!basicDriverData) return res.status(401).json({error: "Email ou senha inválidos."});

    //generate access token
    const accessToken = getAccessToken({...basicDriverData, type: "driver"});

    //generate refresh token
    const refreshToken = new DriverSession({
      driver: basicDriverData._id,
      token: crypto.randomBytes(40).toString('hex'),
      expires: new Date(Date.now() + 365*24*60*60*1000), //expires in 1y
      userAgent: req.get("user-agent") || ""
    });
    refreshToken.save();

    //return driver basic data, accessToken and refreshToken
    return res.json({ driver: basicDriverData, accessToken, refreshToken: refreshToken.token });
  }

  //revoke refreshToken
  async logoff(req: Request, res: Response){
    const token = req.header('x-refresh-token');
    if (!token) return res.status(400).json({ msg: 'É necessário informar um token' });

    const driverSession = await DriverSession.findOne({token});
    if (!driverSession){
      return res.status(400).json({ msg: 'Token inválido' });
    }

    // @ts-ignore
    if (driverSession.driver != req.user._id) {
        return res.status(401).json({ msg: 'Sem permissão' });
    }

    driverSession.revoked = new Date(Date.now());
    driverSession.save();
    return res.status(200).json({ msg: 'Token revogado' });
  }

  //register a new driver
  async register(req: Request, res: Response) {
    try {
      const savedDriver = await createDriver(req.body);
      const status = savedDriver.hasOwnProperty('error') ? 409 : 201;
      return res.status(status).json(savedDriver);
    } catch (e) {
      return res.status(409).json({error: e.message});
    }
  }

}

export default new DriverController;
import { Request, Response } from 'express';
import { RequestWithSession } from '../interfaces';
import User from "../models/UserModel";
import UserSession from '../models/UserSessionModel';
import { getAccessToken } from '../utils';
import { createUser, validateUserPassword, userLogoff } from "../services/UserService";
const crypto = require("crypto");

class UserController {
  //register a new user
  async register(req: Request, res: Response) {
    const savedUser = await createUser(req.body);
    const status = savedUser.hasOwnProperty('error') ? 409 : 201;
    return res.status(status).json(savedUser);
  }

  //return all registered users
  async getUsers(req: Request, res: Response) {
    const users = await User.find({}).select('_id name email');
    res.json(users);
  }

  //authenticate user login and returns an access token
  async authentication(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const basicUserData = await validateUserPassword(email, password);
      if (!basicUserData) return res.status(401).json({ error: "Email ou senha inválidos." });

      //generate access token
      const accessToken = getAccessToken({ ...basicUserData, type: "user" });

      //generate refresh token
      const refreshToken = new UserSession({
        user: basicUserData._id,
        token: crypto.randomBytes(40).toString('hex'),
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), //expires in 1y
        userAgent: req.get("user-agent") || ""
      });
      refreshToken.save();

      //return basic user data, accessToken and refreshToken
      res.json({ user: basicUserData, accessToken, refreshToken: refreshToken.token });
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  }

  //revoke refreshToken
  async logoff(req: RequestWithSession, res: Response) {
    const token = req.header('x-refresh-token');
    const response = await userLogoff(req.user._id, token);
    const status = response.hasOwnProperty('error') ? 400 : 200;
    return res.status(status).json(response);
  }
}

export default new UserController;
import { Request, Response } from 'express';
import User from "../models/UserModel";
import UserSession from '../models/UserSessionModel';
import { getAccessToken } from '../utils';
import { createUser, validatePassword } from "../services/UserService";
const crypto = require("crypto");

class UserController {
  //authenticate user login and returns an access token
  async authentication(req: Request, res: Response) {
    const { email, password } = req.body;

    const basicUserData = await validatePassword(email, password);
    if (!basicUserData) return res.status(401).json({error: "Email ou senha inválidos."});

    //generate access token
    const accessToken = getAccessToken({...basicUserData, type: "user"});

    //generate refresh token
    const refreshToken = new UserSession({
      user: basicUserData._id,
      token: crypto.randomBytes(40).toString('hex'),
      expires: new Date(Date.now() + 365*24*60*60*1000), //expires in 1y
      userAgent: req.get("user-agent") || ""
    });
    refreshToken.save();

    //return basic user data, accessToken and refreshToken
    res.json({ user: basicUserData, accessToken, refreshToken: refreshToken.token });
  }

  //revoke refreshToken
  async logoff(req: Request, res: Response){
    const token = req.header('x-refresh-token');
    if (!token) return res.status(400).json({ msg: 'É necessário informar um token' });

    const userSession = await UserSession.findOne({token});
    if (!userSession){
      return res.status(400).json({ msg: 'Token inválido' });
    }

    // @ts-ignore
    if (userSession.user != req.user._id) {
        return res.status(401).json({ msg: 'Sem permissão' });
    }

    userSession.revoked = new Date(Date.now());
    userSession.save();
    return res.status(200).json({ msg: 'Token revogado' });
  }

  //register a new user
  async register(req: Request, res: Response) {
    try {
      const savedUser = await createUser(req.body);
      const status = savedUser.hasOwnProperty('error') ? 409 : 201;
      return res.status(status).json(savedUser);
    } catch (e) {
      return res.status(409).json({error: e.message});
    }
  }

  //return all registered users
  async getUsers(req: Request, res: Response) {
    const users = await User.find({ }).select('_id name email');
    res.json(users);
  }

}

export default new UserController;
import { Request, Response } from 'express';
import User from "../models/UserModel";
import UserSession from '../models/UserSessionModel';
import { omit } from 'lodash';
import { validateEmail, getAccessToken } from '../utils';

const crypto = require("crypto");
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

class UserController {

  //authenticate user login and returns an access token
  async authentication(req: Request, res: Response) {
    const { email, password } = req.body;
    
    //verify email and password
    if (!email || !password) return res.status(401).json({error: "Email ou senha inválidos."});
    const user = await User.findOne({email});
    if (!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: "Email ou senha inválidos."});
    }

    const basicUserData = omit(user.toJSON(), "password");

    //generate access token
    const accessToken = getAccessToken({...basicUserData, type: "user"});

    //generate refresh token in DB
    const refreshToken = new UserSession({
      user: user.id,
      token: crypto.randomBytes(40).toString('hex'),
      expires: new Date(Date.now() + 365*24*60*60*1000), //expires in 1y
      userAgent: req.get("user-agent") || ""
    });
    refreshToken.save();

    //return user basic data, accessToken and refreshToken
    return res.json({ user: basicUserData, accessToken, refreshToken: refreshToken.token });
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
      if (!validateEmail(req.body.email)){
        res.status(400).json({error: "Email inválido."});
      }
      await User.create(req.body);
      return res.status(201).json({msg: "Usuário cadastrado com sucesso."});
    } catch (e) {
      return res.status(409).json({error: e.message});
    }
  }

}

export default new UserController;
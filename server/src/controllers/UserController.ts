import * as express from 'express';
import User from "../models/UserModel";
import log from "../logger";

const bcrypt = require('bcrypt');
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

class UserController {

  //authenticate user login and returns an access token
  async authentication(request: express.Request, response: express.Response) {
    console.log(request.cookies)
    const { email, password } = request.body;
    
    if (!email || !password) return response.status(401).send("Invalid username or password");

    const user = await User.findOne({email});
    if (!user || !(await user.comparePassword(password))){
      return response.status(401).send("Invalid username or password");
    }

    const accessToken = jwt.sign({ id: user._id, channel: "user" }, process.env.SECRET, {
      expiresIn: '15min'
    });
    return response.json({ id: user._id, name: user.name, email: user.email, accessToken });
  }

  //register a new user
  async register(request: express.Request, response: express.Response) {
    try {
      await User.create(request.body);
      return response.send("Usuário cadastrado com sucesso.");
    } catch (e) {
      log.error("Request error", e);
      return response.status(409).send(e.message);
    }
  }

}

export default new UserController;
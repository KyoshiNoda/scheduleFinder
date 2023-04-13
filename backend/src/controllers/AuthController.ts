import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthController {
  public static async loginUser(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res
        .status(400)
        .send({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'User not found.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send({ error: 'Incorrect password.' });
    }

    const accessToken = jwt.sign(
      { data: user },
      `${process.env.ACCESS_TOKEN_SECRET}`
    );
    res.send({ token: accessToken, user: user });
  }

  public static async authenticateToken(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers['authorization']!;
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) {
      return res.sendStatus(401);
    }
    jwt.verify(
      token,
      `${process.env.ACCESS_TOKEN_SECRET}`,
      (err: any, user: any) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      }
    );
  }
}

export default AuthController;

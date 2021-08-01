import Joi from 'joi';
import { JwtService, CustomErrorHandler } from '../../services';
import bcrypt from 'bcrypt';
import { User } from '../../models';

const loginController = {
  /**
   * @method {post}
   * @return {accesstoken}
   * This method logs a user in. 
   * It first validates form data then checks if user with that email exists in the DB
   * If email exists, compare the hashedPasswor and proceed further to generate 
   * and access token and set that access token in the cookies with a max age.
   * */
  async login(req, res, next) {
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials('Incorred Email'));
      }

      // compare the password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials('Incorrect Password'));
      }

      // if passowrds match, generate an access token
      const accessToken = JwtService.sign({
        _id: user.id,
        username: user.username,
      });

      res.cookie('jwt', accessToken, {
        httpOnly: true,
        maxAge: maxAge * 1000,
        sameSite: 'none',
        secure: true,
        path: '/',
      });

      res.status(201).json({ accessToken });
    } catch (err) {
      return next(err);
    }
  },
};

export default loginController;

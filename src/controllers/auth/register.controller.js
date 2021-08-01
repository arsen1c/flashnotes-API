import Joi from 'joi';
import { User } from '../../models';
import bcrypt from 'bcrypt';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import { JwtService } from '../../services';
import mongoose from 'mongoose';

const registerController = {
  /**
   * @method {post} 
   * This method is used to register a user on the app
   * This method first validates the form input and look for errors.
   * If no errors found, then it gets the email from the form and query the DB for that email.
   * If that email does not exists, then I proceds further to register the use else throws an error
   * */
  async register(req, res, next) {
    const registerSchema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
      repeat_password: Joi.ref('password'),
      date: Joi.date().required(),
    });

    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const exists = await User.exists({ email: req.body.email });
      // if email exists in the DB
      if (exists) {
        return next(
          CustomErrorHandler.alreadyExists('That email is already registered!')
        );
      }
    } catch (err) {
      return next(err);
    }
    const { username, email, password, date } = req.body;

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      date: new Date(date).toUTCString(),
    });

    const err = await user.validateSync();
    if (err) {
      return next(err);
    }

    try {
      const result = await user.save();
    } catch (err) {
      return next(err);
    }
    res.json({ message: 'User Saved!' });
  },
};

export default registerController;

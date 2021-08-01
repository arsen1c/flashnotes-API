import { User } from '../../models';
import { CustomErrorHandler } from '../../services';

const userController = {
  /**
   * @method {get}
   * @return {user}
   * */
  async me(req, res, next) {
    try {
      // get _id, email, username and date 
      const user = await User.findOne({ _id: req.user._id }).select(
        '_id username email date'
      );

      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
      
      res.json({ user });
    } catch (err) {
      return next(err);
    }
  },
};

export default userController;

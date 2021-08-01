import { CustomErrorHandler, JwtService } from '../services';

/**
 * Auth middlware.
 * This middleware grabs the JWT token from the cookies and then verifies that JWT auth token.
 * If JWT is successfully verified, we get the ID and Username of the requested user.
 * Then we create a new User object and append it to the "request" object before calling the next middlware. 
 * */
const auth = async (req, res, next) => {
  const token = req.cookies.jwt; // JWT token

  if (!token) {
    return next(CustomErrorHandler.unAuthorized('Token missing'));
  }

  try {
    const { _id, username } = await JwtService.verify(token);

    const user = {
      _id,
      username,
    };

    // append user object to req object and call next middlware
    req.user = user;
    next();
  } catch (err) {
    return next(CustomErrorHandler.unAuthorized('Invalid Token'));
  }
};

export default auth;

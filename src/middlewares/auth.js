import { CustomErrorHandler, JwtService } from '../services';

const auth = async (req, res, next) => {
	// Get the token from query or header
	console.log(req.method);
	console.log(req.cookies);
	const token =  req.cookies.jwt;
	// console.log("Token:",token);
	if (!token) {
		return next(CustomErrorHandler.unAuthorized());
	}

	try {
		// Verify JWT
		const { _id, username } = await JwtService.verify(token);
		const user = {
			_id,
			username
		};

		// add user object to req object
		req.user = user;
		next();
	} catch (err) {
		console.log(err.message);
		return next(CustomErrorHandler.unAuthorized('Invalid Token'));
	};
};


export default auth;
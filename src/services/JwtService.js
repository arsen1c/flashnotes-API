import { JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';

class JwtService{
	// Sign JWT token
	static sign(payload, expiry = '7d', secret = JWT_SECRET) {
		return jwt.sign(payload, secret, { expiresIn: expiry });
	};
	// Verify JWT token
	static verify(token, secret = JWT_SECRET) {
		return jwt.verify(token, secret)
	}
};


export default JwtService;
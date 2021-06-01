import { DEBUG_MODE } from '../config';
import { ValidationError } from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler';
import mongoose from 'mongoose';

const errorHandler = (err, req, res, next) => {
	let statusCode = 500;
	let data = {
		message: 'Internal server error',
		...(DEBUG_MODE && { originalError: err.message })
	};

	if (err instanceof ValidationError) {
		statusCode = 422;
		data = {
			message: err.message
		};
	};

	if (err instanceof CustomErrorHandler) {
		statusCode = err.status;
		data= {
			message: err.message
		};
	};

	// Unique username in mongodb
	if (err.code === 11000) {
		statusCode = 400,
		data = {
			message: 'Username is taken'
		}
	}

	return res.status(statusCode).json(data);
}

export default errorHandler;
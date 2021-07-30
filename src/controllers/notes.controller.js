import { User } from '../models';
import { CustomErrorHandler } from '../services';
import Joi from 'joi';

const notesController = {
	async add (req, res, next) {
		try {
			const user = await User.findOne({ _id: req.user._id });
			// Convert Date
			const date = new Date(req.body.date).toUTCString();
			if (!user) {
				return next(CustomErrorHandler.unAuthorized());
			};
			const { id, title, description } = req.body;
			user.notes.push({ id, title, description, date });
			await user.save();
			res.json({ message: 'Note Saved!' });
		} catch (err) {
			return next(err);
		};
	},
	async listAllNotes(req, res, next) {
		try {
			const user = await User.findOne({ _id: req.user._id }).select('username notes');

			if (!user){
				return next(CustomErrorHandler.unAuthorized());
			}

			res.json({data: user});
		} catch(err) {
			return next(err);
		}
	},
	async delete(req, res, next) {
		try {
			const id = req.params.id;
			console.log(id);
			const user = await User.findOne({ _id: req.user._id });
			if (!user) {
				return next(CustomErrorHandler.unAuthorized());
			};

			const deleted = user.notes.map((item, index) => {
				if (item.id === parseInt(id)) {
					user.notes.splice(index, 1);	
				};
			});

			if (!deleted) {
				console.log('Error Deleting: Maybe Incorrect Number');
			}
			
			await user.save();
			res.json({ message: 'ok', notes: user.notes });
		} catch (err) {
			return next(err);
		}
	},
	async update(req, res, next){
		try {
			const id = req.params.id;
			// console.log(req.body);
			const { title, description } = req.body;

			User.findOneAndUpdate({ 
				_id: req.user._id, "notes.id": parseInt(id) }, 
				{$set: { 
					"notes.$.title": title, 
					"notes.$.description": description 
				}}, 
				{new: true}, (err, doc) => {
					if(err) {
						return next(new Error('Error Updating the user!'));
					}
					// console.log('Success!', doc);
					res.status(201).json({message: 'Sucess!', data: doc.notes});		
			})
		} catch (err) {
			console.log(err);
		}	
	}
}

export default notesController;
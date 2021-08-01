import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  notes: { type: Array, default: [] },
  date: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema, 'users');

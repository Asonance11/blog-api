import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
	username: string;
	password: string;
}

const UserSchema = new Schema(
	{
		username: { type: String, required: true, minLength: 1, maxLength: 40 },
		password: { type: String, required: true, minLength: 1 },
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;

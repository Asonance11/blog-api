import { Document, Schema } from 'mongoose';

export interface IComment extends Document {}

const CommentSchema = new Schema(
	{
		comment: { type: String, required: true, minLength: 1 },
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
	},
	{
		timestamps: true,
	}
);

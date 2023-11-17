import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
	comment: string;
	user: Schema.Types.ObjectId;
	post: Schema.Types.ObjectId;
}

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

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;

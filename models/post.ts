import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
	title: string;
	content: string;
	user: Schema.Types.ObjectId;
	comments: Schema.Types.ObjectId[];
	published: boolean;
}

const PostSchema = new Schema(
	{
		title: { type: String, required: true, minLength: 1 },
		content: { type: String, required: true, minLength: 1 },
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: true }],
		published: { type: Boolean, required: true, default: false },
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;

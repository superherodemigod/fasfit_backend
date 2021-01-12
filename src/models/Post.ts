import mongoose from "mongoose";

export type PostDocument = mongoose.Document & {
    user_id: string,
    title: string,
    description: string,
    image: string,
    image_id: string,
    total_likes: number,
    total_comments: number
};

const postSchema = new mongoose.Schema({
    user_id: String,
    title: String,
    description: String,
    image: String,
    total_likes: Number,
    total_comments: Number
}, { timestamps: true });

export const Post = mongoose.model<PostDocument>("Post", postSchema);
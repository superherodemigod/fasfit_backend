import mongoose from "mongoose";

export type PostDocument = mongoose.Document & {
    user_id: string,
    title: string,
    description: string,
    image: string,
    image_id: string,
    total_likes: string,
    total_comments: string
};

const postSchema = new mongoose.Schema({
    user_id: String,
    title: String,
    description: String,
    image: String,
    total_likes: String,
    total_comments: String
}, { timestamps: true });

export const Post = mongoose.model<PostDocument>("Post", postSchema);
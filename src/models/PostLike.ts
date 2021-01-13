import mongoose from "mongoose";

export type PostLikeDocument = mongoose.Document & {
    user_id: string,
    post_id: string,
    content: string,
};

const postLikeSchema = new mongoose.Schema({
    user_id: String,
    post_id: String,
    content: String,
}, { timestamps: true });

export const PostLike = mongoose.model<PostLikeDocument>("PostLike", postLikeSchema);
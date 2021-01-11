import mongoose from "mongoose";

export type PostLikeDocument = mongoose.Document & {
    user_id: string,
    post_id: string,
    commment: string,
};

const postLikeSchema = new mongoose.Schema({
    user_id: String,
    post_id: String,
    comment: String,
}, { timestamps: true });

export const PostLike = mongoose.model<PostLikeDocument>("PostLike", postLikeSchema);
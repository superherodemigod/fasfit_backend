import mongoose from "mongoose";

export type PostCommentDocument = mongoose.Document & {
    user_id: string,
    post_id: string,
    commment: string,
};

const postCommentSchema = new mongoose.Schema({
    user_id: String,
    post_id: String,
    comment: String,
}, { timestamps: true });

export const PostComment = mongoose.model<PostCommentDocument>("PostComment", postCommentSchema);
import mongoose from "mongoose";

export type PostCommentDocument = mongoose.Document & {
    sender_id: string,
    receiver_id: string,
    post_id: string,
    content: string,
};

const postCommentSchema = new mongoose.Schema({
    sender_id: String,
    receiver_id: String,
    post_id: String,
    content: String,
}, { timestamps: true });

export const PostComment = mongoose.model<PostCommentDocument>("PostComment", postCommentSchema);
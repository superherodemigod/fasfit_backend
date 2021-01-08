import mongoose from "mongoose";

export type PostDocument = mongoose.Document & {
    user_id: string,
    title: string,
    description: string,
    image: string,
    image_id: string,
    like: [{
        post_id: string,
        like_user_id: string,
        description: string,
        mark: string
    }],
    comment: [{
        post_id: string,
        comment_user_id: string,
        description: string,
        mark: string
    }]
};

const postSchema = new mongoose.Schema({
    user_id: String,
    title: String,
    description: String,
    image: String,
    image_id: String,
    like: [{
        post_id: String,
        like_user_id: String,
        description: String,
        mark: String
    }],
    comment: [{
        post_id: String,
        comment_user_id: String,
        description: String,
        mark: String
    }]
}, { timestamps: true });

export const Post = mongoose.model<PostDocument>("Post", postSchema);
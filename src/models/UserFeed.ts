import mongoose from "mongoose";

export type UserFeedDocument = mongoose.Document & {
    user_id: string,
    post_id: string,
};

const userFeedSchema = new mongoose.Schema({
    user_id: String,
    post_id: String,
}, { timestamps: true });

export const UserFeed = mongoose.model<UserFeedDocument>("UserFeed", userFeedSchema);
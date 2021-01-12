import mongoose from "mongoose";

export type UserFollowerDocument = mongoose.Document & {
    user_id: string,
    follower_id: string,
};

const userFollowerSchema = new mongoose.Schema({
    user_id: String,
    follower_id: String,
}, { timestamps: true });

export const UserFollower = mongoose.model<UserFollowerDocument>("UserFollower", userFollowerSchema);
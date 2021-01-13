import mongoose from "mongoose";

export type WorldDocument = mongoose.Document & {
    user_id: string,
    world_name: string,
    title: string,
    content1: string,
    content2: string,
    image: string,
    color: string
};

const worldSchema = new mongoose.Schema({
    user_id: String,
    world_name: String,
    title: String,
    content1: String,
    content2: String,
    image: String,
    color: String
}, { timestamps: true });

export const World = mongoose.model<WorldDocument>("World", worldSchema);
import mongoose from "mongoose";

export type FaslanceDocument = mongoose.Document & {
    user_id: string,
    username: string,
    email: string,
    profession: string,
    location: string,
    prices: number,
    summary: string,
    links: string,
    profile_image: string, 
    gallarys: [string]
};

const faslanceSchema = new mongoose.Schema({
    user_id: String,
    username: String,
    email: String,
    profession: String,
    location: String,
    prices: Number,
    summary: String,
    links: String,
    profile_image: String, 
    gallarys: [String]
}, { timestamps: true });

export const Faslance = mongoose.model<FaslanceDocument>("Faslance", faslanceSchema);
import mongoose from "mongoose";

export type RatingDocument = mongoose.Document & {
    faslance_id: string,
    rate: number,
    review: string,
    complete: boolean
};

const ratingSchema = new mongoose.Schema({
    faslance_id: String,
    rate: Number,
    review: String,
    complete: Boolean
}, { timestamps: true });

export const Rating = mongoose.model<RatingDocument>("Rating", ratingSchema);
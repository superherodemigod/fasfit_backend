import mongoose from "mongoose";

export type TipsDocument = mongoose.Document & {
    user_id: string,
    content: string
};

const tipsSchema = new mongoose.Schema({
    user_id: String,
    content: String
}, { timestamps: true });

export const Tips = mongoose.model<TipsDocument>("Tips", tipsSchema);
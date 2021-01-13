import mongoose from "mongoose";

export type NotificationDocument = mongoose.Document & {
    sender_id: string,
    receiver_id: string,
    description: string,
    image: string,
    image_id: string,
    total_likes: number,
    total_comments: number
};

const notificationSchema = new mongoose.Schema({
    user_id: String,
    title: String,
    description: String,
    image: String,
    total_likes: Number,
    total_comments: Number
}, { timestamps: true });

export const Notification = mongoose.model<NotificationDocument>("Notification", notificationSchema);
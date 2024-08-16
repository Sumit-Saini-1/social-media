import mongoose from "mongoose";

export interface INotification {
    _id: mongoose.Types.ObjectId|string,
    postId: mongoose.Types.ObjectId,
    username: string,
    type: string,
    seen: boolean,
}

const notificationSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
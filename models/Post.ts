import mongoose from "mongoose";

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId | string;
    postId: string;
    caption: string;
    postedBy: string;
    image: string;
    likes: number;
}

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
}, {
    timestamps: true
});

postSchema.index({ postId: 1, username: 1 });

const PostModel = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);
export default PostModel;
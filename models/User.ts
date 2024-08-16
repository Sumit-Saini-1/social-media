import mongoose from "mongoose";

export interface IUser extends Document {
    // _id: string;
    id?: string;
    name: string;
    email: string;
    username: string;
    mobile: string;
    password: string;
    profilePic: string;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "/profile.png",
    },
});

userSchema.index({ email: 1, username: 1 });

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
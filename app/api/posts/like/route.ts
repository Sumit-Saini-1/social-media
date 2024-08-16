import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import PostModel from "@/models/Post";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const { postId }: { postId: mongoose.Types.ObjectId } = await req.json();
        // Retrieve session and user ID
        const session = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
        const userId = session?.id as mongoose.Types.ObjectId;

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // Connect to the database
        await dbConnect();

        // Find the post by ID
        const post = await PostModel.findOne({ _id: postId });
        if (!post) {
            return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
        }
        // Ensure likedBy is initialized as an array
        if (!Array.isArray(post.likedBy)) {
            post.likedBy = [];
        }
        if (!post.likedBy.includes(userId)) {
            post.likedBy.push(userId);
            post.likes =post.likes + 1;
            // console.log(37,post);
            await post.save();
            if (post.postedBy.toString() !== userId.toString()){
                Notification.create({ postId: postId, user: userId, type: 'like' });
            }
            return new Response(JSON.stringify({ success: 'Post liked' }), { status: 200 });
        } else {
            post.likedBy = post.likedBy.filter((like: mongoose.Types.ObjectId) => !like.equals(userId));
            post.likes =post.likes - 1;
            // console.log(43,post);
            await post.save();
            return new Response(JSON.stringify({ success: 'Post disliked' }), { status: 200 });
        }
    } catch (error) {
        console.error("Error liking/disliking post:", error);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
    }
}

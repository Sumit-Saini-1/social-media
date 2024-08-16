import dbConnect from "@/lib/mongodb";
import PostModel from "@/models/Post";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { unlink } from 'fs/promises';
import { join } from "path";

export async function GET(req: NextRequest) {

    try {
        const postId = req.nextUrl.pathname.split('/').pop();
        await dbConnect();
        const posts = await PostModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'postedBy'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $unwind: '$postedBy'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'likedBy',
                    foreignField: '_id',
                    as: 'likedBy'
                }
            },
            {
                $project: {
                    postId: '$_id',
                    username: '$postedBy.username',
                    profile: '$postedBy.profilePic',
                    image: '$image',
                    caption: '$caption',
                    likes: '$likes',
                    likedBy: '$likedBy.username',
                    comments: '$comments',
                    time: '$createdAt',
                }
            },
        ]);
        return new Response(JSON.stringify(posts[0]), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify(err), { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {

    try {
        const postId = req.nextUrl.pathname.split('/').pop();
        const session = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
        const postedBy = session?.id as string;
        await dbConnect();

        const post = await PostModel.findById(postId);

        if (post?.postedBy.toString() !== postedBy) {
            console.log('Unauthorized');

            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        // Delete the post from the database
        const data = await PostModel.findByIdAndDelete(postId);

        // Delete the image from the uploads directory
        const imagePath = join(process.cwd(), 'public', data?.image);
        // console.log(imagePath);

        await unlink(imagePath);

        return new Response(JSON.stringify(post), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify(err), { status: 500 });
    }
}
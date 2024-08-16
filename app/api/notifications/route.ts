import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
        const userId = session?.id as mongoose.Types.ObjectId;

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        await dbConnect();
        const notifications = await Notification.aggregate([
            {
                $lookup: {
                    from: "posts",
                    localField: 'postId',
                    foreignField: '_id',
                    as: 'post',
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$post'
            },
            {
                $unwind: '$user'
            },
            {
                $match: { "post.postedBy": new mongoose.Types.ObjectId(userId) },
            },
            {
                $project: {
                    _id: 1,
                    postId: 1,
                    type: 1,
                    seen: 1,
                    username: "$user.username",
                    post: {
                        _id: 1,
                        caption: 1,
                        image: 1,
                    },
                    createdAt: 1,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);
        return new Response(JSON.stringify({ notifications }), { status: 200 });
    } catch (err: any) {
        console.log(err.message);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { id: notificationId } = await req.json(); // Parse the JSON body
        const notification = await Notification.findOne({ _id: notificationId });

        if (!notification) {
            return new NextResponse(
                JSON.stringify({ error: 'Notification not found' }),
                { status: 404 }
            );
        }

        notification.seen = true;
        await notification.save(); 

        return new NextResponse(JSON.stringify({ notification }), { status: 200 });
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: 'Something went wrong' }),
            { status: 500 }
        );
    }
}

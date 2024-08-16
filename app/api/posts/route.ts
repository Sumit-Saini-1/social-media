import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/mongodb";
import PostModel from "@/models/Post";

export async function GET(){
    try{
        await dbConnect();
        const posts=await PostModel.aggregate([
            {
                $lookup:{
                    from:'users',
                    localField:'postedBy',
                    foreignField:'_id',
                    as:'postedBy'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $unwind:'$postedBy'
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
                $project:{
                    postId:'$_id',
                    username:'$postedBy.username',
                    profile:'$postedBy.profilePic',
                    image:'$image',
                    caption:'$caption',
                    likes:'$likes',
                    likedBy: '$likedBy.username',
                    comments:'$comments',
                    time:'$createdAt',
                }
            },
        ])
        return new Response(JSON.stringify(posts), { status: 200 });
    }catch(err){
        return new Response(JSON.stringify(err), { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file = data.get('file') as File;
        const caption = data.get('caption') as string;
        const session = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
        const postedBy = session?.id as string;
        if (!postedBy) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
        // const maxFileSize = 5 * 1024 * 1024; // 5MB

        if (!allowedFileTypes.includes(file.type)) {
            return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
        }

        // if (file.size > maxFileSize) {
        //     return NextResponse.json({ success: false, error: 'File too large' }, { status: 400 });
        // }

        // Convert the file to a Buffer
        const imageData = await file.arrayBuffer();
        const imageBuffer = Buffer.from(imageData);

        // Create uploads directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate a unique file name to prevent overwriting
        const uniqueFileName = `${Date.now()}-${file.name}`;
        const filePath = join(uploadDir, uniqueFileName);

        // Write the file to the uploads directory
        await writeFile(filePath, imageBuffer);

        await dbConnect();
        const post = await PostModel.create({
            image: `/uploads/${uniqueFileName}`,
            caption,
            postedBy
        });

        return NextResponse.json({ success: true, url: `/uploads/${uniqueFileName}`, post }, { status: 200 });
    } catch (error) {
        console.error('Error during file upload:', error);
        return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
    }
}
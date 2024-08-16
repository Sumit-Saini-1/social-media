import dbConnect from "@/lib/mongodb";
import { existsSync } from "fs";
import { writeFile, mkdir, unlink } from 'fs/promises';
import mongoose from "mongoose";
import { Session } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file = data.get('profilePic') as File;
        const session = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
        const postedBy = session?.id as mongoose.Types.ObjectId;
        if (!postedBy) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (!allowedFileTypes.includes(file.type)) {
            return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
        }

        // const maxFileSize = 5 * 1024 * 1024; // 5MB
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
        const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = join(uploadDir, uniqueFileName);

        // Write the file to the uploads directory
        await writeFile(filePath, imageBuffer);

        await dbConnect();

        const user = await mongoose.model('User').findById(postedBy);

        if (!user) {
            await unlink(filePath);
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }
        const oldProfilePic = user.profilePic;
        user.profilePic = `/uploads/${uniqueFileName}`;
        await user.save();

        if (oldProfilePic) {
            const oldFilePath = join(process.cwd(), 'public', oldProfilePic);
            if (existsSync(oldFilePath)) {
                await unlink(oldFilePath);
            }
        }

        return NextResponse.json({ success: true, profilePic: user.profilePic }, { status: 200 });
    } catch (error) {
        console.error('Error during file upload:', error);
        return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
    }
}
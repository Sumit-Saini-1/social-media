import dbConnect from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the POST request for user signup.
 *
 * @param {NextRequest} req - The NextRequest object containing the request data.
 * @return {NextResponse} A JSON response indicating the result of the signup process.
 */
export async function POST(req: NextRequest) {
    try {
        const { name, email, username, password }: IUser = await req.json();

        if (!name || !email || !username || !password) {
            return NextResponse.json(
                { error: "Name, email, username, and password are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            username,
            password,
        });

        await newUser.save();

        return NextResponse.json(
            { message: "User created successfully", userId: newUser._id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });
        const userId = session?.id as mongoose.Types.ObjectId;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const user = await User.findOne({ _id: userId }, { password: 0,mobile: 0 });
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Get users API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
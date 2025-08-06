// app/api/users/route.ts
import ConnectDB from "@/config/ConnectDB";
import UserProfileModel from "@/models/UserProfileModel";
import { hashSync } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const {
            name,
            email,
            password,
            image,
            provider,
            navWords = [],
            heroWords = [],
            cvs = [],
        } = data;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "name, email and password are required" },
                { status: 400 }
            );
        }

        await ConnectDB();
        const passwordHash = await hashSync(password, 12);
        // Create the user document
        const newUser = await UserProfileModel.create({
            name,
            email,
            password: passwordHash,
            image,
            provider,
            navWords,
            heroWords,
            cvs,
        });

        // Convert to plain object and remove password
        const userObj = newUser.toObject();
        delete userObj.password;

        return NextResponse.json(userObj, { status: 201 });
    } catch (error: unknown) {
        console.error("POST /api/users error:", error);
        const message =
            error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upsert: Create user if email doesn't exist, otherwise update info & password
    await db
      .insert(user)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .onConflictDoUpdate({
        target: user.email,
        set: {
          name,
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json(
      { success: true, message: "User successfully created/updated." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Test Update User API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

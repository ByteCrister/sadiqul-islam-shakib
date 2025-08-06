// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import ConnectDB from "@/config/ConnectDB";
import UserProfileModel from "@/models/UserProfileModel";
import { authOptions } from "@/utils/auth.options";

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function serverError(err: unknown) {
  console.error("[PROFILE_ERROR]", err);
  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return bad("Unauthorized", 401);

    await ConnectDB();
    const profile = await UserProfileModel.findOne(
      { email: session.user.email },
      {
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        cvs: 1,
        views: 1,
      }
    );

    if (!profile) return bad("User not found", 404);

    return NextResponse.json({ profile });
  } catch (err) {
    return serverError(err);
  }
}
import { NextRequest, NextResponse } from "next/server";
import { html } from "@/lib/email/contact-html";
import { mailer } from "@/lib/email/mailer";
import { rateLimit } from "@/lib/upstash-redis/rate-limit";

export async function POST(request: NextRequest) {
    try {
        // 1. Reliable client IP extraction
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ??
            request.headers.get('x-real-ip') ??
            '127.0.0.1';
        // console.log(`Client IP: ${ip}`);

        // 2. Rate limiting
        const isAllowed = await rateLimit(`contact:${ip}`, 5, 60);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        // 3. Process request
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await mailer(
            process.env.MY_CONTACT_EMAIL!,
            "New Contact Message",
            html(name, email, message)
        );

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
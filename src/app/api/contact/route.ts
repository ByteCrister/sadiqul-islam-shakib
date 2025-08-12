import { html } from "@/lib/email/contact-html";
import { mailer } from "@/lib/email/mailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await mailer(process.env.MY_CONTACT_EMAIL!, 'New Contact Message', html(name, email, message))

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
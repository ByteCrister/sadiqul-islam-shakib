import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import ConnectDB from "@/config/ConnectDB";
import { Types } from "mongoose";
import UserProfileModel from "@/models/UserProfileModel";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                await ConnectDB();
                const user = await UserProfileModel.findOne({ email: credentials.email });

                if (!user) throw new Error("Invalid email or password");

                if (!user.password) {
                    throw new Error(
                        "Your account was created with Google. Please sign in with Google or reset your password."
                    );
                }

                const isPasswordCorrect = await compare(
                    credentials.password,
                    user.password
                );

                console.log(user);
                console.log(credentials);
                console.log(isPasswordCorrect);

                if (!isPasswordCorrect) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: (user._id as Types.ObjectId).toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await ConnectDB();
                const existingUser = await UserProfileModel.findOne({ email: user.email });

                if (!existingUser) {
                    return false;
                }
            }

            return true;
        },

        async jwt({ token, user }) {

            if (user) {
                token.id = user.id;
            }

            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id as string;
            return session;
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24, // 1 day
        updateAge: 60 * 60,   // 1 hour
    },

    pages: {
        signIn: "/",
        error: "/auth-error",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

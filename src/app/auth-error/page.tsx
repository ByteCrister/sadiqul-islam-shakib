'use client';

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Ban, XCircle } from "lucide-react";
import { JSX } from "react/jsx-runtime";

const errorMessages: Record<string, { title: string; message: string; icon: JSX.Element }> = {
    "access-denied": {
        title: "Access Denied",
        message: "You are not allowed to sign in with this account.",
        icon: <Ban className="h-10 w-10 text-red-600" />,
    },
    "OAuthAccountNotLinked": {
        title: "Account Not Linked",
        message:
            "This account is already registered using a different sign-in method. Try using the method you originally used.",
        icon: <AlertTriangle className="h-10 w-10 text-yellow-500" />,
    },
    "CredentialsSignin": {
        title: "Invalid Credentials",
        message: "The email or password you entered is incorrect.",
        icon: <XCircle className="h-10 w-10 text-red-600" />,
    },
    "default": {
        title: "Authentication Error",
        message: "Something went wrong during sign-in. Please try again.",
        icon: <AlertTriangle className="h-10 w-10 text-gray-500" />,
    },
};

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const errorKey = searchParams.get("error") ?? "default";
    const { title, message, icon } = errorMessages[errorKey] || errorMessages["default"];

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
            <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-8 max-w-md text-center space-y-4">
                <div className="flex justify-center">{icon}</div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
                <p className="text-gray-600 dark:text-gray-300">{message}</p>

                <Link
                    href="/"
                    className="inline-block mt-4 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    Back Home
                </Link>
            </div>
        </main>
    );
}

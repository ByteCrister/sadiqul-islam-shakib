"use client";

import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

export default function SignInForm({ onSuccess }: { onSuccess: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading("Signing in...");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                toast.error(formatAuthError(res.error), { id: toastId });
            } else {
                toast.success("Welcome back! 🚀", { id: toastId });
                onSuccess();
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const toastId = toast.loading("Redirecting to Google...");
        try {
            const res = await signIn("google");
            if (!res?.ok) {
                toast.error("Google Sign-in failed.", { id: toastId });
            } else {
                toast.dismiss(toastId);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error("Google Sign-in error.", { id: toastId });
            } else {
                toast.error("An unknown error occurred.");
            }
        }
    };

    const formatAuthError = (msg: string): string => {
        // Map known errors to user-friendly messages
        switch (msg) {
            case "Invalid email or password":
                return "Wrong email or password. Try again.";
            case "access-denied":
                return "You don't have access. Contact admin.";
            case "Email and password required":
                return "Please fill in both email and password.";
            case "Your account was created with Google. Please sign in with Google or reset your password.":
                return "Use Google Sign-in or reset your password.";
            default:
                return msg;
        }
    };

    return (
        <div className="w-full flex justify-center px-4 py-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-8 rounded-2xl
                   backface-hidden bg-white/40 dark:bg-black/40
                   backdrop-blur-md shadow-xl shadow-black/20
                   border border-white/20 dark:border-black/20"
            >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center">
                    Welcome Back
                </h2>

                <form onSubmit={handleCredentialsSignIn} className="space-y-5">
                    <div className="relative">
                        <HiOutlineMail
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                            size={20}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 w-full py-3 rounded-xl
                         bg-white/50 dark:bg-gray-800/50
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-400
                         transition"
                        />
                    </div>

                    <div className="relative">
                        <HiOutlineLockClosed
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                            size={20}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-10 w-full py-3 rounded-xl
                         bg-white/50 dark:bg-gray-800/50
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-400
                         transition"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full py-3 bg-indigo-500 hover:bg-indigo-600
                       text-white font-medium rounded-xl
                       shadow-lg shadow-indigo-300/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition"
                    >
                        {loading ? "Signing In…" : "Sign In"}
                    </motion.button>
                </form>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                    <span className="px-4 text-gray-500 dark:text-gray-400">OR</span>
                    <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                </div>

                <motion.button
                    onClick={handleGoogleSignIn}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3
                     bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700
                     border border-gray-300 dark:border-gray-600
                     rounded-xl text-gray-700 dark:text-gray-200
                     transition"
                >
                    <FcGoogle size={22} />
                    <span>Continue with Google</span>
                </motion.button>
            </motion.div>
        </div>
    );
}

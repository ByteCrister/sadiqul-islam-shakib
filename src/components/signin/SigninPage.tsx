"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/global/toast";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const signinSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormValues) => {
    setIsLoading(true);

    try {
      // 1. Validate credentials via custom rate-limited API
      const res = await fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Authentication failed.");
      }

      // 2. If valid, proceed with NextAuth signIn
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      toast("success", "Successfully signed in! Redirecting...");
      router.push("/d");
      router.refresh(); // Refresh to update server-side auth state
    } catch (error: any) {
      toast("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/d" });
    } catch (error: any) {
      toast("error", "Failed to sign in with Google.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800/80 p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Welcome Back</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full h-11 px-4 bg-neutral-50/90 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 rounded-xl text-neutral-800 dark:text-neutral-200 focus:outline-none focus:bg-white dark:focus:bg-neutral-800 focus:ring-1 focus:ring-neutral-500/20 dark:focus:ring-neutral-400/20 focus:border-neutral-500 dark:focus:border-neutral-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs ml-1 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full h-11 px-4 bg-neutral-50/90 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 rounded-xl text-neutral-800 dark:text-neutral-200 focus:outline-none focus:bg-white dark:focus:bg-neutral-800 focus:ring-1 focus:ring-neutral-500/20 dark:focus:ring-neutral-400/20 focus:border-neutral-500 dark:focus:border-neutral-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-xs ml-1 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full h-11 bg-gradient-to-b from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-neutral-950 dark:from-neutral-100 dark:to-neutral-200 dark:hover:from-white dark:hover:to-neutral-100 text-white dark:text-neutral-900 text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-6 mb-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800"></div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          className="w-full h-11 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/60 hover:bg-white dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300 font-medium rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <FcGoogle className="w-5 h-5" />
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}

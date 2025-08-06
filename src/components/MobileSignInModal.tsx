"use client";

import { useState } from "react";
import { motion } from 'framer-motion'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import SignInForm from "./SignInForm";
import Link from "next/link";
const MobileSignInModal = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    const [open, setOpen] = useState(false);

    if (isLoggedIn) {
        return (
            <Link
                href="/dashboard"
                className="relative text-lg font-medium text-neutral-700 dark:text-neutral-300"
            >
                <motion.span whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}>
                    Dashboard
                </motion.span>
            </Link>
        );
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="relative group cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    <span className="block text-lg font-medium text-neutral-700 dark:text-neutral-300">Dashboard</span>
                </button>
            </DialogTrigger>

            <DialogContent className="md:hidden w-full max-w-sm mx-auto p-0 bg-transparent shadow-none border-none">
                <div className="relative p-6">
                    <DialogTitle className="text-lg font-semibold mb-4">
                        Sign In to Dashboard
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Please enter your credentials to access the dashboard.
                    </DialogDescription>

                    <SignInForm onSuccess={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default MobileSignInModal
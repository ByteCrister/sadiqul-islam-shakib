'use client'
import Link from "next/link";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "./ui/popover";
import { useState } from "react";
import SignInForm from "./SignInForm";
import { motion } from 'framer-motion';

const DashboardButton = ({ isLoggedIn, pathname }: { isLoggedIn: boolean, pathname: string }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    if (isLoggedIn) {
        return (
            <Link
                href="/dashboard"
                className="relative text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
                <motion.span whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}>
                    Dashboard
                </motion.span>
                <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-primary transition-transform duration-300 ease-in-out
                    ${pathname === '/dashboard' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} origin-left`}
                />
            </Link>
        );
    }

    return (
        <Popover
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
        >
            <PopoverTrigger asChild>
                <button
                    onClick={() => setIsPopoverOpen(true)}
                    className="relative text-sm font-medium text-neutral-700 dark:text-neutral-300 group cursor-pointer"
                >
                    <motion.span whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}>
                        Dashboard
                    </motion.span>
                    <span
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary transition-transform duration-300 ease-in-out
               scale-x-0 group-hover:scale-x-100 origin-left"
                    />
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="center"
                className="w-[90vw] sm:w-[400px] p-0 bg-transparent border-none shadow-none"
            >
                <SignInForm
                    onSuccess={() => setIsPopoverOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
};

export default DashboardButton;

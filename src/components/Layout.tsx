'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return (
        <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-sans">
            <header className="sticky top-0 backdrop-blur bg-white/50 dark:bg-black/50 z-10">
                <nav className="container mx-auto py-4 flex justify-between">
                    <Link href="/">Logo</Link>
                    <div className="space-x-4">
                        <Link href="/about">About</Link>
                        <Link href="/projects">Projects</Link>
                        <Link href="/contact">Contact</Link>
                        {mounted && (
                            <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                                {theme === 'dark' ? 'Light' : 'Dark'}
                            </Button>
                        )}
                    </div>
                </nav>
            </header>
            <main className="container mx-auto flex-grow px-4">{children}</main>
            <footer className="py-8 text-center text-sm">
                © {new Date().getFullYear()} Your Name
            </footer>
        </div>
    );
};

export default Layout;

'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Download, Menu, X } from 'lucide-react';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import { DownloadCvPath, navItems, NavWords } from '@/utils/parameter.header';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => setMounted(true), []);

    const [nameText] = useTypewriter({
        words: NavWords,
        loop: true,
        typeSpeed: 100,
        deleteSpeed: 50,
        delaySpeed: 1000,
    });

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    const toggleMenu = () => setMenuOpen((open) => !open);

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-black/70 border-b border-neutral-200 dark:border-neutral-700"
        >
            <div className="container mx-auto flex items-center justify-between px-6 py-4">

                {/* Logo / Typewriter */}
                <Link href="/" className="text-2xl font-extrabold text-primary flex items-center">
                    {nameText}
                    <Cursor cursorStyle="|" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navItems.map(({ label, href }) => {
                        const isActive = pathname === href;

                        return (
                            <Link key={href} href={href} className="relative group text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                <motion.span whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}>
                                    {label}
                                </motion.span>
                                <span
                                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-primary
                                                transition-transform duration-300 ease-in-out
                                                ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} origin-left`}
                                />
                            </Link>
                        )
                    })}

                    <motion.a
                        href={DownloadCvPath}
                        download
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-full shadow hover:shadow-lg hover:bg-primary/90 transition dark:bg-gray-500 dark:text-gray-100 dark:hover:bg-primary/35"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Download className="w-4 h-4" /> Download CV
                    </motion.a>

                    {mounted && (
                        <motion.button
                            onClick={toggleTheme}
                            aria-label="Toggle dark mode"
                            className="p-2 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
                            whileTap={{ scale: 0.85 }}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </motion.button>
                    )}
                </nav>

                {/* Mobile Hamburger */}
                <div className="md:hidden">
                    <motion.button
                        onClick={toggleMenu}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        className="p-2 rounded text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
                        whileTap={{ scale: 0.85 }}
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Nav Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-700"
                    >
                        <ul className="flex flex-col space-y-4 px-6 py-4">
                            {navItems.map(({ label, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        onClick={() => setMenuOpen(false)}
                                        className="block text-lg font-medium text-neutral-700 dark:text-neutral-300"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                            <li className="flex justify-center">
                                <Link
                                    href={DownloadCvPath}
                                    download
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white 
                                    rounded-full shadow hover:shadow-lg hover:bg-primary/90 transition 
                                    dark:bg-gray-500 dark:text-gray-100 dark:hover:bg-primary/35 mx-auto"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Download className="w-4 h-4" /> Download CV
                                </Link>
                            </li>
                            <li>
                                {mounted && (
                                    <button
                                        onClick={() => {
                                            toggleTheme();
                                            setMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary transition"
                                    >
                                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    </button>
                                )}
                            </li>
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
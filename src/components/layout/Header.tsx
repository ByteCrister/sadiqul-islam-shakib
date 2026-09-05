'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Download, Menu, X } from 'lucide-react';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import { navItems, NavWords } from '@/utils/params/parameter.header';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  resumeUrl?: string | null;
  userName?: string | null;
}

const getResumeLink = (url?: string | null) => {
    if (!url) return '#';
    if (url.includes('/raw/upload/')) {
        return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
    }
    return url;
};

export default function Header({ resumeUrl, userName: _userName }: HeaderProps) {
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
            /* Subframe spec: "no background container — the nav floats on canvas"
               A hairline border-bottom defines the separation */
            className="sticky top-0 z-50 w-full bg-canvas/90 backdrop-blur-sm border-b border-hairline"
        >
            <div className="container mx-auto max-w-page flex items-center justify-between px-6 py-4">

                {/* Logo / Typewriter — Inter extrabold, ink black */}
                <Link
                    href="/"
                    className="text-[18px] font-bold text-ink tracking-[-0.45px] flex items-center select-none"
                >
                    {nameText}
                    <Cursor cursorStyle="|" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {/* Centered nav links — Inter 500 14px */}
                    <div className="flex items-center gap-8">
                        {navItems.map(({ label, href }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`relative text-[14px] font-medium tracking-[-0.07px] transition-colors duration-200
                                        ${isActive ? 'text-ink' : 'text-faint hover:text-ink'}`}
                                >
                                    {label}
                                    {/* Active underline — hairline */}
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className="absolute -bottom-0.5 left-0 right-0 h-px bg-ink"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Resume — Dark Filled Button (Subframe spec) */}
                    <motion.a
                        href={getResumeLink(resumeUrl)}
                        target={resumeUrl ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="btn-primary gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Resume</span>
                    </motion.a>

                    {/* Theme toggle — ink icon on canvas */}
                    {mounted && (
                        <motion.button
                            onClick={toggleTheme}
                            aria-label="Toggle dark mode"
                            className="p-2 rounded-buttons text-pencil hover:text-ink hover:bg-card-surface border border-transparent hover:border-hairline transition-all duration-200"
                            whileTap={{ scale: 0.85 }}
                        >
                            {theme === 'dark'
                                ? <Sun className="w-4 h-4" />
                                : <Moon className="w-4 h-4" />}
                        </motion.button>
                    )}
                </nav>

                {/* Mobile: theme toggle + hamburger */}
                <div className="md:hidden flex items-center gap-3">
                    {mounted && (
                        <motion.button
                            onClick={toggleTheme}
                            aria-label="Toggle dark mode"
                            className="p-2 rounded-buttons text-pencil hover:text-ink hover:bg-card-surface transition-all duration-200"
                            whileTap={{ scale: 0.85 }}
                        >
                            {theme === 'dark'
                                ? <Sun className="w-4 h-4" />
                                : <Moon className="w-4 h-4" />}
                        </motion.button>
                    )}
                    <motion.button
                        onClick={toggleMenu}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        className="p-2 rounded-buttons text-pencil hover:text-ink hover:bg-card-surface transition-all duration-200"
                        whileTap={{ scale: 0.85 }}
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Nav Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="md:hidden bg-canvas border-b border-hairline"
                    >
                        <ul className="flex flex-col px-6 py-6 gap-6">
                            {navItems.map(({ label, href }) => {
                                const isActive = pathname === href;
                                return (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            onClick={() => setMenuOpen(false)}
                                            className={`block text-[18px] font-medium tracking-[-0.45px] transition-colors duration-200
                                                ${isActive ? 'text-ink' : 'text-pencil hover:text-ink'}`}
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                );
                            })}
                            <li>
                                <Link
                                    href={getResumeLink(resumeUrl)}
                                    target={resumeUrl ? '_blank' : undefined}
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Resume
                                </Link>
                            </li>
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

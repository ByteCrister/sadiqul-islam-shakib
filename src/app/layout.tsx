import './globals.css';
import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes';
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'


export const metadata: Metadata = {
  title: 'Sadiqul Portfolio',
  description: 'Next.js & TypeScript developer crafting polished experiences.',
  openGraph: {
    title: 'Sadiqul Portfolio',
    description: 'Next.js & TypeScript developer crafting polished experiences.',
    url: 'https://sadiqulislamshakib.vercel.app/',
    images: [{ url: '/images/shakib.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sadiqul Portfolio',
    description: 'Next.js & TypeScript developer crafting polished experiences.',
    images: ['/images/shakib.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          <Header />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

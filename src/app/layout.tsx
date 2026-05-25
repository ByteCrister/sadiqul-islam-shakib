import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes';
import './globals.css';
import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import Loading3DText from '@/components/others/Loading3DText';
import { ProfileImagePath } from '@/utils/params/parameter.global';
import Cursor from '@/components/global/Cursor';
import SmoothScroll from '@/components/global/SmoothScroll';


export const metadata: Metadata = {
  metadataBase: new URL('https://sadiqul-islam-shakib.vercel.app'),

  title: 'Sadiqul Islam Shakib Portfolio',
  description: 'Next.js & TypeScript developer crafting polished experiences.',

  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },

  manifest: '/site.webmanifest',

  openGraph: {
    title: 'Sadiqul Islam Shakib Portfolio',
    description: 'Next.js & TypeScript developer crafting polished experiences.',
    url: '/',
    siteName: 'Sadiqul Islam Shakib Portfolio',
    images: [
      {
        url: ProfileImagePath,
        width: 1200,
        height: 630,
        alt: 'Sadiqul Islam Shakib Portfolio',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Sadiqul Islam Shakib Portfolio',
    description: 'Next.js & TypeScript developer crafting polished experiences.',
    images: [ProfileImagePath],
  },
};

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
          <Suspense fallback={<Loading3DText />}>
          <SmoothScroll>
            <Header />
            <main className="container mx-auto px-4 py-8 pb-3">{children}</main>
            <Footer />
            <Cursor />
            </SmoothScroll>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}

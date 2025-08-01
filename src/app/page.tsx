import Hero from "@/components/Hero";
import { generatePageMetadata } from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: 'Sadiqul Islam Shakib – Full-Stack Web Developer',
    description: 'Explore the portfolio of Sadiqul Islam Shakib – a passionate full-stack web developer specializing in Next.js, React, and modern web technologies.',
    path: '/',
    tags: Array.from(
      new Set([
        'Sadiqul Islam Shakib',
        'Portfolio',
        'Web Developer',
        'Full-Stack Developer',
        'Next.js',
        'React',
        'TypeScript',
        'JavaScript',
        'Frontend',
        'Backend',
        'HTML',
        'CSS',
        'Tailwind CSS',
        'shakib portfolio',
        'MERN Stack',
        'Axios',
        'Zustand',
        'Mongoose',
      ])
    ),
  }),
  metadataBase: new URL('https://sadiqulislamshakib.vercel.app'),
  robots: {
    index: true,
    follow: true,
    nocache: false,
  }
};


export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4f46e5" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};


export default function HomePage() {
  return (
    <Hero />
  );
}

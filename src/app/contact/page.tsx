import Contact from "@/components/contact/Contact";
import { generatePageMetadata } from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: 'Contact',
    description: 'Want to work together or just say hello? Reach out to Sadiqul Islam Shakib, a passionate full-stack developer specializing in Next.js and TypeScript.',
    path: '/contact',
    image: '/og-contact.png',
    tags: [
      'Contact Sadiqul Islam Shakib',
      'Portfolio',
      'Developer Contact',
      'Hire Next.js Developer',
      'Freelance Web Developer',
      'React',
      'TypeScript',
      'Full-Stack Developer'
    ],
  }),
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL??''),
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4f46e5" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

const page = () => {
  return <Contact />;
};

export default page;

import Contact from "@/components/contact/Contact";
import { generatePageMetadata } from "@/utils/helper/metadata";
import { Metadata } from "next";
import { getContactSocialLinks } from "@/lib/handlers/contact.handler";

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: 'Contact',
    description: 'Want to work together or just say hello? Reach out to Sadiqul Islam Shakib, a passionate full-stack developer specializing in Next.js and TypeScript.',
    path: '/contact',
    image: '/og-contact.png',
    tags: [
      'Sadiqul Islam Shakib',
      'Sadiqul Islam Shakib Portfolio',
      'Sadiqul Islam Shakib Portfolio Contact',
      'Sadiqul Islam Shakib Contact',
      'Sadiqul',
      'Islam',
      'Shakib',
      'Contact',
      'Portfolio',
      'Developer Contact',
      'Hire Next.js Developer',
      'Freelance Web Developer',
      'React',
      'TypeScript',
      'Full-Stack Developer'
    ],
  }),
};

export default async function Page() {
  const socialLinks = await getContactSocialLinks();
  return <Contact socialLinks={socialLinks} />;
}

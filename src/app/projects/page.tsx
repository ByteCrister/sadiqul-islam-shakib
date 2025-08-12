import Projects from "@/components/projects/Projects";
import { generatePageMetadata } from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: 'Projects',
    description:
      'Explore the portfolio of Sadiqul Islam Shakib – featuring cutting-edge web applications built with Next.js, TypeScript, Tailwind CSS, and modern UI/UX principles.',
    path: '/projects',
    image: '/og-projects.png',
    tags: [
      'Next.js Projects',
      'TypeScript Portfolio',
      'Tailwind CSS UI',
      'Full-Stack Developer Work',
      'Frontend Projects',
      'Web Developer Bangladesh',
      'Sadiqul Islam Shakib Portfolio',
    ]
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
  return (
     <Projects />
  )
}

export default page
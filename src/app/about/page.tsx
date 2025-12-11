import About from '@/components/about/About';
import { generatePageMetadata } from '@/utils/helper/metadata'
import { Metadata } from 'next'

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: 'About',
    description: 'Meet Sadiqul Islam Shakib – a passionate full-stack developer with a focus on Next.js, TypeScript, and modern web technologies.',
    path: '/about',
    image: '/og-about.png',
    tags: [
      'Sadiqul Islam Shakib',
      'Sadiqul Islam Shakib Portfolio',
      'Sadiqul Islam Shakib Portfolio About',
      'Sadiqul',
      'Islam',
      'Shakib',
      'Portfolio',
      'About',
      'Full-Stack Developer',
      'Next.js Developer',
      'React',
      'TypeScript',
      'Web Developer',
    ],
  }),
  metadataBase: new URL("https://sadiqul-islam-shakib.vercel.app/"),
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4f46e5" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

const page = () => {
  return <About />
}

export default page

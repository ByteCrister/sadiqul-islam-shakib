import About from '@/components/about/About';
import { generatePageMetadata } from '@/utils/helper/metadata'
import { Metadata } from 'next'
import { getAboutData } from '@/lib/handlers/about.handler'
import { getProjects } from '@/lib/handlers/projects.handler'

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
}

export default async function Page() {
  const { counters, experiences, skills } = await getAboutData();
  const projects = await getProjects();
  
  return <About 
    counters={counters} 
    experiences={experiences} 
    skills={skills} 
    projects={projects} 
  />
}

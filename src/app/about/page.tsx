import About from '@/components/About'
import { generatePageMetadata } from '@/utils/metadata'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  title: 'About',
  description: 'Learn about Sadiqul, a Next.js & TypeScript specialist.',
  path: '/about',
  image: '/og-about.png',
})

const AboutPage = () => {
  return (
    <About />
  )
}

export default AboutPage
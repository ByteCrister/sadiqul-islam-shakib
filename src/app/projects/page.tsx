import ProjectCard from "@/components/ProjectCard";
import { generatePageMetadata } from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: 'Projects',
  description: 'Showcasing my Next.js, TypeScript, and UI/UX work.',
  path: '/projects',
})

export default function ProjectsPage() {
  return <ProjectCard />;
}
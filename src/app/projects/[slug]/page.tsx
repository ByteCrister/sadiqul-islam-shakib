
// G:\Projects\sadiqul-islam-shakib\src\app\projects\[slug]\page.tsx
import ProjectDetail from "@/components/project-details/ProjectDetail";
import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProjectBySlug } from "@/utils/params/parameter.projects";
import { generatePageMetadata } from "@/utils/helper/metadata";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "This project does not exist.",
    };
  }

  return {
    ...generatePageMetadata({
      title: project.title,
      description: project.description,
      path: `/projects/${slug}`,
      image: project.thumbnail,
      tags: [
        ...(project.challenges ?? []),
        ...(project.features ?? []),
        project.description ?? "",
        'Sadiqul Islam Shakib',
        'Sadiqul',
        'Islam',
        'Shakib'
      ],
    }),
  };
}

export async function generateStaticParams() {
  // This function should return an array of all the slugs you want to pre-render.
  // For example, if you have a function `getAllProjectSlugs` that returns an array of slugs:
  const slugs = getAllProjectSlugs(); // This function must be implemented.

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return notFound();

  return <ProjectDetail project={project} />;
}
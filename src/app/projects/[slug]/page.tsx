
// G:\Projects\sadiqul-islam-shakib\src\app\projects\[slug]\page.tsx
import ProjectDetail from "@/components/project-details/ProjectDetail";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug, getProjectGallery } from "@/lib/handlers/projects.handler";
import { generatePageMetadata } from "@/utils/helper/metadata";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

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
      image: project.thumbnailAsset?.assetFile?.url ?? '/og-projects.png',
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
  const projects = await getProjects();

  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return notFound();

  const gallery = await getProjectGallery(project.id);

  return <ProjectDetail project={project} gallery={gallery} />;
}
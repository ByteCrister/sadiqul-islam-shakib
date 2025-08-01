
import ProjectDetail from "@/components/ProjectDetail";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/utils/parameter.projects";
import { generatePageMetadata } from "@/utils/metadata";
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
      ],
    }),
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL??''),
  };
}
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4f46e5" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return notFound();

  return <ProjectDetail slug={slug} />;
}

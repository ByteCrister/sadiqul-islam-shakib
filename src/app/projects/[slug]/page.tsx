import ProjectDetail from "@/components/ProjectDetail";
import { generatePageMetadata } from "@/utils/metadata";
import { getProjectBySlug, Project } from "@/utils/parameter.projects";
import { Metadata } from "next";

type Params = { slug: string }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const project: Project | undefined = await getProjectBySlug(params.slug)

  return generatePageMetadata({
    title: project?.title ?? '',
    description: project?.description ?? '',
    path: `/projects/${params.slug}`,
    image: project?.thumbnail,
    tags: [...project?.challenges ?? [], ...project?.challenges ?? [], ...project?.features ?? [], project?.description ?? ''],
  })
}

export default function Page() {
  return <ProjectDetail />;
}

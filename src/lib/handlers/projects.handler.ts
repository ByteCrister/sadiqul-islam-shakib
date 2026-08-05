import { env } from "@/config/env";
import type { DProject, ApiResponse } from "@/types/dashboard.types";

const BASE_URL = env.NEXT_PUBLIC_BASE_URL;

export async function getProjects(): Promise<DProject[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/projects`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    
    const json = (await res.json()) as ApiResponse<DProject[]>;
    return json.data ?? [];
  } catch (error) {
    console.error("[projects.handler] getProjects error:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<DProject | null> {
  try {
    // We can fetch all and find, or we can fetch a specific one if there is an endpoint.
    // Since /api/v1/projects returns all, and we cache it, this is efficient.
    const projects = await getProjects();
    return projects.find((p) => p.slug === slug) ?? null;
  } catch (error) {
    console.error("[projects.handler] getProjectBySlug error:", error);
    return null;
  }
}

export async function getProjectGallery(projectId: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/projects/${projectId}/gallery`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    
    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("[projects.handler] getProjectGallery error:", error);
    return [];
  }
}

import { getAllProjects } from "@/utils/parameter.projects";
import { MetadataRoute } from "next";

export async function GET(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://sadiqul-islam-shakib.vercel.app";

    const projects = getAllProjects();

    const routes = [
        "",
        "/about",
        "/contact",
        "/projects",
        ...projects.map((p) => `/projects/${p.slug}`),
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
    }));
}

// src/app/sitemap.ts
import { getAllProjects } from '@/utils/parameter.projects'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

    const staticRoutes = [
        '',
        '/about',
        '/projects',
        '/contact',
    ]

    const dynamicRoutes = getAllProjects().map((slug) => `/projects/${slug}`)

    const allRoutes = [...staticRoutes, ...dynamicRoutes]

    const now = new Date().toISOString()

    return allRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: now,
    }))
}

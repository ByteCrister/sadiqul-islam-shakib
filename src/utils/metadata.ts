// lib/metadata.ts
import { Metadata } from 'next'

type PageSEO = {
    title: string
    description: string
    path: string
    image?: string
    tags?: string[]            // ← new optional field
}

const SITE_NAME = 'Sadiqul Islam Shakib'
const BASE_URL = 'https://sadiqulislamshakib.vercel.app'
const DEFAULT_OG_IMAGE = '/og-default.png'

export function generatePageMetadata({
    title,
    description,
    path,
    image,
    tags = [],                // default to empty array
}: PageSEO): Metadata {
    const fullTitle = `${title} | ${SITE_NAME}`
    const url = `${BASE_URL}${path}`
    const ogImage = image ?? DEFAULT_OG_IMAGE

    return {
        title: fullTitle,
        description,
        keywords: tags,           // ← inject tags here
        openGraph: {
            title: fullTitle,
            description,
            url,
            images: [{ url: ogImage, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
        },
        alternates: { canonical: url },
    }
}

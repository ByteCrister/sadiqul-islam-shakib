// lib/metadata.ts
import { Metadata } from 'next'

type PageSEO = {
    title: string
    description: string
    path: string
    image?: string
    tags?: string[]
}

const SITE_NAME = 'Sadiqul Islam Shakib'
const DEFAULT_OG_IMAGE = '/og-default.png'

export function generatePageMetadata({
    title,
    description,
    path,
    image,
    tags = [],
}: PageSEO): Metadata {
    const fullTitle = `${title} | ${SITE_NAME}`
    const ogImage = image ?? DEFAULT_OG_IMAGE

    return {
        title: fullTitle,
        description,
        keywords: tags,

        alternates: {
            canonical: path,
        },

        openGraph: {
            title: fullTitle,
            description,
            url: path,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                },
            ],
            type: 'website',
        },

        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
        },
    }
}
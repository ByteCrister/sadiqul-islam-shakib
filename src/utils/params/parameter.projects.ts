

export interface Project {
  slug: string
  title: string
  description: string
  tech: string[],
  liveUrl?: string            // make optional
  githubUrl: string
  category: string
  thumbnail?: string,
  fullScreen?:string,
  images?: string[]           // NEW: array of image URLs for gallery
  timeline?: string           // NEW: development time or milestone info
  features?: string[]         // NEW: bullet-point features
  challenges?: string[]       // NEW: highlight technical challenges
  learnings?: string[]        // NEW: what you learned from the project
}

export const projects: Project[] = [
  {
    slug: 'meeting-sync',
    title: 'MeetingSync',
    description:
      `Meeting Sync is an intelligent meeting scheduling and video conferencing platform that combines real-time communication, automated scheduling, and AI-powered analytics to optimize meeting productivity. This document provides a comprehensive overview of the platform's architecture, core systems, and key capabilities.`,
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI', 'Axios API', 'Socket.IO', 'WebRTC', 'Redis Cache', 'Fuse.js', 'MongoDB', 'Mongoose'],
    thumbnail: '/images/projects/meeting-sync/meeting-sync-1.png',
    fullScreen: '/images/projects/meeting-sync/full-screen-meeting-sync.png',
    images: [
      '/images/projects/meeting-sync/meeting-sync-1.png',
      '/images/projects/meeting-sync/meeting-sync-2.png',
      '/images/projects/meeting-sync/meeting-sync-3.png',
      '/images/projects/meeting-sync/meeting-sync-4.png',
      '/images/projects/meeting-sync/meeting-sync-5.png',
      '/images/projects/meeting-sync/meeting-sync-6.png',
      '/images/projects/meeting-sync/meeting-sync-7.png',
      '/images/projects/meeting-sync/meeting-sync-8.png',
      '/images/projects/meeting-sync/meeting-sync-9.png',
      '/images/projects/meeting-sync/meeting-sync-10.png',
      '/images/projects/meeting-sync/meeting-sync-11.png',
      '/images/projects/meeting-sync/meeting-sync-12.png',
      '/images/projects/meeting-sync/meeting-sync-13.png',
      '/images/projects/meeting-sync/meeting-sync-14.png',
      '/images/projects/meeting-sync/meeting-sync-15.png',
      '/images/projects/meeting-sync/meeting-sync-16.png',
      '/images/projects/meeting-sync/meeting-sync-17.png',
      '/images/projects/meeting-sync/meeting-sync-18.png',
      '/images/projects/meeting-sync/meeting-sync-19.png',
      '/images/projects/meeting-sync/meeting-sync-20.png'
    ],
    liveUrl: 'https://meeting-sync-beta.vercel.app/',
    githubUrl: 'https://github.com/ByteCrister/meeting-sync',
    category: 'Video conferencing and Online meetings',
    timeline: 'Mar 2025 – Jul 2025',
    features: [
      'Intelligent meeting slot creation with overlap validation',
      'Automated status transitions via cron jobs',
      'Real-time booking and cancellation system',
      'Engagement tracking and analytics',
      'WebRTC-based peer-to-peer video calls',
      'Integrated chat system during meetings',
      'Screen sharing capabilities',
      'Participant management and presence tracking',
      `TF-IDF keyword extraction from meeting content`,
      `K-means clustering for topic categorization`,
      `Engagement scoring based on participation metrics`,
      `Trend analysis and recommendation system`
    ],
    challenges: [
      'Meeting slot creation with timezone handling',
      'Time overlap validation and conflict prevention',
      `Automated status updates via cron jobs`,
      `Participant booking and management`,
      `Meeting slot status transitions (upcoming → active → completed)`,
      `Video call creation and cleanup`,
      `Engagement metric calculations`,

    ],
    learnings: [
      'Refactor folder structure for maintainability',
      'Extend use of caching and state memoization',
      'Focus on better validation, security and edge-case handling',
      'Improve socket retry logic and disconnection handling',
    ]
  },
  {
    slug: 'ai-games',
    title: 'AI Interactive Games',
    description:
      'AI GAMES, a Next.js-based web application that implements three classic board games with AI opponents: Chess, Tic-Tac-Toe, and Reversi (Othello). The system demonstrates sophisticated AI algorithms including Minimax and Alpha-Beta Pruning, implemented with varying difficulty levels to provide engaging gameplay experiences.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'],
    thumbnail: '/images/projects/ai-games/ai-games-1.png',
    images: [
      '/images/projects/ai-games/ai-games-1.png',
      '/images/projects/ai-games/ai-games-2.png',
      '/images/projects/ai-games/ai-games-3.png',
      '/images/projects/ai-games/ai-games-4.png',
      '/images/projects/ai-games/ai-games-5.png'
    ],
    liveUrl: 'https://ai-games-cse-412.vercel.app/',
    githubUrl: 'https://github.com/ByteCrister/AI-Games-CSE-412',
    category: 'Gaming',
    timeline: 'May 2025 – Jun 2025',
    features: [
      'The application leverages modern web development technologies with a focus on type safety, component reusability, and developer experience.',
      'Each game system implements a consistent architectural pattern while accommodating game-specific requirements and AI complexities.',
      'The codebase follows Next.js 13+ App Router conventions with a clear organizational hierarchy that separates routing, components, and utilities.'
    ],
    challenges: [
      'Modern routing with dynamic [difficulty] parameters',
      'Game state management through useChessGame, useReversiGame, and useTicTacToe',
      'Clear boundaries between UI components, game logic, and AI algorithms',
      'Optimized image handling through Next.js public directory'
    ],
    learnings: [
      'Three complete game implementations sharing common infrastructure',
      'Dynamic algorithm selection based on user-chosen difficulty levels',
      'Tailwind CSS implementation ensuring cross-device compatibility',
      'Comprehensive TypeScript integration across all components and logic',
      'Shared UI components via shadcn/ui for consistent user experience',
      'Custom loading components for enhanced user experience during navigation'
    ]
  },
  {
    slug: 'shop-easy',
    title: 'ShopEasy',
    description:
      'An e-commerce platform with searchable product listings, shopping cart, and Stripe-powered checkout.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe API'],
    thumbnail: 'https://picsum.photos/300/200',
    images: ['https://picsum.photos/300/200', 'https://picsum.photos/300/200'],
    liveUrl: 'https://shopeasy.example.com',
    githubUrl: 'https://github.com/you/shop-easy',
    category: 'E-commerce',
    timeline: 'May 2023 – Jul 2023',
    features: [
      'Faceted product search and filtering',
      'Persistent shopping cart',
      'Secure Stripe checkout flow'
    ],
    challenges: [
      'Integrating Stripe webhooks reliably',
      'Optimizing image serving for large catalogs'
    ],
    learnings: [
      'Best practices for PCI compliance',
      'Techniques for lazy-loading large asset sets'
    ]
  },
  {
    slug: 'chatty',
    title: 'Chatty',
    description:
      'A real-time chat application supporting multiple rooms, presence indicators, and emoji reactions.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Socket.IO'],
    thumbnail: 'https://picsum.photos/300/200',
    images: [
      'https://picsum.photos/300/200',
      'https://picsum.photos/300/200',
      'https://picsum.photos/300/200'
    ],
    liveUrl: 'https://chatty.example.com',
    githubUrl: 'https://github.com/you/chatty',
    category: 'Real-time Apps',
    timeline: 'Aug 2023 – Sep 2023',
    features: [
      'Multi-room chat with online/offline presence',
      'Rich text and emoji support',
      'Room-level access control'
    ],
    challenges: [
      'Handling a high volume of socket events',
      'Designing a scalable namespace hierarchy'
    ],
    learnings: [
      'Socket.IO scaling strategies',
      'Creating a resilient reconnect logic'
    ]
  },
  {
    slug: 'photo-portfolio',
    title: 'Photo Portfolio',
    description:
      'A responsive photography portfolio with lazy-loaded galleries, lightbox previews, and SEO optimizations.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Cloudinary'],
    thumbnail: 'https://picsum.photos/300/200',
    images: ['https://picsum.photos/300/200', 'https://picsum.photos/300/200'],
    liveUrl: 'https://photoport.example.com',
    githubUrl: 'https://github.com/you/photo-portfolio',
    category: 'Web Apps',
    timeline: 'Oct 2023',
    features: [
      'Responsive Masonry grid layout',
      'Lightbox preview with keyboard navigation',
      'Pre-rendered SEO-friendly pages'
    ],
    challenges: [
      'Implementing SSR-friendly image optimization',
      'Balancing quality and performance for galleries'
    ],
    learnings: [
      'Next/Image advanced configuration',
      'Accessibility considerations for media galleries'
    ]
  },
  {
    slug: 'recipe-book',
    title: 'Recipe Book',
    description:
      'A collaborative cooking app where users share recipes, build meal plans, and generate shopping lists.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'GraphQL'],
    thumbnail: 'https://picsum.photos/300/200',
    images: ['https://picsum.photos/300/200', 'https://picsum.photos/300/200'],
    liveUrl: 'https://recipebook.example.com',
    githubUrl: 'https://github.com/you/recipe-book',
    category: 'Food & Cooking',
    timeline: 'Nov 2023 – Jan 2024',
    features: [
      'Recipe creation and editing workflows',
      'Meal planning calendar',
      'Auto-generated shopping lists'
    ],
    challenges: [
      'Designing a flexible GraphQL schema',
      'Managing collaborative edits in real time'
    ],
    learnings: [
      'Advanced Prisma relations and migrations',
      'Implementing collaborative data structures'
    ]
  }
]

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
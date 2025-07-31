

export interface Project {
  slug: string
  title: string
  description: string
  tech: string[]
  liveUrl?: string            // make optional
  githubUrl: string
  category: string
  thumbnail?: string
  images?: string[]           // NEW: array of image URLs for gallery
  timeline?: string           // NEW: development time or milestone info
  features?: string[]         // NEW: bullet-point features
  challenges?: string[]       // NEW: highlight technical challenges
  learnings?: string[]        // NEW: what you learned from the project
}

export const projects: Project[] = [
  {
    slug: 'task-master',
    title: 'Task Master',
    description:
      'A productivity app for managing tasks, featuring drag-and-drop Kanban boards, real-time sync, and intuitive gestures.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Socket.IO'],
    thumbnail: '/images/meeting-sync.png',
    images: [
      'https://picsum.photos/300/200',
      'https://picsum.photos/300/200',
      'https://picsum.photos/300/200'
    ],
    liveUrl: 'https://taskmaster.example.com',
    githubUrl: 'https://github.com/you/task-master',
    category: 'Productivity',
    timeline: 'Jan 2023 – Apr 2023',
    features: [
      'Dynamic Kanban board with multiple lanes',
      'Real-time updates via WebSocket',
      'Drag-and-drop gestures for tasks'
    ],
    challenges: [
      'Ensuring smooth live sync under heavy load',
      'Managing complex state of nested drag operations'
    ],
    learnings: [
      'Deep dive into Socket.IO rooms and namespaces',
      'Advanced React state management patterns'
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
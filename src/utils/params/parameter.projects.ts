export interface Project {
  slug: string
  title: string
  description: string
  tech: string[]
  liveUrl?: string
  githubUrl: string
  category: string
  thumbnail?: string
  fullScreen?: string
  images?: string[]
  timeline?: string
  features?: string[]
  challenges?: string[]
  learnings?: string[]

  // NEW fields
  loginCredentials?: {
    email?: string
    password?: string
  }

  warningMessage?: string    // e.g., "This is a demo account. Don't enter real data."
}


export const projects: Project[] = [
  {
    slug: "quantipixor",
    title: "Quantipixor",
    description:
      "A high-performance, privacy-first image processing suite that runs entirely in your browser. Compress JPG, PNG, WebP, AVIF and 14+ other formats in bulk, convert between formats, remove backgrounds with AI, extract text via OCR, and generate favicons — all without uploading a single file to a server.",
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript 5",
      "Tailwind CSS 4",
      "Zustand 5",
      "Radix UI",
      "Framer Motion",
      "JSZip",
      "Sharp",
      "Google Gemini",
      "Tesseract.js",
      "HuggingFace Transformers",
      "Upstash Redis",
      "Vercel Blob",
      "Lucide React",
    ],
    liveUrl: "https://quantipixor.vercel.app/",
    githubUrl: "https://github.com/ByteCrister/quantipixor",
    category: "Image Processing Tool",
    thumbnail: "/images/projects/quantipixor/og-landing-page.png",
    fullScreen: "/images/projects/quantipixor/img-1.png",
    images: [
      "/images/projects/quantipixor/img-2.png",
      "/images/projects/quantipixor/img-3.png",
      "/images/projects/quantipixor/img-4.png",
      "/images/projects/quantipixor/img-5.png",
    ],
    timeline: "2024 – Present",
    features: [
      "100% client-side batch image compression via the HTML Canvas API — images never leave the device",
      "Upload up to 1000 images per drop with a queue capacity of 2000 images",
      "SHA-256 file hashing for smart duplicate detection",
      "Configurable compression quality (20%–80%) with real-time per-image progress tracking",
      "ZIP download with organized batch sub-folders (batch-1/, batch-2/, …)",
      "Re-compress queued images with different settings without re-uploading",
      "AI-powered background removal via HuggingFace / Gradio",
      "Smart OCR document formatting using Google Gemini and OCR.Space with provider rotation",
      "Server-side favicon generation (.ico) using Sharp and to-ico",
      "Image format conversion with a shared interactive crop tool",
      "Redis-based rate limiting on all server API routes",
      "Glassmorphism design system with full dark/light mode support",
      "WCAG 2.2 AA accessibility with keyboard-first interactions",
      "Full SEO: Open Graph, Twitter Cards, and JSON-LD structured data",
    ],
    challenges: [
      "The HTML Canvas API can only reliably re-encode to JPEG, WebP, and PNG — all other input formats (GIF, BMP, SVG, AVIF, TIFF) must be rasterized to PNG, requiring careful format-handling logic",
      "HEIC/HEIF decoding support varies across browsers, requiring graceful fallback handling",
      "Designing a hybrid processing model that keeps sensitive media client-side while routing heavy AI tasks (background removal, OCR, favicon generation) through secure server API routes",
      "Implementing Redis-based rate limiting across multiple OCR providers (Gemini and OCR.Space) with automatic rotation to avoid quota exhaustion",
      "Maintaining a shared CropImage component that works consistently across three different tools (Favicon Generator, Background Remover, Image Converter)",
    ],
    learnings: [
      "Deep understanding of the Canvas API for client-side image re-encoding and quality control",
      "Using crypto.subtle.digest for SHA-256 file hashing to build a robust deduplication system",
      "Integrating multiple AI providers (Google Gemini, HuggingFace Transformers, Gradio) and gracefully handling their differing APIs and rate limits",
      "Building a Zustand store that tracks a full image lifecycle (pending → processing → completed/error) across async batch operations",
      "Structuring Next.js App Router API routes for server-side binary processing (Sharp, to-ico) while keeping the rest of the app statically optimized",
      "Applying Tailwind CSS v4 with custom CSS variables to build a consistent glassmorphism design system",
    ],
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
    slug: 'next-learn',
    title: 'Next Learn - Learning Management System',
    description:
      'A comprehensive educational platform built with Next.js 15, featuring course management, exam systems, and study materials',
    tech: ["Next.js 15", "TypeScript", "MongoDB", "Mongoose", "NextAuth.js", "Tailwind CSS", "Zustand", "TipTap Editor", "React Hook Form", "Zod"],
    thumbnail: '/images/projects/next-learn/next-learn-1.png',
    images: [
      '/images/projects/next-learn/next-learn-1.png',
      '/images/projects/next-learn/next-learn-2.png',
      '/images/projects/next-learn/next-learn-3.png',
      '/images/projects/next-learn/next-learn-4.png',
      '/images/projects/next-learn/next-learn-5.png',
      '/images/projects/next-learn/next-learn-6.png',
      '/images/projects/next-learn/next-learn-7.png',
      '/images/projects/next-learn/next-learn-8.png',
      '/images/projects/next-learn/next-learn-9.png',
      '/images/projects/next-learn/next-learn-10.png',
      '/images/projects/next-learn/next-learn-11.png',
      '/images/projects/next-learn/next-learn-12.png',
      '/images/projects/next-learn/next-learn-13.png',
      '/images/projects/next-learn/next-learn-14.png',
      '/images/projects/next-learn/next-learn-15.png',
      '/images/projects/next-learn/next-learn-16.png',
      '/images/projects/next-learn/next-learn-17.png',
      '/images/projects/next-learn/next-learn-18.png',
      '/images/projects/next-learn/next-learn-19.png',
      '/images/projects/next-learn/next-learn-20.png',
      '/images/projects/next-learn/next-learn-21.png',
      '/images/projects/next-learn/next-learn-22.png',
    ],
    liveUrl: 'https://next-learn-nu-olive.vercel.app',
    githubUrl: 'https://github.com/ByteCrister/next-learn',
    category: 'Full-Stack Web Application',
    timeline: 'Jul 2025 – Nov 2025',
    features: [
      "User authentication with credentials and Google OAuth",
      "Subject and course roadmap management",
      "Interactive exam creation and taking system",
      "Study materials upload and organization",
      "Calendar events and routine scheduling",
      "Rich text editing with TipTap",
      "Real-time dashboard with metrics"
    ],
    challenges: [
      "Complex nested data structures (Batch model with 4-5 levels of nesting)",
      "Three-layer validation strategy (Yup, sanitization, Mongoose)",
      "Serverless MongoDB connection pooling",
      "User-scoped data isolation across all routes"
    ],
    learnings: [
      "Next.js 15 App Router architecture",
      "Advanced Mongoose schema design with embedded documents",
      "Zustand state management patterns",
      "NextAuth.js integration with MongoDB"
    ],
    loginCredentials: {
      email: "sadiqul.islam.shakib21@gmail.com",
      password: "zZ1!123"
    },
    warningMessage: "Do not change anything only for viewing."
  },
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
    ],
    loginCredentials: {
      email: "sadiqul.islam.shakib21@gmail.com",
      password: "zZ1!123"
    },
    warningMessage: "Do not change anything only for viewing."
  },
  {
    slug: 'js-skill-gauge',
    title: 'Js SkillGauge — "AI-powered JavaScript skill assessment with personalized insights"',
    description:
      'Js SkillGauge is an AI-powered JavaScript skill assessment. Answer 10 curated questions in 3 minutes and receive an ML-based skill level prediction (Beginner → Expert) with personalized focus-area recommendations — built by Sadiqul Islam Shakib (ByteCrister)."',
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Framer Motion",
      "Radix UI",
      "shadcn/ui",
      "Lucide React",
      "React Icons",
      "Random Forest ML Model (JS)",
    ],
    thumbnail: '/images/projects/js-skill-gauge/js-skill-gauge-1.png',
    images: [
      '/images/projects/js-skill-gauge/js-skill-gauge-1.png',
      '/images/projects/js-skill-gauge/js-skill-gauge-2.png',
      '/images/projects/js-skill-gauge/js-skill-gauge-3.png'
    ],
    liveUrl: 'https://js-skill-gauge.vercel.app/',
    githubUrl: 'https://github.com/ByteCrister/js-skill-gauge',
    category: 'AI / Developer Tool',
    timeline: 'Feb 2026 – Feb 2026',
    features: [
      "10 randomly sampled JavaScript questions from a pool of 150+ questions spanning Easy, Medium, and Hard difficulties",
      "3-minute countdown timer with automatic submission on expiry",
      "ML-powered skill level prediction: Beginner, Basic, Intermediate, Advanced, or Expert",
      "Personalized focus-area recommendations derived from your weakest topics",
      "One-question-at-a-time slider interface with Previous / Next navigation",
      "Years of experience input via a combined slider (0–15) and free-text number field (0–50)",
      "Anti-cheat layer: tab-switch detection, copy/cut/paste blocking, right-click prevention, PrintScreen blocking",
      "Session invalidation after 3 detected rule violations",
      "Per-question answer-duration tracking fed into the ML model as weighted features (AvgTime, WeightedTime)",
      "Detailed post-submission breakdown: your answer vs. the correct answer for every question",
      "Privacy-first: responses are processed locally and are never stored",
    ],
    challenges: [
      "Exporting a Python-trained Random Forest model to a pure JavaScript module consumable by a Next.js API route with no external ML service",
      "Building a reliable multi-signal anti-cheat layer (visibilitychange, blur, clipboard events, keyboard shortcuts) without false positives",
      "Auto-filling unanswered questions with a deterministic wrong option before auto-submitting when the timer expires",
      "Accurately capturing per-question answer durations using entry-time stamps for ML feature engineering",
    ],
    learnings: [
      "Integrating a serialized ML model directly inside a Next.js serverless API route",
      "Constructing weighted feature vectors (difficulty-encoded scores, AvgTime, WeightedTime) for a Random Forest classifier",
      "Composing behavioral monitoring hooks (tab, clipboard, keyboard) that clean up correctly on unmount",
      "Building animated, accessible quiz UIs by combining Framer Motion with shadcn/ui and Radix UI primitives",
    ],
  },
  {
    slug: "gadget-it",
    title: "Gadget IT",
    description: "A full-stack e-commerce platform for gadgets and PC components, featuring a comprehensive admin dashboard. Developed as part of Project Work 2 at North East University Bangladesh.",
    tech: ["React.js", "Express.js", "MySQL", "JavaScript", "HTML5", "CSS3", "Axios", "Node.js"],
    // liveUrl: "https://gadget-it.vercel.app", // From the GitHub repo's About section
    githubUrl: "https://github.com/ByteCrister/Gadget-IT.com",
    category: "Full-Stack E-Commerce",
    thumbnail: "/images/projects/gadget-it/img-1.png", // Using the first image as thumbnail
    images: [
      "/images/projects/gadget-it/img-1.png",
      "/images/projects/gadget-it/img-2.png",
      "/images/projects/gadget-it/img-3.png",
      "/images/projects/gadget-it/img-4.png",
      "/images/projects/gadget-it/img-5.png",
      "/images/projects/gadget-it/img-6.png",
      "/images/projects/gadget-it/img-7.png",
      "/images/projects/gadget-it/img-8.png",
      "/images/projects/gadget-it/img-9.png",
      "/images/projects/gadget-it/img-10.png",
      "/images/projects/gadget-it/img-11.png",
      "/images/projects/gadget-it/img-12.png",
      "/images/projects/gadget-it/img-13.png",
      "/images/projects/gadget-it/img-14.png",
      "/images/projects/gadget-it/img-15.png",
      "/images/projects/gadget-it/img-16.png",
      "/images/projects/gadget-it/img-17.png",
      "/images/projects/gadget-it/img-18.png",
      "/images/projects/gadget-it/img-19.png",
      "/images/projects/gadget-it/img-20.png",
      "/images/projects/gadget-it/img-21.png",
      "/images/projects/gadget-it/img-22.png",
      "/images/projects/gadget-it/img-23.png",
      "/images/projects/gadget-it/img-24.png",
      "/images/projects/gadget-it/img-25.png",
      "/images/projects/gadget-it/img-26.png",
      "/images/projects/gadget-it/img-27.png",
      "/images/projects/gadget-it/img-28.png",
      "/images/projects/gadget-it/img-29.png",
      "/images/projects/gadget-it/img-30.png",
      "/images/projects/gadget-it/img-31.png",
      "/images/projects/gadget-it/img-32.png"
    ],
    timeline: "Jul 2024 – Dec 2024",
    features: [
      "User authentication with hashed passwords and email confirmation via nodemailer",
      "Product search, filtering, sorting, and pagination",
      "Shopping cart management",
      "User ratings and reviews for products",
      "Question and answer section for products",
      "Dynamic pricing based on demand and promotions",
      "Responsive design",
      "Comprehensive admin dashboard with 8 main sections: Dashboard, Inventory, Production, Orders, Reports, Users, Support, and Settings",
      "Product and order management for admins",
      "Image upload and display",
      "Dynamic product advertising system"
    ],
    challenges: [
      "Needs better design integration",
      "Dark mode is not integrated (designed for light mode only)",
      "Inefficient use of local storage in some areas",
      "Requires a more stable API connection"
    ],
    learnings: [
      "React Router for navigation",
      "React Hooks for state and side effects",
      "State management with useReducer and Context API",
      "Maintaining a clean and scalable folder structure",
      "Efficient API management with Axios",
      "Importance of robust error handling and production-level code quality",
      "Selecting the right SDLC model and gathering requirements based on time constraints"
    ],
    // loginCredentials: {
    //   email: "admin@gmail.com",
    //   password: "aA1!123"
    // },
    warningMessage: "This is my first React project – the code is a reflection of my learning journey. Please use the demo account responsibly."
  },
  {
    slug: "pong-game-js",
    title: "Classic PONG Game",
    description: "A classic PONG game implementation built as my first JavaScript project. This project explores fundamental game development concepts including collision detection, ball physics, and AI-controlled paddle movement. The game features smooth animations, score tracking, and increasing difficulty as the game progresses.",
    tech: ["JavaScript", "HTML5", "CSS3"],
    liveUrl: "https://bytecrister.github.io/PONG-Game/",
    githubUrl: "https://github.com/ByteCrister/PONG-Game",
    category: "game",
    thumbnail: "/images/projects/pong-game/pong-game-1.png",
    fullScreen: "/images/projects/pong-game/pong-game-1.png",
    images: [
      "/images/projects/pong-game/pong-game-1.png",
    ],
    timeline: "Completed in 5 days (Feb 2024)",

    features: [
      "Realistic ball physics with angle-based directional changes",
      "Collision detection system for walls and paddles",
      "AI opponent with auto ball tracking capability",
      "Score tracking for both player and computer",
      "Ball speed progression system for increased difficulty",
      "Keyboard controls for player paddle (up/down arrows)",
      "Game state management (start, play, score)"
    ],

    challenges: [
      "Implementing accurate ball bounce angles based on paddle hit position",
      "Creating smooth paddle movement without input lag",
      "Developing AI logic that feels challenging but beatable",
      "Handling frame-rate independent ball movement",
      "Debugging collision detection edge cases at high speeds"
    ],

    learnings: [
      "Understanding requestAnimationFrame for smooth animations",
      "Implementing vector-based movement for game objects",
      "Working with canvas coordinate systems and transformations",
      "Learning game loop architecture and state management",
      "Developing problem-solving skills through debugging physics",
      "Gaining confidence in JavaScript fundamentals through hands-on practice"
    ],

    loginCredentials: undefined,
    warningMessage: undefined
  },
]

export function getAllProjects(): Project[] {
  return projects;
}

export function getAllProjectSlugs(): string[] {
  return projects.map(p => p.slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
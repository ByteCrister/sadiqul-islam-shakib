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

export function getAllProjectSlugs(): string[] {
  return projects.map(p => p.slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
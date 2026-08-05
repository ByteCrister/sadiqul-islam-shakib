"use client";

import { motion, Variants } from "framer-motion";
import type { DProject } from "@/types/dashboard.types";
import { Code2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import ProjectCard from "./ProjectCard";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    },
  },
};

const Projects = ({ projects }: { projects: DProject[] }) => {
  const router = useRouter();
  const [showAll, setShowAll] = useState<boolean>(false);

  // Get unique technologies for filtering
  const allTech = Array.from(new Set(projects.flatMap(project => project.tech || [])));
  const visibleProjects = showAll ? projects : projects.slice(0, 6);

  const handleProjectClick = useCallback((slug: string) => {
    router.push(`/projects/${slug}`);
  }, [router]);

  const toggleShowAll = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  return (
    <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-700 border border-neutral-200/50 dark:border-neutral-600/50 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-6"
          >
            <Code2 className="w-4 h-4" />
            Portfolio Showcase
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300 bg-clip-text text-transparent mb-6"
          >
            My Projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed"
          >
            Explore my collection of projects showcasing modern web technologies,
            innovative solutions, and creative problem-solving approaches.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-8 mt-8 text-sm text-neutral-600 dark:text-neutral-400"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{projects.length} Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>{allTech.length}+ Technologies</span>
            </div>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              onClick={handleProjectClick}
            />
          ))}
        </motion.div>

        {/* Show More Button */}
        {projects.length > 6 && (
          <div className="text-center mt-12">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onClick={toggleShowAll}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 dark:from-neutral-100 dark:to-neutral-200 dark:hover:from-neutral-200 dark:hover:to-neutral-300 text-white dark:text-neutral-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span>{showAll ? 'Show Less' : 'Show All Projects'}</span>
              <ChevronRight
                className={`w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ${showAll ? 'rotate-90' : ''}`}
              />
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
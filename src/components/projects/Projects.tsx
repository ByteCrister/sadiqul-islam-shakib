"use client";

import { motion } from "framer-motion";
import { projects } from "@/utils/parameter.projects";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getRandomImage } from "@/utils/image";
import Link from "next/link";


const Projects = () => {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  // Show only first 6 projects if showAll is false
  const visibleProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <section className="px-6 py-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 rounded-xl">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-neutral-800 dark:text-neutral-100">
        My Projects
      </h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
      >
        {visibleProjects.map((project, index) => {
          const src = project.thumbnail ?? getRandomImage(640, 360);
          return (
            <motion.div
              key={project.slug}
              variants={itemVariants}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => router.push(`/projects/${project.slug}`)}
            >
              {project.thumbnail && (
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <Image
                    src={src}
                    alt={`${project.title} thumbnail`}
                    width={640}
                    height={360}
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                  {project.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="inline-block bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-auto">
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary font-semibold hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} /> Live
                  </Link>
                )}
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary font-semibold hover:underline"
                  onClick={e => e.stopPropagation()}
                >
                  <Github size={16} /> GitHub
                </Link>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Show All button */}
      {projects.length > 6 && !showAll && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition"
          >
            Show All Projects
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;

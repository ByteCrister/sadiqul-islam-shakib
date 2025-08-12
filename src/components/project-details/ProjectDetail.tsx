"use client";

import { useEffect } from "react";
import { Project } from "@/utils/parameter.projects";
import Image from "next/image";
import Link from "next/link";
import {
    Github,
    ExternalLink,
    CalendarDays,
    Sparkles,
    TriangleAlert,
    BookOpen,
} from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { getRandomImage } from "@/utils/image";
import { FullscreenImage } from "./FullscreenImage";

const container: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
            when: "beforeChildren",
        },
    },
};

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2, duration: 0.6, ease: "easeInOut" },
    }),
};

const MotionLink = motion(Link);

interface ProjectDetailProps {
    project: Project;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    if (!project)
        return (
            <p className="text-red-500 text-center py-8">Project not found.</p>
        );

    return (
        <AnimatePresence>
            <motion.article
                key={project.slug}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={container}
                className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-br from-white/60 to-white/30 dark:from-neutral-900/60 dark:to-neutral-800/30 backdrop-blur-md border border-white/30 dark:border-neutral-700/40 rounded-3xl shadow-2xl"
            >
                {/* Title */}
                <motion.h1
                    variants={fadeIn}
                    custom={0}
                    className="text-5xl font-extrabold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                >
                    {project.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                    variants={fadeIn}
                    custom={1}
                    className="mt-6 text-lg text-neutral-700 dark:text-neutral-300 text-center max-w-3xl mx-auto leading-relaxed"
                >
                    {project.description}
                </motion.p>

                {/* Thumbnail */}
                <motion.div
                    variants={fadeIn}
                    custom={2}
                    className="mt-10 relative group overflow-hidden rounded-2xl shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Image
                        src={project.thumbnail ?? getRandomImage(640, 360)}
                        alt={`${project.title} thumbnail`}
                        width={1200}
                        height={675}
                        className="rounded-2xl w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </motion.div>

                {/* Timeline */}
                {project.timeline && (
                    <motion.div variants={fadeIn} custom={3} className="mt-6 flex justify-center">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-sm text-sm font-medium">
                            <CalendarDays className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            {project.timeline}
                        </div>
                    </motion.div>
                )}

                {/* Tech Stack */}
                <motion.div variants={fadeIn} custom={4} className="mt-8 flex flex-wrap justify-center gap-3">
                    {project.tech.map((tech, i) => (
                        <motion.span
                            key={tech}
                            variants={fadeIn}
                            custom={i}
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary dark:text-purple-300 shadow-sm border border-primary/20"
                        >
                            {tech}
                        </motion.span>
                    ))}
                </motion.div>

                {/* Links */}
                <motion.div variants={fadeIn} custom={5} className="mt-8 flex justify-center gap-6 font-semibold">
                    {project.liveUrl && (
                        <MotionLink
                            href={project.liveUrl}
                            target="_blank"
                            variants={fadeIn}
                            custom={6}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-200 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:text-neutral-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                            <ExternalLink className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                            Live Demo
                        </MotionLink>
                    )}
                    <MotionLink
                        href={project.githubUrl}
                        target="_blank"
                        variants={fadeIn}
                        custom={7}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-200 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:text-neutral-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                        <Github className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                        GitHub
                    </MotionLink>
                </motion.div>

                {/* Features / Challenges / Learnings */}
                {(["features", "challenges", "learnings"] as const).map((section, i) => {
                    const content = project[section] as string[] | undefined;
                    if (!content?.length) return null;

                    const sectionMeta = {
                        features: {
                            title: "Features",
                            icon: <Sparkles className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />,
                        },
                        challenges: {
                            title: "Challenges",
                            icon: <TriangleAlert className="w-6 h-6 text-red-500 dark:text-red-400" />,
                        },
                        learnings: {
                            title: "What I Learned",
                            icon: <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
                        },
                    }[section];

                    return (
                        <motion.div
                            key={section}
                            variants={fadeIn}
                            custom={i + 8}
                            className="mt-14 bg-gradient-to-br from-white/50 to-white/10 dark:from-neutral-800/40 dark:to-neutral-900/30 p-6 rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30 backdrop-blur-lg"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-white/70 dark:bg-neutral-800/70 shadow-sm">
                                    {sectionMeta.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {sectionMeta.title}
                                </h2>
                            </div>
                            <ul className="list-disc list-inside text-neutral-700 dark:text-neutral-200 space-y-2 pl-1">
                                {content.map((item, idx) => (
                                    <motion.li key={idx} variants={fadeIn} custom={idx + 1}>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    );
                })}

                {/* Single Full-Scale Screenshot */}
                {project.fullScreen && (
                    <motion.div
                        variants={fadeIn}
                        custom={3 /* bump indices of later sections by +1 */}
                        className="mt-10 max-w-4xl mx-auto"
                    >
                        <FullscreenImage
                            src={project.fullScreen}
                            alt={`${project.title} full-scale view`}
                            width={1280}
                            height={720}
                        />
                    </motion.div>
                )}

                {/* Additional Screenshots */}
                {project.images && project.images?.length > 0 && (
                    <motion.div
                        variants={fadeIn}
                        custom={20}
                        className="mt-16 grid gap-6 sm:grid-cols-2"
                    >
                        {project.images.map((img, idx) => (
                            <motion.div
                                key={idx}
                                className="relative overflow-hidden rounded-2xl shadow-lg group"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Image
                                    src={img}
                                    alt={`Screenshot ${idx + 1}`}
                                    width={600}
                                    height={400}
                                    className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.article>
        </AnimatePresence>
    );
};

export default ProjectDetail;

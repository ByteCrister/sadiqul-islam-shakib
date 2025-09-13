
import { getRandomImage } from "@/utils/image";
import Link from "next/link";
import { ExternalLink, Github, Code2, Eye, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Project } from "@/utils/parameter.projects";
import { Variants, motion } from "framer-motion";
import { useCallback, useState } from "react";

interface ProjectCardProps {
    project: Project;
    index: number;
    onClick: (slug: string) => void;
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    },
};

const cardHoverVariants: Variants = {
    hover: {
        y: -8,
        scale: 1.02,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

const ProjectCard = ({ project, index, onClick }: ProjectCardProps) => {
    const [imageLoading, setImageLoading] = useState(true);
    const src = project.thumbnail ?? getRandomImage(640, 360);

    const handleCardClick = useCallback(() => {
        onClick(project.slug);
    }, [project.slug, onClick]);

    const handleLinkClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <motion.article
            variants={itemVariants}
            whileHover="hover"
            className="group relative"
        >
            <motion.div
                variants={cardHoverVariants}
                className="relative h-full rounded-3xl bg-white dark:bg-neutral-900/70 border border-neutral-200/60 dark:border-neutral-800/60 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-neutral-200/20 dark:hover:shadow-neutral-900/30 transition-all duration-500 cursor-pointer"
                onClick={handleCardClick}
            >
                {/* Featured badge for first few projects */}
                {index < 3 && (
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 text-neutral-700 dark:text-neutral-200 text-xs font-semibold rounded-full shadow-lg shadow-neutral-200/25 dark:shadow-neutral-900/25">
                        <Sparkles className="w-3 h-3" />
                        Featured
                    </div>
                )}

                {/* Project Image */}
                {project.thumbnail && (
                    <div className="relative w-full h-56 overflow-hidden">
                        {imageLoading && (
                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 animate-pulse" />
                        )}
                        <Image
                            src={src}
                            alt={`${project.title} preview`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            quality={90}
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            onLoad={() => setImageLoading(false)}
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Quick action buttons */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            {project.liveUrl && (
                                <Link
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-center w-8 h-8 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform duration-200 group/btn"
                                >
                                    <Eye className="w-4 h-4 text-neutral-700 dark:text-neutral-200 group-hover/btn:text-green-600" />
                                </Link>
                            )}
                            <Link
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleLinkClick}
                                className="flex items-center justify-center w-8 h-8 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform duration-200 group/btn"
                            >
                                <Github className="w-4 h-4 text-neutral-700 dark:text-neutral-200 group-hover/btn:text-blue-600" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col h-full">
                    <div className="flex-1">
                        {/* Project Title */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                {project.title}
                            </h3>
                            <div className="flex-shrink-0 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                <Code2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed mb-4 line-clamp-3">
                            {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                    Tech Stack
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.slice(0, 4).map((tech, techIndex) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium rounded-lg border border-neutral-200/50 dark:border-neutral-600/50 hover:scale-105 transition-transform duration-200"
                                        style={{
                                            animationDelay: `${techIndex * 100}ms`
                                        }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {project.tech.length > 4 && (
                                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                        +{project.tech.length - 4}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
                        <div className="flex items-center gap-4">
                            {project.liveUrl && (
                                <Link
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleLinkClick}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:gap-2 transition-all duration-200"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Live Demo
                                </Link>
                            )}
                            <Link
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleLinkClick}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 hover:gap-2 transition-all duration-200"
                            >
                                <Github className="w-4 h-4" />
                                Code
                            </Link>
                        </div>

                        {/* View Details Arrow */}
                        <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                            <span className="hidden sm:inline">View Details</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.article>
    );
};

export default ProjectCard;
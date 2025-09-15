'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Users, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { SwiperProps } from 'swiper/react'
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCoverflow,
} from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import type SwiperType from 'swiper'

import { Project } from '@/utils/params/parameter.projects'

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const cardHover: Variants = {
  hover: {
    scale: 1.02,
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

interface ProjectHighlightsProps {
  projects: Project[]
}

export default function ProjectHighlights({ projects }: ProjectHighlightsProps) {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const paginationRef = useRef<HTMLDivElement>(null)
  const swiperRef = useRef<SwiperType | null>(null)

  useEffect(() => {
    if (
      swiperRef.current &&
      paginationRef.current &&
      swiperRef.current.params.pagination &&
      typeof swiperRef.current.params.pagination !== "boolean"
    ) {
      // point pagination to your custom div
      swiperRef.current.params.pagination.el = paginationRef.current

      // re-init pagination
      swiperRef.current.pagination.destroy()
      swiperRef.current.pagination.init()
      swiperRef.current.pagination.render()
      swiperRef.current.pagination.update()
    }
  }, []) // runs once after mount

  const swiperParams: SwiperProps = {
    modules: [Autoplay, Pagination, Navigation, EffectCoverflow],
    spaceBetween: 24,
    slidesPerView: 1,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 3,
    },
    navigation: {
      prevEl: prevRef.current!,
      nextEl: nextRef.current!,
    },
    effect: 'coverflow',
    coverflowEffect: { rotate: 0, stretch: -20, depth: 120, modifier: 1.5, slideShadows: false },
    breakpoints: {
      640: { slidesPerView: 1, spaceBetween: 20 },
      768: { slidesPerView: 2, spaceBetween: 24 },
      1024: { slidesPerView: 3, spaceBetween: 28 },
      1280: { slidesPerView: 3, spaceBetween: 32 },
    },
    className: 'pb-20',
  }

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.div
          variants={fadeUp}
          className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-700 border border-neutral-200/50 dark:border-neutral-600/50 mb-6"
        >
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Featured Work
          </span>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300 bg-clip-text text-transparent mb-4"
        >
          Project Highlights
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
        >
          Discover my latest work featuring modern technologies and innovative solutions
        </motion.p>
      </div>

      {/* Enhanced Navigation Buttons */}
      <button
        ref={prevRef}
        className="group absolute z-20 left-4 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 hover:scale-105 hover:shadow-lg hover:shadow-neutral-200/25 dark:hover:shadow-neutral-900/25 transition-all duration-300 flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
      </button>

      <button
        ref={nextRef}
        className="group absolute z-20 right-4 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 hover:scale-105 hover:shadow-lg hover:shadow-neutral-200/25 dark:hover:shadow-neutral-900/25 transition-all duration-300 flex items-center justify-center"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>

      {/* Swiper Container */}
      <motion.div variants={fadeUp}>
        <Swiper {...swiperParams}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
            if (
              paginationRef.current &&
              swiper.params.pagination &&
              typeof swiper.params.pagination !== 'boolean'
            ) {
              swiper.params.pagination.el = paginationRef.current
              swiper.pagination.destroy()
              swiper.pagination.init()
              swiper.pagination.render()
              swiper.pagination.update()
            }
          }}
        >
          {projects.map((proj, idx) => (
            <SwiperSlide key={proj.slug ?? idx} className="!max-w-sm">
              <motion.div
                variants={cardHover}
                whileHover="hover"
                className="group relative bg-white dark:bg-neutral-900/50 rounded-3xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-neutral-200/20 dark:hover:shadow-neutral-900/20 transition-all duration-500"
              >
                <a
                  href={`/projects/${proj.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={proj.thumbnail || proj.images?.[0] || '/placeholder.png'}
                      alt={proj.title}
                      fill
                      quality={90}
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* External Link Icon */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                      <ExternalLink className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {proj.title}
                      </h3>
                      <div className="flex-shrink-0 w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Tech Stack */}
                    {proj.tech?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {proj.tech.slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-200/50 dark:border-neutral-600/50 hover:scale-105 transition-transform duration-200"
                          >
                            {tech}
                          </span>
                        ))}
                        {proj.tech.length > 4 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            +{proj.tech.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </a>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination container */}
        <div ref={paginationRef} className="custom-pagination flex justify-center items-center mt-8 w-full" />

      </motion.div>
      {/* Custom Styles */}
      <style jsx>{`
  :global(.custom-pagination) {
    z-index: 10 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 8px !important;
    width: 100% !important;
    text-align: center !important;
    margin: 0 auto !important;
    position: relative !important;
  }
    :global(.swiper-pagination) {
  display: none !important;
}

  /* Base bullet */
  :global(.custom-pagination .swiper-pagination-bullets) {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100% !important;
  }

  /* Hover state */
  :global(.custom-pagination .swiper-pagination-bullet:hover) {
    background: rgba(0, 0, 0, 0.6) !important; /* darker on hover */
    transform: scale(1.15) !important;
  }

  /* Active bullet → pill style */
  :global(.custom-pagination .swiper-pagination-bullet-active) {
    width: 28px !important;
    height: 10px !important;
    background: rgba(0, 0, 0, 0.8) !important; /* solid black pill */
    border-radius: 9999px !important;
    transform: scale(1.1) !important;
  }

  /* Dark mode */
  :global(.dark .custom-pagination .swiper-pagination-bullet) {
    background: rgba(255, 255, 255, 0.3) !important; /* light gray/30 */
  }

  :global(.dark .custom-pagination .swiper-pagination-bullet:hover) {
    background: rgba(255, 255, 255, 0.6) !important;
  }

  :global(.dark .custom-pagination .swiper-pagination-bullet-active) {
    background: rgba(255, 255, 255, 0.9) !important; /* bright white pill */
  }

  /* Hide default Swiper nav arrows */
  :global(.swiper-button-next),
  :global(.swiper-button-prev) {
    display: none !important;
  }
`}</style>

    </motion.section>
  )
}
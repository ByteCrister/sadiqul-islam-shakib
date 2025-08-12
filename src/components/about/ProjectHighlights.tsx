'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
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

import { Project } from '@/utils/parameter.projects'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

interface ProjectHighlightsProps {
  projects: Project[]
}

export default function ProjectHighlights({ projects }: ProjectHighlightsProps) {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const swiperParams: SwiperProps = {
    modules: [Autoplay, Pagination, Navigation, EffectCoverflow],
    spaceBetween: 32,
    slidesPerView: 1,
    centeredSlides: true,
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: { clickable: true },
    navigation: {
      prevEl: prevRef.current!,
      nextEl: nextRef.current!,
    },
    onBeforeInit: (swiper) => {
      if (
        swiper.params.navigation &&
        typeof swiper.params.navigation !== 'boolean'
      ) {
        swiper.params.navigation.prevEl = prevRef.current!
        swiper.params.navigation.nextEl = nextRef.current!
      }
    },
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 160,
      modifier: 1.8,
      slideShadows: false,
    },
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
    className: 'pb-16',
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="relative mt-24 max-w-6xl mx-auto px-6"
    >
      <motion.h3
        variants={fadeUp}
        className="text-3xl font-bold mb-10 text-center font-sans text-neutral-800 dark:text-neutral-100"
      >
        Project Highlights
      </motion.h3>

      {/* Glassmorphic Navigation Buttons */}
      <button
        ref={prevRef}
        className="swiper-button-prev-custom absolute z-10 left-6 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/30 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 p-3 rounded-full hover:scale-110 transition-all shadow-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        ref={nextRef}
        className="swiper-button-next-custom absolute z-10 right-6 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/30 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 p-3 rounded-full hover:scale-110 transition-all shadow-lg"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <Swiper {...swiperParams}>
        {projects.map((proj, idx) => (
          <SwiperSlide key={proj.slug ?? idx} className="!max-w-sm px-2 pb-10">
            <motion.div
              variants={fadeUp}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <a href={`/projects/${proj.slug}`} target="_blank" rel="noreferrer">
                <div className="relative w-full h-52 rounded-t-2xl overflow-hidden">
                  <Image
                    src={proj.thumbnail || proj.images?.[0] || '/placeholder.png'}
                    alt={proj.title}
                    fill
                    quality={85}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                      {proj.title}
                    </h4>
                    <Users className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                  </div>

                  <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
                    {proj.description}
                  </p>

                  {proj.tech?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {proj.tech.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        :global(.swiper-pagination) {
          bottom: 0 !important;
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          padding-top: 1rem;
          z-index: 10;
        }

        :global(.swiper-pagination-bullet) {
          width: 24px;
          height: 8px;
          background-color: #4b5563;
          opacity: 0.5;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        :global(.swiper-pagination-bullet-active) {
          width: 40px;
          background-color: #374151;
          opacity: 1;
          box-shadow: 0 0 8px rgba(55, 65, 81, 0.6);
        }

        :global(.dark .swiper-pagination-bullet) {
          background-color: #6b7280;
        }

        :global(.dark .swiper-pagination-bullet-active) {
          background-color: #9ca3af;
          box-shadow: 0 0 8px rgba(156, 163, 175, 0.6);
        }
      `}</style>
    </motion.div>
  )
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { HeroWords } from "@/utils/params/parameter.hero";
import { ProfileImagePath, userName } from "@/utils/params/parameter.global";
import { useEffect, useRef, useState, useMemo } from "react";
import type { DSkill } from "@/types/dashboard.types";
import DynamicIcon from "../global/DynamicIcon";

const MotionLink = motion(Link);

interface HeroProps {
  skills?: DSkill[];
}

export default function Hero({ skills = [] }: HeroProps) {
  // Looping typewriter for the editorial accent phrase
  const [tagText] = useTypewriter({
    words: HeroWords,
    loop: true,
    typeSpeed: 75,
    deleteSpeed: 35,
    delaySpeed: 1600,
  });

  // Container stagger
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.16 } },
  };

  // Fade-up for each child
  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    show:  { y: 0, opacity: 1, transition: { duration: 0.55, ease: "easeOut" } },
  };

  // Skill category stagger
  const categoryVariants: Variants = {
    hidden: { y: 12, opacity: 0 },
    show:  { y: 0, opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
  };

  // Skill pill fade-scale
  const skillItem: Variants = {
    hidden: { opacity: 0, y: 6, scale: 0.96 },
    show:  {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  // Cycling active-skill state
  const skillsContainerRef = useRef<HTMLDivElement | null>(null);
  const skillRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || skills.length <= 1) return;
    const id = setInterval(
      () => setActiveIndex((prev) => (prev + 1) % skills.length),
      1200
    );
    return () => clearInterval(id);
  }, [paused, skills.length]);

  // Group skills by category preserving original indices
  const groupedSkills = useMemo(() => {
    const groups: { category: string; skills: { skill: DSkill; originalIndex: number }[] }[] = [];
    skills.forEach((skill, index) => {
      let group = groups.find((g) => g.category === skill.category);
      if (!group) {
        group = { category: skill.category, skills: [] };
        groups.push(group);
      }
      group.skills.push({ skill, originalIndex: index });
    });
    return groups;
  }, [skills]);

  return (
    /* Subframe spec: canvas bg, centered, generous vertical rhythm */
    <section className="min-h-[90vh] pb-16 flex flex-col justify-center items-center text-center px-4 bg-canvas relative z-10">

      {/* ── Main content stack ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl w-full pt-4"
      >

        {/* Profile image — 24px radius frame, hairline border, no shadow */}
        <motion.div
          variants={item}
          className="mx-auto mb-8 w-32 h-32 md:w-36 md:h-36 rounded-images overflow-hidden
                     border border-hairline transition-all duration-300 hover:border-graphite"
        >
          <Image
            src={ProfileImagePath}
            alt="Sadiqul Islam Shakib"
            width={144}
            height={144}
            className="object-cover w-full h-full"
            priority
          />
        </motion.div>

        {/*
          Hero Display Headline — Subframe spec:
          Inter 700, compressed tracking, ink black.
          One Instrument Serif word for editorial punctuation.
        */}
        <motion.h1
          variants={item}
          className="text-[48px] md:text-[64px] lg:text-[80px] font-bold leading-[1.08]
                     tracking-[-2.4px] md:tracking-[-3.2px] lg:tracking-[-4px]
                     text-ink mb-0"
        >
          <span>Hi, I&apos;m </span>
          {/*
            The Instrument Serif word — "the signature move":
            a single serif word larger than the surrounding sans type.
          */}
          <span className="font-serif font-normal tracking-[-0.025em] text-ink">
            {userName}
          </span>
          <span className="text-faint">
            <Cursor cursorStyle=" |" />
          </span>
        </motion.h1>

        {/*
          Typewriter subhead — Inter 500, pencil color.
          The changing word is rendered in the same Instrument Serif for
          the editorial accent moment DESIGN.md describes.
        */}
        <motion.p
          variants={item}
          className="mt-6 text-[18px] font-medium tracking-[-0.45px] leading-[1.33] text-pencil"
        >
          I craft{" "}
          <span className="font-serif font-normal text-[1.25em] tracking-[-0.025em] text-ink leading-none align-middle">
            {tagText}
          </span>
          <span className="text-faint">
            <Cursor cursorStyle="_" />
          </span>
        </motion.p>

        {/* ── CTAs — Dark Filled Button + Ghost Button ── */}
        <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {/* Primary — Dark filled (Subframe: the loudest element on the page) */}
          <MotionLink
            href="/projects"
            aria-label="Explore projects"
            className="btn-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            Explore Projects →
          </MotionLink>

          {/* Secondary — Ghost button */}
          <MotionLink
            href="/about"
            aria-label="About me"
            className="btn-ghost"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            About me
          </MotionLink>
        </motion.div>
      </motion.div>

      {/* ── Skills grouped by category ── */}
      <motion.div
        initial="hidden"
        animate="show"
        ref={skillsContainerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="mt-16 w-full max-w-2xl mx-auto space-y-8"
      >
        {groupedSkills.map((group) => (
          <motion.div
            key={group.category}
            variants={categoryVariants}
            className="space-y-3"
          >
            {/* Category label — caption scale, faint, uppercase */}
            <h4 className="text-[12px] font-semibold text-faint uppercase tracking-[0.08em]">
              {group.category}
            </h4>

            <div className="flex flex-wrap justify-center gap-2">
              {group.skills.map(({ skill, originalIndex }) => {
                const isActive = originalIndex === activeIndex;
                return (
                  <motion.div
                    key={skill.id}
                    variants={skillItem}
                    ref={(el) => { skillRefs.current[originalIndex] = el; }}
                    onMouseEnter={() => { setPaused(true); setActiveIndex(originalIndex); }}
                    onMouseLeave={() => setPaused(false)}
                    animate={isActive ? { scale: 1.06, y: -4 } : { scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    /*
                      Subframe skill pill:
                      card-surface bg, hairline border, 16px radius (buttons tier).
                      Active state → ink border + slight graphite tint.
                    */
                    className={`flex items-center gap-2 px-3 py-2 rounded-buttons
                                transition-colors duration-200 relative z-10
                                ${isActive
                                  ? "bg-graphite border border-graphite shadow-sm"
                                  : "bg-card-surface border border-hairline hover:border-divider"
                                }`}
                  >
                    <DynamicIcon
                      iconName={skill.iconName}
                      platform={skill.iconPlatform}
                      className={`w-4 h-4 ${isActive ? "text-canvas" : "text-pencil"}`}
                    />
                    <span className={`text-[13px] font-medium tracking-[-0.06px] ${
                      isActive ? "text-canvas" : "text-ink"
                    }`}>
                      {skill.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { HeroWords } from "@/utils/params/parameter.hero";
import { ProfileImagePath, userName } from "@/utils/params/parameter.global";
import { skills } from "@/utils/params/parameter.about";
import { useEffect, useRef, useState, useMemo } from "react";

const MotionLink = motion(Link);

export default function Hero() {
  // Looping tagline
  const [tagText] = useTypewriter({
    words: HeroWords,
    loop: true,
    typeSpeed: 80,
    deleteSpeed: 40,
    delaySpeed: 1500,
  });

  // Parent container variants (for main content)
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.18 },
    },
  };

  // Generic item variants used for heading, image, paragraph
  const item: Variants = {
    hidden: { y: 18, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Variants for category containers (fade up)
  const categoryVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Skill item variants (used inside each category)
  const skillItem: Variants = {
    hidden: { opacity: 0, y: 8, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  // --- cycling highlight state ---
  const skillsContainerRef = useRef<HTMLDivElement | null>(null);
  const skillRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const cycleIntervalMs = 1200;

  // Cycle through skills automatically
  useEffect(() => {
    if (paused || skills.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % skills.length);
    }, cycleIntervalMs);
    return () => clearInterval(id);
  }, [paused]);

  // Hover handlers
  function handleSkillEnter(index: number) {
    setPaused(true);
    setActiveIndex(index);
  }
  function handleSkillLeave() {
    setPaused(false);
  }
  function handleContainerEnter() {
    setPaused(true);
  }
  function handleContainerLeave() {
    setPaused(false);
  }

  // Group skills by category, preserving original indices for refs and active index
  const groupedSkills = useMemo(() => {
    const groups: { category: string; skills: { skill: typeof skills[0]; originalIndex: number }[] }[] = [];
    skills.forEach((skill, index) => {
      let group = groups.find((g) => g.category === skill.category);
      if (!group) {
        group = { category: skill.category, skills: [] };
        groups.push(group);
      }
      group.skills.push({ skill, originalIndex: index });
    });
    return groups;
  }, []);

  return (
    <section
      className="min-h-[90vh] pb-12 flex flex-col justify-center items-center text-center px-4
                 bg-gradient-to-br from-neutral-50 dark:from-neutral-900 rounded-xl relative z-10"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl pt-3"
      >
        {/* Profile Image */}
        <motion.div
          variants={item}
          className="mx-auto mb-6 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden
                     border-2 border-neutral-300 dark:border-neutral-700 shadow-md
                     hover:shadow-xl transition-shadow duration-300"
        >
          <Image
            src={ProfileImagePath}
            alt="Sadiqul Islam Shakib"
            width={160}
            height={160}
            className="object-cover w-full h-full"
            priority
          />
        </motion.div>

        {/* Animated Heading */}
        <motion.h1
          variants={item}
          className="text-5xl md:text-6xl font-extrabold leading-tight"
        >
          <span className="inline-block mr-2">Hi, I&apos;m</span>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {userName} <Cursor cursorStyle="|" />
          </span>
        </motion.h1>

        {/* Typing Tagline */}
        <motion.p
          variants={item}
          className="mt-6 text-lg md:text-xl text-neutral-600 dark:text-neutral-300"
        >
          I craft&nbsp;
          <span className="font-semibold text-primary">
            {tagText} <Cursor cursorStyle="_" />
          </span>
        </motion.p>

        {/* Call-to-Action */}
        <motion.div variants={item} className="mt-10">
          <MotionLink
            href="/projects"
            aria-label="Explore projects"
            className="inline-block rounded-2xl bg-primary px-8 py-3 text-white
                       dark:text-neutral-600 text-base font-medium shadow-lg hover:shadow-xl
                       transition-all"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Explore Projects →
          </MotionLink>
        </motion.div>
      </motion.div>

      {/* Skills Section - Grouped by Category */}
      <motion.div
        initial="hidden"
        animate="show"
        ref={skillsContainerRef}
        onMouseEnter={handleContainerEnter}
        onMouseLeave={handleContainerLeave}
        className="mt-8 relative max-w-xl mx-auto space-y-6"
      >
        {groupedSkills.map((group) => (
          <motion.div
            key={group.category}
            variants={categoryVariants}
            className="space-y-2"
          >
            <h4 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {group.category}
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {group.skills.map(({ skill, originalIndex }) => {
                const Icon = skill.Icon;
                const isActive = originalIndex === activeIndex;

                return (
                  <motion.div
                    key={skill.name}
                    variants={skillItem}
                    ref={(el) => {
                      skillRefs.current[originalIndex] = el;
                    }}
                    onMouseEnter={() => handleSkillEnter(originalIndex)}
                    onMouseLeave={handleSkillLeave}
                    animate={isActive ? { scale: 1.08, y: -6 } : { scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800
                                rounded-lg border transition-colors duration-300 relative z-10
                                ${isActive ? "border-primary dark:border-primary shadow-lg" : "border-neutral-200 dark:border-neutral-700"}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-primary"}`} />
                    <span className={`text-sm font-medium ${isActive ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-700 dark:text-neutral-300"}`}>
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
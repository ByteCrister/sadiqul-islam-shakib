"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { HeroWords } from "@/utils/parameter.hero";
import { userName } from "@/utils/parameter.global";

const MotionLink = motion.create(Link);

export default function Hero() {

  // Looping tagline
  const [tagText] = useTypewriter({
    words: HeroWords,
    loop: true,
    typeSpeed: 80,
    deleteSpeed: 40,
    delaySpeed: 1500,
  });

  // Parent container variants
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  // Child item variants
  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      className="
      h-[90vh] flex flex-col justify-center items-center text-center
      px-4 bg-gradient-to-br from-neutral-50 dark:from-neutral-900 rounded-xl
    "
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl"
      >
        {/* Profile Image */}
        <motion.div
          variants={item}
          className="
    mx-auto mb-6
    w-32 h-32 md:w-40 md:h-40
    rounded-full overflow-hidden
    border-2 border-neutral-300 dark:border-neutral-700
    shadow-md hover:shadow-xl transition-shadow duration-300
  "
        >
          <Image
            src="/images/shakib.jpg"
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
            {userName}
            <Cursor cursorStyle="|" />
          </span>
        </motion.h1>

        {/* Typing Tagline */}
        <motion.p
          variants={item}
          className="mt-6 text-lg md:text-xl text-neutral-600 dark:text-neutral-300"
        >
          I craft&nbsp;
          <span className="font-semibold text-primary">
            {tagText}
            <Cursor cursorStyle="_" />
          </span>
        </motion.p>

        {/* Call-to-Action */}
        <motion.div variants={container} className="mt-10">
          <MotionLink
            href="/projects"
            className="
              inline-block rounded-2xl bg-primary px-8 py-3
              text-white dark:text-neutral-600 text-base font-medium
              shadow-lg hover:shadow-xl transition-all
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Explore Projects →
          </MotionLink>
        </motion.div>
      </motion.div>
    </section>
  );
}

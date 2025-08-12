"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
    motion,
    Variants,
    useMotionValue,
    useSpring,
    useInView,
} from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { projects } from "@/utils/parameter.projects";
import { counterData, experiences, skills } from "@/utils/parameter.about";
import ProjectHighlights from "./ProjectHighlights";

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const fadeUp: Variants = {
    hidden: { y: 30, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export default function About() {
    const [bioText] = useTypewriter({
        words: [
            "I build pixel-perfect user interfaces.",
            "I love crafting smooth animations.",
            "I thrive on solving complex problems.",
        ],
        loop: true,
        typeSpeed: 80,
        deleteSpeed: 40,
        delaySpeed: 2000,
    });

    const statsRef = useRef(null);
    const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

    const motionValue0 = useMotionValue(0);
    const motionValue1 = useMotionValue(0);
    const motionValue2 = useMotionValue(0);

    const spring0 = useSpring(motionValue0, { stiffness: 80, damping: 20 });
    const spring1 = useSpring(motionValue1, { stiffness: 80, damping: 20 });
    const spring2 = useSpring(motionValue2, { stiffness: 80, damping: 20 });

    const motionValues = useMemo(
        () => [motionValue0, motionValue1, motionValue2],
        [motionValue0, motionValue1, motionValue2]
    );
    const springs = useMemo(
        () => [spring0, spring1, spring2],
        [spring0, spring1, spring2]
    );

    const [displayValues, setDisplayValues] = useState(counterData.map(() => 0));

    useEffect(() => {
        const unsubscribers = springs.map((spring, i) =>
            spring.on("change", (latest) => {
                setDisplayValues((prev) => {
                    const copy = [...prev];
                    copy[i] = Math.ceil(latest);
                    return copy;
                });
            })
        );
        return () => unsubscribers.forEach((unsub) => unsub());
    }, [springs]);

    useEffect(() => {
        if (isStatsInView) {
            counterData.forEach((data, i) => motionValues[i].set(data.value));
        }
    }, [isStatsInView, motionValues]);

    return (
        <section className="relative overflow-hidden px-6 py-20 bg-gradient-to-br from-white to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl">
            <motion.div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10" />
            <motion.div className="absolute bottom-16 right-1/3 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-2xl -z-10" />

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="max-w-3xl mx-auto text-center space-y-6"
            >
                <motion.h2
                    variants={fadeUp}
                    className="text-5xl md:text-6xl font-extrabold"
                >
                    About Me
                </motion.h2>
                <motion.p
                    variants={fadeUp}
                    className="text-xl text-neutral-600 dark:text-neutral-300"
                >
                    <span className="font-semibold text-primary">{bioText}</span>
                    <Cursor cursorStyle="_" />
                </motion.p>
            </motion.div>

            <motion.div
                ref={statsRef}
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-16 flex flex-wrap justify-center gap-10"
            >
                {counterData.map(({ Icon, label }, i) => (
                    <motion.div
                        key={label}
                        variants={fadeUp}
                        className="flex flex-col items-center w-36"
                    >
                        <Icon className="w-8 h-8 text-primary" />
                        <motion.span className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">
                            {displayValues[i]}
                        </motion.span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {label}
                        </span>
                    </motion.div>
                ))}
            </motion.div>

            {/* core skills */}
            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-20 max-w-5xl mx-auto"
            >
                <motion.h3
                    variants={fadeUp}
                    className="text-3xl font-semibold mb-6 text-center text-neutral-800 dark:text-neutral-100"
                >
                    Core Skills
                </motion.h3>
                <motion.div
                    variants={container}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {skills.map(({ name, Icon }) => (
                        <motion.div
                            key={name}
                            variants={fadeUp}
                            whileHover={{ scale: 1.05 }}
                            className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4 flex flex-col items-center gap-2"
                        >
                            <Icon size={32} className="text-primary" />
                            <span className="text-neutral-800 dark:text-neutral-100 font-medium">
                                {name}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* project highlights */}
            <ProjectHighlights projects={projects} />

            {/* Experience & Education  */}
            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-28 max-w-4xl mx-auto px-4 sm:px-6 relative"
            >
                <motion.h3
                    variants={fadeUp}
                    className="
                    font-sans
    relative z-20
    inline-block px-4 py-2
    bg-none
    text-neutral-800 dark:text-slate-100
    text-3xl font-bold mb-10 text-center
  "
                >
                    Experience & Education
                </motion.h3>
                <div
                    className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-neutral-300 dark:bg-neutral-600 z-0"
                    aria-hidden="true"
                />

                {experiences.map(({ icon: Icon, ...exp }, idx) => {
                    const isRight = idx % 2 === 0;

                    return (
                        <motion.div
                            key={exp.role}
                            variants={fadeUp}
                            className={`relative w-full md:w-1/2 p-6 mb-10 ${isRight ? "md:ml-auto md:text-left" : "md:mr-auto md:text-left"}`}
                        >
                            <div
                                className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-10 h-10 bg-primary text-white dark:text-gray-600 rounded-full flex items-center justify-center"
                            >
                                <Icon size={20} />
                            </div>

                            <time className="text-sm font-medium text-neutral-500 italic dark:text-neutral-400 block">
                                {exp.period}
                            </time>
                            <h4 className="mt-1 text-2xl font-semibold font-serif text-neutral-800 dark:text-neutral-100">
                                {exp.role}
                            </h4>
                            <p className="mt-2 text-neutral-700 dark:text-neutral-200">
                                {exp.description} <span className="font-medium text-primary">@ {exp.org}</span>
                            </p>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}

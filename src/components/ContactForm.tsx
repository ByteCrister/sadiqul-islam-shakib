"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const ContactForm = () => {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");
        try {
            await new Promise((r) => setTimeout(r, 1200));
            setStatus("success");
        } catch {
            setStatus("error");
        }
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-3xl px-8 py-12 max-w-2xl mx-auto"
        >
            <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-extrabold mb-8 text-center text-neutral-900 dark:text-neutral-100"
            >
                Let&apos;s talk!
            </motion.h2>

            <form onSubmit={onSubmit} className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Input
                        name="name"
                        placeholder="Full name"
                        required
                        className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Email address"
                        required
                        className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Textarea
                        name="message"
                        placeholder="Your message…"
                        required
                        rows={5}
                        className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full bg-primary hover:bg-primary/90 text-white dark:text-gray-600 font-semibold text-lg py-3 rounded-xl shadow-md"
                    >
                        {status === "sending" ? "Sending…" : "Send Message"}
                    </Button>
                </motion.div>

                {status === "success" && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-600 dark:text-green-400 text-sm text-center mt-4"
                    >
                        Your message has been sent. Thank you!
                    </motion.p>
                )}

                {status === "error" && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-600 dark:text-red-400 text-sm text-center mt-4"
                    >
                        Something went wrong. Please try again.
                    </motion.p>
                )}
            </form>
        </motion.section>
    );
};

export default ContactForm;
"use client";

import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  ContactFormData,
  contactSchema,
} from "../../utils/validations/contact.validation";
import {
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  ArrowRight,
  Send,
} from "lucide-react";
import type { DSocialLink } from "@/types/dashboard.types";
import DynamicIcon from "@/components/global/DynamicIcon";

interface ContactProps {
  socialLinks?: DSocialLink[];
}

const Contact = ({ socialLinks = [] }: ContactProps) => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: ContactFormData) {
    setStatus("sending");
    try {
      await axios.post("/api/contact", data, {
        headers: { "Content-Type": "application/json" },
      });
      setStatus("success");
      reset();
    } catch (err) {
      console.error("Email send error:", err);
      setStatus("error");
    }
  }

  const getHref = (item: DSocialLink) => {
    if (item.name.toLowerCase() === "email") return `mailto:${item.href}`;
    return item.href;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
      className="relative max-w-2xl mx-auto"
    >
      {/* Enhanced background glow + subtle noise */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-neutral-200/60 via-transparent to-neutral-300/40 dark:from-neutral-700/40 dark:via-transparent dark:to-neutral-600/20 pointer-events-none" />
      <div className="absolute inset-0 rounded-3xl opacity-20 mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4wNCIgLz48L3N2Zz4=')]" />

      <div className="relative bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border border-neutral-200/80 dark:border-neutral-800/80 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] rounded-3xl overflow-hidden">
        {/* Top accent line - thinner and more elegant */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-400/40 dark:via-neutral-500/40 to-transparent" />

        <div className="px-6 py-10 sm:px-10 sm:py-14">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-10 text-center">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-neutral-400 dark:text-neutral-500 mb-3">
                Get in touch
              </p>
              <h2 className="text-4xl sm:text-5xl font-serif tracking-tight text-neutral-900 dark:text-neutral-50">
                Let&apos;s connect
              </h2>
              <div className="mt-5 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
            </motion.div>

            {/* Social Links - more refined grid */}
            <motion.div variants={itemVariants} className="mb-12">
              <p className="text-[9px] font-semibold tracking-[0.22em] uppercase text-neutral-400 dark:text-neutral-600 mb-5 text-center">
                Find me on
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {socialLinks.map((item, index) => {
                  return (
                    <motion.a
                      key={item.id}
                      href={getHref(item)}
                      target={item.name.toLowerCase() === "email" ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index + 0.3, duration: 0.3 }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/60 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-200 shadow-sm hover:shadow"
                    >
                      <DynamicIcon
                        iconName={item.iconName}
                        platform={item.iconPlatform}
                        className="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors"
                      />
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
                        {item.name}
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-[9px] tracking-[0.22em] uppercase font-medium text-neutral-400 dark:text-neutral-600">
                or send a message
              </span>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            </motion.div>

            {/* Form */}
            <motion.form
              variants={containerVariants}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Name Field */}
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label
                  className={`flex items-center gap-2 text-[10px] font-medium tracking-wider uppercase transition-colors ${errors.name
                      ? "text-red-500"
                      : focusedField === "name"
                        ? "text-neutral-800 dark:text-neutral-200"
                        : "text-neutral-500 dark:text-neutral-500"
                    }`}
                >
                  <User size={12} />
                  {errors.name ? errors.name.message : "Full name"}
                </label>
                <div className="relative">
                  <Input
                    {...register("name")}
                    placeholder="John Doe"
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className="h-11 rounded-xl border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/90 dark:bg-neutral-800/60 focus:bg-white dark:focus:bg-neutral-800 focus:border-neutral-500 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/20 dark:focus:ring-neutral-400/20 transition-all text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-300 dark:placeholder:text-neutral-600 text-sm px-4"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-neutral-700 dark:bg-neutral-400 rounded-full"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: focusedField === "name" ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{ width: "100%" }}
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label
                  className={`flex items-center gap-2 text-[10px] font-medium tracking-wider uppercase transition-colors ${errors.email
                      ? "text-red-500"
                      : focusedField === "email"
                        ? "text-neutral-800 dark:text-neutral-200"
                        : "text-neutral-500 dark:text-neutral-500"
                    }`}
                >
                  <Mail size={12} />
                  {errors.email ? errors.email.message : "Email address"}
                </label>
                <div className="relative">
                  <Input
                    {...register("email")}
                    placeholder="you@example.com"
                    type="email"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="h-11 rounded-xl border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/90 dark:bg-neutral-800/60 focus:bg-white dark:focus:bg-neutral-800 focus:border-neutral-500 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/20 dark:focus:ring-neutral-400/20 transition-all text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-300 dark:placeholder:text-neutral-600 text-sm px-4"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-neutral-700 dark:bg-neutral-400 rounded-full"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: focusedField === "email" ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{ width: "100%" }}
                  />
                </div>
              </motion.div>

              {/* Message Field */}
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label
                  className={`flex items-center gap-2 text-[10px] font-medium tracking-wider uppercase transition-colors ${errors.message
                      ? "text-red-500"
                      : focusedField === "message"
                        ? "text-neutral-800 dark:text-neutral-200"
                        : "text-neutral-500 dark:text-neutral-500"
                    }`}
                >
                  <MessageSquare size={12} />
                  {errors.message ? errors.message.message : "Your message"}
                </label>
                <div className="relative">
                  <Textarea
                    {...register("message")}
                    placeholder="Write your message…"
                    rows={4}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    className="rounded-xl border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/90 dark:bg-neutral-800/60 focus:bg-white dark:focus:bg-neutral-800 focus:border-neutral-500 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/20 dark:focus:ring-neutral-400/20 transition-all text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-300 dark:placeholder:text-neutral-600 text-sm px-4 py-3 resize-none"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-neutral-700 dark:bg-neutral-400 rounded-full"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: focusedField === "message" ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{ width: "100%" }}
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-3">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full h-11 rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-neutral-950 dark:from-neutral-100 dark:to-neutral-200 dark:hover:from-white dark:hover:to-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-neutral-900 text-sm font-medium tracking-wide transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.span
                        key="sending"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="w-3.5 h-3.5 border-2 border-white/30 dark:border-neutral-900/30 border-t-white dark:border-t-neutral-900 rounded-full"
                        />
                        <span>Sending…</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <Send size={14} />
                        Send message
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>

              {/* Status Messages */}
              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 py-2.5 px-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-l-4 border-neutral-600 dark:border-neutral-400 shadow-sm"
                  >
                    <CheckCircle size={16} className="text-neutral-600 dark:text-neutral-300 shrink-0" />
                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Message sent — I&apos;ll be in touch soon.
                    </p>
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 py-2.5 px-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-l-4 border-red-500 shadow-sm"
                  >
                    <XCircle size={16} className="text-red-500 shrink-0" />
                    <p className="text-xs font-medium text-red-600 dark:text-red-400">
                      Something went wrong. Please try again.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200/60 dark:via-neutral-700/50 to-transparent" />
      </div>
    </motion.section>
  );
};

export default Contact;
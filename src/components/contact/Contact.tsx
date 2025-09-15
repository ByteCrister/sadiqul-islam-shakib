"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ContactFormData, contactSchema } from "../../utils/validations/contact.validation";
import { Mail, User, MessageSquare } from "lucide-react";

const Contact = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",       
    reValidateMode: "onChange"
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-3xl px-8 py-[10vh] max-w-2xl mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-8 text-center text-neutral-900 dark:text-neutral-100"
      >
        Let&apos;s Connect
      </motion.h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div className="space-y-1.5">
          <label className={`flex items-center gap-2 text-sm font-medium ${errors.name ? "text-red-500" : "text-neutral-700 dark:text-neutral-300"}`}>
            <User size={16} />
            {errors.name ? errors.name.message : "Full Name"}
          </label>
          <Input
            {...register("name")}
            placeholder="John Doe"
            className="rounded-lg border-neutral-300 dark:border-neutral-700 focus:border-neutral-500 focus:ring-neutral-500"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className={`flex items-center gap-2 text-sm font-medium ${errors.email ? "text-red-500" : "text-neutral-700 dark:text-neutral-300"}`}>
            <Mail size={16} />
            {errors.email ? errors.email.message : "Email Address"}
          </label>
          <Input
            {...register("email")}
            placeholder="you@example.com"
            type="email"
            className="rounded-lg border-neutral-300 dark:border-neutral-700 focus:border-neutral-500 focus:ring-neutral-500"
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className={`flex items-center gap-2 text-sm font-medium ${errors.message ? "text-red-500" : "text-neutral-700 dark:text-neutral-300"}`}>
            <MessageSquare size={16} />
            {errors.message ? errors.message.message : "Your Message"}
          </label>
          <Textarea
            {...register("message")}
            placeholder="Write your message..."
            rows={4}
            className="rounded-lg border-neutral-300 dark:border-neutral-700 focus:border-neutral-500 focus:ring-neutral-500"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-neutral-700 hover:bg-neutral-800 text-white font-medium py-3 transition-colors"
        >
          {isSubmitting ? "Sending…" : "Send Message"}
        </Button>

        {/* Status messages */}
        {status === "success" && <p className="text-green-600 text-center">✅ Message sent successfully!</p>}
        {status === "error" && <p className="text-red-600 text-center">❌ Failed to send. Please try again.</p>}
      </form>
    </motion.section>
  );
};

export default Contact;

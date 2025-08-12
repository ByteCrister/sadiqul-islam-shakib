"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ContactFormData, contactSchema } from "./contactSchema";

const Contact = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
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
      className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-3xl px-8 py-12 max-w-2xl mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-extrabold mb-8 text-center text-neutral-900 dark:text-neutral-100"
      >
        Let&apos;s connect!
      </motion.h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input {...register("name")} placeholder="Full name" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Input {...register("email")} placeholder="Email address" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Textarea {...register("message")} placeholder="Your message…" />
          {errors.message && <p className="text-red-500">{errors.message.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send Message"}
        </Button>
        {status === "success" && <p className="text-green-600">Message sent!</p>}
        {status === "error" && <p className="text-red-600">Send failed. Try again.</p>}
      </form>
    </motion.section>
  );
};

export default Contact;

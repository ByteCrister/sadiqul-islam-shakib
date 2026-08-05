"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function FormModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: FormModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`
              relative w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col
              bg-white/95 dark:bg-neutral-900/95 backdrop-blur-3xl border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl shadow-2xl shadow-neutral-900/10 dark:shadow-black/50 ring-1 ring-black/[0.02]
            `}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-neutral-200/60 dark:border-neutral-800/60 flex-shrink-0">
              <div className="min-w-0">
                <h2 id="modal-title" className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 truncate">{title}</h2>
                {description && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{description}</p>
                )}
              </div>
              <button
                id="modal-close-btn"
                onClick={onClose}
                className="ml-4 p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0 active:scale-[0.95]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
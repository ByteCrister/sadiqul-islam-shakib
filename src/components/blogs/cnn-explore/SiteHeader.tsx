"use client";

import React from "react";
import { motion } from "framer-motion";
import { colors, fonts } from "@/styles/cnn-architect.styles";
import { Kbd } from "@/components/ui/explore";

// Keyboard shortcuts displayed in the header
const KBD_HINTS: { kbd: string; label: string }[] = [
  { kbd: "Space", label: "Pause/Resume training" },
  { kbd: "R", label: "Reset model" },
  { kbd: "C", label: "Clear canvas" },
  { kbd: "P", label: "Predict" },
];

export const SiteHeader: React.FC = () => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="text-center relative"
    style={{ padding: "48px 0 32px" }}
  >
    {/* Decorative stars */}
    <div
      style={{
        fontSize: "1rem",
        color: colors.primary,
        opacity: 0.5,
        letterSpacing: "16px",
        marginBottom: "10px",
      }}
    >
      ✦ ✧ ✦
    </div>

    {/* Title with gradient */}
    <h1
      style={{
        fontFamily: fonts.display,
        fontSize: "clamp(1.7rem, 5vw, 3rem)",
        letterSpacing: "2px",
        background: `linear-gradient(125deg, ${colors.primary} 0%, ${colors.secondary} 45%, ${colors.accent3} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
        fontWeight: 400,
        position: "relative",
      }}
    >
      ✦ CNN Explorer ✦{/* Hand-drawn underline via SVG */}
      <div
        style={{
          height: "6px",
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='10'%3E%3Cpath d='M0 5 Q15 2 30 5 Q45 8 60 4 Q75 1 90 5 Q105 9 120 4 Q135 1 150 5 Q165 9 180 4 Q195 1 210 5 Q225 9 240 4 Q255 1 270 5 Q285 9 300 5' stroke='%2349B6E5' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") repeat-x center`,
          marginTop: "8px",
          opacity: 0.9,
        }}
      />
    </h1>

    {/* Subtitle */}
    <p
      style={{
        color: colors.textDim,
        fontFamily: fonts.mono,
        fontSize: "0.83rem",
        marginTop: "14px",
      }}
    >
      An interactive, fully transparent Convolutional Neural Network for
      handwritten digit classification
    </p>

    {/* Keyboard hints */}
    <div
      className="inline-flex flex-wrap justify-center gap-2.5"
      style={{
        marginTop: "14px",
        fontSize: "0.76rem",
        fontFamily: fonts.mono,
        color: colors.textDim,
      }}
    >
      {KBD_HINTS.map(({ kbd, label }) => (
        <span key={kbd}>
          <Kbd>{kbd}</Kbd> {label}
        </span>
      ))}
    </div>
  </motion.header>
);

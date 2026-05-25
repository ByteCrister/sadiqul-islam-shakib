"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, fonts } from "@/styles/cnn-architect.styles";

interface LoaderOverlayProps {
  visible: boolean;
  message: string;
}

export const LoaderOverlay: React.FC<LoaderOverlayProps> = ({
  visible,
  message,
}) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(255,249,240,0.95)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          gap: "24px",
        }}
      >
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          style={{
            width: "56px",
            height: "56px",
            border: `4px solid rgba(38,61,91,0.15)`,
            borderTop: `4px solid ${colors.primary}`,
            borderRight: `4px solid ${colors.accent3}`,
            borderRadius: "50%",
          }}
        />

        {/* Message */}
        <p
          style={{
            fontFamily: fonts.mono,
            fontSize: "0.88rem",
            color: colors.textDim,
          }}
        >
          {message}
        </p>
      </motion.div>
    )}
  </AnimatePresence>
);

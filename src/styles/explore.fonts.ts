// src/styles/explore.fonts.ts
// Doodle Design System — typography tokens
// primary/display = Delius Swash Caps | mono = JetBrains Mono

import { Delius_Swash_Caps, JetBrains_Mono } from "next/font/google";

export const deliusSwashCaps = Delius_Swash_Caps({
    weight: "400",          // only weight available for this face
    subsets: ["latin"],
    variable: "--font-display",
    display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});
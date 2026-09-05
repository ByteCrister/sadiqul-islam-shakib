/**
 * subframe.fonts.ts
 * ─────────────────────────────────────────────────────────────────
 * Subframe — Fonts (v2) — next/font/google
 * Source of truth: DESIGN.md
 *
 * This module uses `next/font/google` to load all design-system fonts.
 * Next.js automatically self-hosts, subsets, preloads, and applies
 * `font-display: swap` — no external network requests at runtime.
 *
 * Usage in your root layout (app/layout.tsx):
 *
 *   import { inter, instrumentSerif, jetbrainsMono } from '@/styles/design_v2/subframe.fonts';
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
 *         ...
 *       </html>
 *     );
 *   }
 *
 * Then reference via CSS custom properties in your stylesheets:
 *
 *   font-family: var(--font-inter);
 *   font-family: var(--font-instrument-serif);
 *   font-family: var(--font-fragment-mono);   ← powered by JetBrains Mono
 * ─────────────────────────────────────────────────────────────────
 */

import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

// ─── Inter ────────────────────────────────────────────────────────────────────

/**
 * Inter — System UI sans-serif.
 * Role: nav, body, buttons, subheadings, section headings, hero headline.
 * Weights: 500 (body/controls), 600 (subhead/nav), 700 (headings/hero).
 * CSS variable: `--font-inter`
 *
 * DESIGN.md: "Heavy negative tracking tightens the geometric forms at every
 * size, giving the UI a compressed, technical feel."
 */
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

// ─── Instrument Serif ─────────────────────────────────────────────────────────

/**
 * Instrument Serif — Display-only editorial serif.
 * Role: A single word or short phrase inside/after an Inter headline.
 * Weight: 400 only. Italic variant included for leaning elegance.
 * CSS variable: `--font-instrument-serif`
 *
 * DESIGN.md: "The signature move: a single serif word or phrase inside
 * an otherwise sans-serif page, acting as visual punctuation rather
 * than a heading style."
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
  preload: true,
});

// ─── JetBrains Mono (Fragment Mono substitute) ────────────────────────────────

/**
 * JetBrains Mono — Substitute for Fragment Mono.
 * Role: Inline code, tag labels, technical callouts, micro-annotations.
 * Weight: 400 only.
 * CSS variable: `--font-fragment-mono`
 *
 * NOTE: Fragment Mono (the design-system primary) is not yet available on
 * Google Fonts. JetBrains Mono is used as the substitute per DESIGN.md.
 * The CSS variable is intentionally named `--font-fragment-mono` so that
 * when Fragment Mono becomes available, only this file needs updating.
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-fragment-mono',
  preload: false, // accent font — defer load; not on the critical path
});

// ─── Combined className helper ────────────────────────────────────────────────

/**
 * Returns a single space-joined string of all font CSS-variable class names.
 * Spread this onto your root `<html>` element so every CSS variable is
 * available globally across the entire application.
 *
 * @example
 * // app/layout.tsx
 * import { fontClassNames } from '@/styles/design_v2/subframe.fonts';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en" className={fontClassNames}>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 */
export const fontClassNames: string = [
  inter.variable,
  instrumentSerif.variable,
  jetbrainsMono.variable,
].join(' ');

// ─── Font metadata (for documentation / tooling) ──────────────────────────────

/**
 * Static metadata for each font in the system.
 * Useful for documentation pages, design-system UIs, or storybook tokens.
 */
export const fontMeta = {
  inter: {
    family: 'Inter',
    cssVar: '--font-inter',
    weights: [400, 500, 600, 700] as const,
    role: 'System UI sans — nav, body, button, subhead, section headings',
    substitute: null,
  },
  instrumentSerif: {
    family: 'Instrument Serif',
    cssVar: '--font-instrument-serif',
    weights: [400] as const,
    role: 'Display-only serif for hero and editorial moments',
    substitute: null,
  },
  fragmentMono: {
    family: 'Fragment Mono',
    cssVar: '--font-fragment-mono',
    weights: [400] as const,
    role: 'Accent mono for inline code, tag labels, technical callouts',
    substitute: 'JetBrains Mono',
  },
  uiMonospace: {
    family: 'ui-monospace',
    cssVar: '--font-ui-monospace',
    weights: [500] as const,
    role: 'Micro-labels, keyboard shortcuts, small technical annotations',
    substitute: 'SF Mono / Menlo (system fallback — no Google Font needed)',
  },
} as const;

// ─── Default export ───────────────────────────────────────────────────────────

const fonts = {
  inter,
  instrumentSerif,
  jetbrainsMono,
  fontClassNames,
  meta: fontMeta,
} as const;

export default fonts;


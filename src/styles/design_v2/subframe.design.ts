/**
 * subframe.design.ts
 * ─────────────────────────────────────────────────────────────────
 * Subframe — Design Tokens (v2)
 * Source of truth: DESIGN.md
 *
 * Import individual token groups or the default `tokens` object:
 *
 *   import tokens from './subframe.design';
 *   import { colors, spacing } from './subframe.design';
 * ─────────────────────────────────────────────────────────────────
 */

// ─── Colors ───────────────────────────────────────────────────────────────────

/**
 * The eight-step monochrome palette (Light Mode).
 * No chromatic accent — the entire interface lives between
 * #fafafa (warm off-white) and #171717 (ink black).
 */
export const colors = {
  /** Page background — warm off-white that carries the entire monochrome system. `--color-page-canvas` */
  pageCanvas: '#fafafa',

  /** Dividers, card borders, image frames, icon outlines — the most-used stroke. `--color-hairline-border` */
  hairlineBorder: '#e5e7eb',

  /** Elevated card backgrounds, secondary surface — one step above canvas. `--color-card-surface` */
  cardSurface: '#ededed',

  /** Mid-tone dividers and section transitions. `--color-divider-mid` */
  dividerMid: '#dadada',

  /** High-contrast neutral action fill for primary buttons on light surfaces. `--color-graphite` */
  graphite: '#242424',

  /** Primary body text, headings, icon strokes — slightly cooler than Graphite. `--color-ink-black` */
  inkBlack: '#171717',

  /** Secondary body text, descriptions, subhead copy. `--color-pencil` */
  pencil: '#5c5c5c',

  /** Muted helper text, tertiary metadata, inactive nav items. `--color-faint-graphite` */
  faintGraphite: '#a3a3a3',
} as const;

/**
 * Extrapolated dark mode palette maintaining the exact contrast ratios.
 */
export const darkColors = {
  pageCanvas: '#111111',       // Deepest dark (almost black)
  hairlineBorder: '#2b2b2b',   // Faint divider
  cardSurface: '#1a1a1a',      // Slightly elevated dark surface
  dividerMid: '#333333',       // Stronger divider
  graphite: '#ededed',         // Primary action fill (inverted)
  inkBlack: '#fafafa',         // Primary text
  pencil: '#a3a3a3',           // Secondary text
  faintGraphite: '#5c5c5c',    // Muted text
} as const;

export type ColorToken = keyof typeof colors;

// ─── Surfaces ─────────────────────────────────────────────────────────────────

/**
 * Three-level surface hierarchy (Light Mode).
 */
export const surfaces = {
  /** Level 1 — Base page background. `--surface-canvas` */
  canvas: '#fafafa',

  /** Level 2 — Grouped content, feature tiles, subtle containers. `--surface-card` */
  card: '#ededed',

  /**
   * Level 3 — Inverted surface for primary actions, active nav pills. `--surface-dark-surface`
   */
  darkSurface: '#242424',
} as const;

/**
 * Three-level surface hierarchy (Dark Mode).
 */
export const darkSurfaces = {
  canvas: '#111111',
  card: '#1a1a1a',
  darkSurface: '#ededed',
} as const;

// ─── Font Families ─────────────────────────────────────────────────────────────

/**
 * CSS font-family stacks.
 * Import `fonts` from `subframe.fonts.ts` for the Google Fonts @import URLs.
 */
export const fontFamilies = {
  /**
   * System UI sans — nav, body, button, subhead, section headings.
   * Weight 500 / 600 / 700. Heavy negative tracking. `--font-inter`
   */
  inter:
    "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif",

  /**
   * Display-only serif for hero and editorial moments.
   * Weight 400, -0.025em tracking. `--font-instrument-serif`
   */
  instrumentSerif:
    "'Instrument Serif', ui-serif, Georgia, Cambria, \"Times New Roman\", Times, serif",

  /**
   * Accent mono for inline code-like elements, tag labels, and technical callouts.
   * Weight 400. `--font-fragment-mono`
   */
  fragmentMono:
    "'Fragment Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",

  /**
   * Micro-labels, keyboard shortcuts, and small technical annotations.
   * System monospace fallback. `--font-ui-monospace`
   */
  uiMonospace:
    "'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;

// ─── Font Weights ─────────────────────────────────────────────────────────────

export const fontWeights = {
  /** 400 — Instrument Serif display only. Never used for Inter body text. */
  regular: 400,

  /** 500 — Inter body text, controls, nav links. Minimum weight for Inter. */
  medium: 500,

  /** 600 — Inter subheadings and nav emphasis. */
  semibold: 600,

  /** 700 — Inter section headlines and hero. */
  bold: 700,
} as const;

// ─── Type Scale ───────────────────────────────────────────────────────────────

/**
 * Each scale step bundles `fontSize`, `lineHeight`, and `letterSpacing`
 * so they always travel together — never mix values across steps.
 */
export const typeScale = {
  /** 12px / lh 1.0 / ls -0.06px   — `--text-caption` */
  caption: {
    fontSize: '12px',
    lineHeight: 1,
    letterSpacing: '-0.06px',
  },

  /** 14px / lh 1.43 / ls -0.07px  — `--text-body-sm` */
  bodySm: {
    fontSize: '14px',
    lineHeight: 1.43,
    letterSpacing: '-0.07px',
  },

  /** 18px / lh 1.33 / ls -0.45px  — `--text-body` */
  body: {
    fontSize: '18px',
    lineHeight: 1.33,
    letterSpacing: '-0.45px',
  },

  /** 24px / lh 1.17 / ls -0.6px   — `--text-subheading` */
  subheading: {
    fontSize: '24px',
    lineHeight: 1.17,
    letterSpacing: '-0.6px',
  },

  /** 28px / lh 1.14 / ls -0.7px   — `--text-heading-sm` */
  headingSm: {
    fontSize: '28px',
    lineHeight: 1.14,
    letterSpacing: '-0.7px',
  },

  /** 48px / lh 1.13 / ls -1.2px   — `--text-heading` */
  heading: {
    fontSize: '48px',
    lineHeight: 1.13,
    letterSpacing: '-1.2px',
  },

  /** 128px / lh 1.0 / ls -6.4px   — `--text-display` */
  display: {
    fontSize: '128px',
    lineHeight: 1,
    letterSpacing: '-6.4px',
  },
} as const;

export type TypeScaleStep = keyof typeof typeScale;

// ─── Spacing ──────────────────────────────────────────────────────────────────

/**
 * 8px base-unit scale — comfortable density.
 * All spacing in the system is a multiple of 8.
 */
export const spacing = {
  /** 8px   — `--spacing-8`   element gap, icon padding */
  s8: '8px',

  /** 16px  — `--spacing-16`  segment padding, tight stacks */
  s16: '16px',

  /** 24px  — `--spacing-24`  card padding, button horizontal padding */
  s24: '24px',

  /** 32px  — `--spacing-32`  heading-to-subhead gap */
  s32: '32px',

  /** 48px  — `--spacing-48`  section gap (min) */
  s48: '48px',

  /** 64px  — `--spacing-64`  section gap (default), logo strip column gap */
  s64: '64px',

  /** 96px  — `--spacing-96`  large section breathers */
  s96: '96px',

  /** 128px — `--spacing-128` page-top margin, display spacing */
  s128: '128px',

  /** 192px — `--spacing-192` large hero spacing */
  s192: '192px',
} as const;

// ─── Border Radii ─────────────────────────────────────────────────────────────

/**
 * Three-tier radius system.
 * No element goes below 12px — the system is deliberately soft.
 *
 * 16px → interactive controls
 * 24px → containers (cards, images, nav groups)
 * 9999px → pills (segmented controls, active nav states)
 */
export const radii = {
  /** 16px — Buttons and inputs. `--radius-buttons` / `--radius-2xl` */
  buttons: '16px',

  /** 24px — Card surfaces. `--radius-cards` / `--radius-3xl` */
  cards: '24px',

  /** 24px — Navigation containers. `--radius-nav` */
  nav: '24px',

  /** 24px — Image frames. `--radius-images` */
  images: '24px',

  /** 9999px — Segmented controls and pill nav. `--radius-pills` / `--radius-full` */
  pills: '9999px',
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

/**
 * Inset bevel — the only shadow in the system.
 * Applied exclusively to dark filled buttons and dark surfaces.
 * Drop shadows are NEVER used for elevation in this design system.
 */
export const shadows = {
  /**
   * Subtle glassy bevel on dark surfaces.
   * Top edge: white inset highlight.
   * Bottom edge: dark inset press.
   * `--shadow-sm`
   */
  sm: 'rgba(255, 255, 255, 0.25) 0px 4px 4px -2px inset, rgba(0, 0, 0, 0.25) 0px -4px 4px -2px inset, rgba(255, 255, 255, 0.1) -2px 0px 2px -2px inset, rgba(255, 255, 255, 0.1) -2px 0px 2px -2px inset',
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────

/** Page-level layout constants. */
export const layout = {
  /** Max-width container — centered on every section. `--page-max-width` */
  pageMaxWidth: '1200px',

  /** Vertical gap between full-width sections. `--section-gap` */
  sectionGap: '64px',

  /** Inner padding of all card-surface elements. `--card-padding` */
  cardPadding: '24px',

  /** Gap between tightly-coupled inline elements (icon + label etc.). `--element-gap` */
  elementGap: '8px',
} as const;

// ─── Default export — full token map ─────────────────────────────────────────

const tokens = {
  colors,
  surfaces,
  fontFamilies,
  fontWeights,
  typeScale,
  spacing,
  radii,
  shadows,
  layout,
} as const;

export type Tokens = typeof tokens;

export default tokens;

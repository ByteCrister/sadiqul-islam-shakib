/**
 * CNN Explorer — Design Token System
 * Single source of truth for all design variables.
 * Use these in Tailwind arbitrary values and inline styles.
 */

// ── Colour Palette ──────────────────────────────────────────────
export const colors = {
  primary:      '#49B6E5',
  secondary:    '#263D5B',
  success:      '#16A34A',
  warning:      '#D97706',
  danger:       '#DC2626',
  surface:      '#FFFFFF',

  bg:           '#FFF9F0',
  card:         '#FFFDF8',
  card2:        '#FFF5E6',
  accent:       '#49B6E5',   // alias for primary
  accent2:      '#263D5B',   // alias for secondary
  accent3:      '#C27803',
  accent3Light: '#FEF3C7',

  text:         '#111827',
  textDim:      '#4B5563',
  textMuted:    '#9CA3AF',

  border:       'rgba(73,182,229,0.5)',
  borderLight:  'rgba(0,0,0,0.10)',

  progressBg:   '#E8DDD0',
  drawCanvas:   '#1A1A2E',
} as const;

// ── Typography ───────────────────────────────────────────────────
export const fonts = {
  main:    "'Delius Swash Caps', cursive",
  display: "'Delius Swash Caps', cursive",
  mono:    "'JetBrains Mono', monospace",
} as const;

// ── Spacing & Shape ──────────────────────────────────────────────
export const radius = {
  full: '16px',
  md:   '10px',
  sm:   '6px',
} as const;

export const shadow = {
  base:  '4px 5px 0px rgba(38,61,91,0.18)',
  hover: '6px 8px 0px rgba(38,61,91,0.25)',
  card:  '3px 3px 0 rgba(38,61,91,0.12), 1px 1px 0 rgba(73,182,229,0.2)',
  btn: {
    primary:   '3px 3px 0 rgba(38,61,91,0.6)',
    secondary: '3px 3px 0 rgba(38,61,91,0.35)',
    danger:    '3px 3px 0 rgba(185,28,28,0.5)',
    success:   '3px 3px 0 rgba(21,128,61,0.5)',
  },
  kbd:   '2px 2px 0',
} as const;

// ── Gradient presets ─────────────────────────────────────────────
export const gradients = {
  headerTitle: `linear-gradient(125deg, ${colors.primary} 0%, ${colors.secondary} 45%, ${colors.accent3} 100%)`,
  archConv:  `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
  archPool:  `linear-gradient(135deg, ${colors.warning}, ${colors.accent3})`,
  archFlat:  `linear-gradient(135deg, ${colors.success}, #2DB873)`,
  archDense: `linear-gradient(135deg, #B91C1C, #E85D3A)`,
  archOut:   `linear-gradient(135deg, #6D28D9, #A855F7)`,
  progressBar: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
  sectionHeader: `linear-gradient(90deg, rgba(73,182,229,0.08), transparent 70%)`,
  sectionHeaderHover: `linear-gradient(90deg, rgba(73,182,229,0.15), transparent 70%)`,
  body: `radial-gradient(circle, rgba(73,182,229,0.18) 1px, transparent 1px), linear-gradient(180deg, #FFF9F0 0%, #FFF4E8 100%)`,
} as const;

// ── Tailwind class compositions ──────────────────────────────────
// These bundle frequently-repeated class patterns so UI code stays DRY.
export const tw = {
  // Buttons
  btnBase:
    'inline-flex items-center gap-1.5 px-[22px] py-[10px] rounded-[10px] border-[2.5px] border-transparent font-bold text-[0.92rem] tracking-[0.3px] cursor-pointer transition-all duration-150 relative select-none disabled:opacity-45 disabled:cursor-not-allowed',
  btnPrimary:
    'bg-[#263D5B] text-white border-[#263D5B] shadow-[3px_3px_0_rgba(38,61,91,0.6)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_rgba(38,61,91,0.6)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_rgba(38,61,91,0.6)]',
  btnSecondary:
    'bg-[#FFFDF8] text-[#263D5B] border-[#263D5B] shadow-[3px_3px_0_rgba(38,61,91,0.35)] hover:bg-[rgba(38,61,91,0.06)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_rgba(38,61,91,0.35)] active:translate-x-0.5 active:translate-y-0.5',
  btnDanger:
    'bg-[#DC2626] text-white border-[#DC2626] shadow-[3px_3px_0_rgba(185,28,28,0.5)] hover:bg-[#B91C1C] hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5',
  btnSuccess:
    'bg-[#16A34A] text-white border-[#16A34A] shadow-[3px_3px_0_rgba(21,128,61,0.5)] hover:bg-[#158A3D] hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5',
  btnSm:
    'px-[14px] py-[5px] text-[0.78rem] rounded-[6px] shadow-[2px_2px_0_rgba(38,61,91,0.35)]',

  // Cards
  card:
    'bg-[#FFFDF8] border-2 border-[rgba(0,0,0,0.10)] rounded-[10px] p-5 mb-[18px] shadow-[3px_3px_0_rgba(38,61,91,0.12),1px_1px_0_rgba(73,182,229,0.2)] transition-all duration-200 hover:shadow-[4px_4px_0_rgba(38,61,91,0.18)] hover:translate-y-[-1px]',
  cardTitle:
    'text-[0.88rem] font-mono text-[#C27803] mb-3 uppercase tracking-[0.8px] font-bold pb-2 border-b-2 border-dashed border-[rgba(194,120,3,0.25)]',

  // Control rows
  ctrlRow:    'flex items-center gap-3 flex-wrap mb-[14px]',
  ctrlLabel:  'font-mono text-[0.8rem] text-[#4B5563] min-w-[90px] font-semibold',
  ctrlVal:    'font-mono text-[0.82rem] text-[#C27803] min-w-[40px] font-bold bg-[#FEF3C7] px-[7px] py-px rounded-[6px] border border-[rgba(194,120,3,0.3)]',

  // Misc
  mono:       'font-mono',
  dim:        'text-[#4B5563]',
  small:      'text-[0.8rem]',
  heatmapLabel: 'text-center font-mono text-[0.68rem] text-[#4B5563] mt-1 font-medium',
} as const;
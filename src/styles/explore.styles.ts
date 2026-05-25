/**
 * src/styles/explore.styles.ts
 * Single source of truth for ALL visual design tokens and Tailwind class
 * strings used across the Neural Network Explorer.
 *
 * Design System: Doodle (typeui.sh)
 * Brand: playful, hand-drawn, sketch-like, handwritten fonts, imperfect lines
 * Fonts: display = Delius Swash Caps | mono = JetBrains Mono
 * Palette: primary=#49B6E5 | secondary=#263D5B | success=#16A34A
 *          warning=#D97706  | danger=#DC2626    | surface=#FFFFFF | text=#111827
 */

// ─── Raw Color Tokens ─────────────────────────────────────────────────────────
export const COLOR = {
    // Doodle brand palette
    primary: "#49B6E5",           // sky blue
    primaryDark: "#2A9FD0",       // hover/active
    secondary: "#263D5B",         // deep navy
    secondaryLight: "#3A5A82",    // hover
    success: "#16A34A",
    warning: "#D97706",
    danger: "#DC2626",
    surface: "#FFFFFF",
    text: "#111827",

    // Extended neutrals
    white: "#ffffff",
    gray50: "#f9fafb",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray300: "#d1d5db",
    gray400: "#9ca3af",
    gray500: "#6b7280",
    gray700: "#374151",

    // Sketch-tinted surface backgrounds (replaces indigo tints)
    sketchBg: "#F0F8FD",          // pale sky wash for page bg
    sketchCard: "#FAFCFF",        // card fill
    sketchBorder: "#B8DFF2",      // card / input border

    // Accent tints
    primaryTint: "#E0F4FC",       // light primary bg
    secondaryTint: "#E8EDF3",     // light secondary bg

    // Neuron colours (preserved — functionally meaningful)
    neuronInput: "#dbeafe",
    neuronHidden: "#fef9c3",
    neuronOutput: "#dcfce7",
    neuronActive: "#fbbf24",
    neuronBackward: "#fb923c",

    strokeInput: "#93c5fd",
    strokeHidden: "#fcd34d",
    strokeOutput: "#86efac",

    weightPosBase: "rgb(0,100,60)",
    weightNegBase: "rgb(150,0,40)",

    fwdBg: "#dbeafe",
    fwdText: "#1e40af",
    bwdBg: "#ffedd5",
    bwdText: "#9a3412",
    updBg: "#dcfce7",
    updText: "#14532d",

    chartLoss: "#DC2626",
    chartLossFill: "rgba(220,38,38,.1)",
    chartAcc: "#16A34A",
    chartAccFill: "rgba(22,163,74,.1)",

    svgLabelInput: "#1d4ed8",
    svgLabelHidden: "#78350f",
    svgLabelOutput: "#14532d",
    svgGrayLabel: "#6b7280",
    svgActiveVal: "#dc2626",
    svgDirFwd: "#49B6E5",
    svgDirBwd: "#D97706",
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const FONT = {
    display: "var(--font-display), 'Delius Swash Caps', cursive",
    mono: "var(--font-mono), 'JetBrains Mono', monospace",
} as const;

// ─── SVG / Layout Constants ───────────────────────────────────────────────────
export const SVG_CONST = {
    width: 640,
    heightFull: 360,
    heightCompact: 260,
    neuronR: 22,
    layerX: { input: 90, hidden: 320, output: 560 },
} as const;

// ─── Tailwind Class Strings ───────────────────────────────────────────────────
// Doodle aesthetic cues:
//   • rounded-2xl / rounded-3xl instead of rounded-xl for softer cards
//   • border-2 dashed or border-2 solid for sketch-border feel
//   • shadow replaced with drop-shadow that feels hand-stamped
//   • primary buttons use #49B6E5 sky; secondary uses #263D5B navy
//   • focus rings use primary color
export const S = {
    // ── Page shell ──────────────────────────────────────────────────────────
    pageRoot: "min-h-screen bg-[#F0F8FD]",
    appShell: "flex overflow-hidden",
    appShellHeight: "h-[calc(100vh-64px)]",
    sidebar:
        "w-72 min-w-[17rem] bg-white/80 backdrop-blur border-r-2 border-dashed border-[#B8DFF2] overflow-y-auto p-4 flex flex-col gap-4",
    mainArea: "flex-1 overflow-y-auto flex flex-col",
    tabContent: "flex-1 p-4",

    // ── Header ───────────────────────────────────────────────────────────────
    header:
        "bg-[#263D5B] text-white px-6 py-3 flex items-center gap-4 shadow-lg sticky top-0 z-50 border-b-4 border-[#49B6E5]",
    headerTitle: "text-xl font-black tracking-wide uppercase",
    headerSubtitle: "text-xs text-[#B8DFF2]",
    headerBadges: "flex gap-2 flex-wrap",

    // ── Badges ───────────────────────────────────────────────────────────────
    badgeBlue:
        "bg-[#49B6E5] text-[#263D5B] text-xs font-bold px-2 py-1 rounded-full border border-[#2A9FD0]",
    badgeRed:
        "bg-[#DC2626] text-white text-xs font-bold px-2 py-1 rounded-full",
    badgeGreen:
        "bg-[#16A34A] text-white text-xs font-bold px-2 py-1 rounded-full",

    // ── Cards ────────────────────────────────────────────────────────────────
    card:
        "bg-white/95 border-2 border-[#B8DFF2] shadow-[3px_3px_0px_#49B6E5] p-4 rounded-2xl",
    cardTitle:
        "text-xs font-black uppercase tracking-widest text-[#263D5B] mb-3",
    cardHead: "flex items-center justify-between mb-2",
    cardHeadTitle: "font-bold text-[#263D5B] text-sm",
    cardHeadHint: "text-[10px] text-[#9ca3af]",

    // ── Tab bar ──────────────────────────────────────────────────────────────
    tabBar: "flex gap-1 px-4 pt-4 pb-0 sticky top-0 z-10",
    tabActive:
        "px-4 py-2 rounded-t-2xl text-sm bg-[#49B6E5] text-[#263D5B] shadow font-bold border-2 border-[#2A9FD0] border-b-0 transition-all",
    tabInactive:
        "px-4 py-2 rounded-t-2xl text-sm text-[#263D5B] hover:bg-[#E0F4FC] font-semibold border-2 border-transparent hover:border-[#B8DFF2] transition-all",

    // ── Form controls ────────────────────────────────────────────────────────
    label:
        "text-xs font-bold text-[#263D5B] uppercase tracking-wide mb-1 block",
    input:
        "w-full border-2 border-[#B8DFF2] rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#49B6E5]/60 bg-white text-[#111827]",
    select:
        "w-full border-2 border-[#B8DFF2] rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#49B6E5]/60 bg-white text-[#111827]",
    rangeAccent: "w-full accent-[#49B6E5]",
    ctrl: "flex flex-col gap-1",

    // ── Buttons ──────────────────────────────────────────────────────────────
    btnPrimary:
        "bg-[#49B6E5] hover:bg-[#2A9FD0] text-[#263D5B] font-bold px-4 py-2 rounded-xl text-sm border-2 border-[#2A9FD0] shadow-[2px_2px_0px_#263D5B] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
    btnOutline:
        "border-2 border-[#263D5B] text-[#263D5B] hover:bg-[#E8EDF3] font-semibold px-4 py-2 rounded-xl text-sm shadow-[2px_2px_0px_#49B6E5] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95",
    btnDanger:
        "border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] font-semibold px-4 py-2 rounded-xl text-sm shadow-[2px_2px_0px_#FCA5A5] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95",
    btnRow: "flex gap-2",

    // ── Progress ─────────────────────────────────────────────────────────────
    progressTrack:
        "h-2.5 bg-[#E0F4FC] rounded-full overflow-hidden border border-[#B8DFF2]",
    progressFill:
        "h-full bg-[#49B6E5] transition-all duration-100 rounded-full",

    // ── Metrics ──────────────────────────────────────────────────────────────
    metricsRow: "flex justify-between text-xs",
    metricsLabel: "text-[#9ca3af]",
    metricsLoss: "text-[#DC2626] font-bold",
    metricsAcc: "text-[#16A34A] font-bold",
    metricsEpoch: "text-xs text-[#263D5B]",
    metricsPre:
        "text-[10px] bg-[#F0F8FD] rounded-xl p-3 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed text-[#374151] border-2 border-dashed border-[#B8DFF2]",

    // ── Dataset selector ─────────────────────────────────────────────────────
    datasetActive:
        "flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-sm border-2 bg-[#49B6E5] text-[#263D5B] border-[#2A9FD0] font-bold shadow-[2px_2px_0px_#263D5B] transition-all",
    datasetInactive:
        "flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-sm border-2 border-[#B8DFF2] hover:bg-[#E0F4FC] text-[#263D5B] transition-all",

    // ── Legend ───────────────────────────────────────────────────────────────
    legendRow: "flex gap-3 mt-2 text-[10px] flex-wrap items-center",
    legendDotInput:
        "w-3 h-3 rounded-full bg-[#dbeafe] border border-[#93c5fd] inline-block",
    legendDotHidden:
        "w-3 h-3 rounded-full bg-[#fef9c3] border border-[#fcd34d] inline-block",
    legendDotOutput:
        "w-3 h-3 rounded-full bg-[#dcfce7] border border-[#86efac] inline-block",
    legendPos: "text-[#16A34A] font-bold",
    legendNeg: "text-[#DC2626] font-bold",

    // ── Grids ────────────────────────────────────────────────────────────────
    gridNetwork: "grid grid-cols-1 xl:grid-cols-2 gap-4",
    gridStep: "grid grid-cols-1 xl:grid-cols-[300px,1fr] gap-4",
    gridCharts: "grid grid-cols-1 xl:grid-cols-2 gap-4",
    gridConcepts: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3",
    rightCol: "flex flex-col gap-4",
    stepOutputArea: "flex flex-col gap-4",

    // ── Step-by-step ─────────────────────────────────────────────────────────
    stepIntro: "text-xs text-[#6b7280]",
    stepHint:
        "text-xs text-[#263D5B] font-semibold bg-[#E0F4FC] px-3 py-2 rounded-xl border-2 border-dashed border-[#49B6E5]",
    stepHintDone:
        "text-xs text-[#16A34A] font-semibold bg-[#f0fdf4] px-3 py-2 rounded-xl border-2 border-dashed border-[#16A34A]",
    stepPlaceholder:
        "flex flex-col items-center justify-center h-40 text-[#9ca3af] text-sm gap-2",
    stepPlaceholderIcon: "text-4xl",
    stepContent:
        "text-[10px] bg-[#F0F8FD] rounded-xl p-4 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto border-2 border-dashed border-[#B8DFF2]",
    stepCounter:
        "text-[10px] bg-[#49B6E5] text-[#263D5B] px-2 py-0.5 rounded-full font-bold",
    stepFlowHeader: "flex items-center justify-between mb-2",

    // Progress dots
    dotsRow: "flex gap-1 flex-wrap",
    dotBase: "w-3 h-3 rounded-sm transition-all",
    dotPending: "bg-[#e5e7eb]",
    dotFwdDone: "bg-[#49B6E5]",
    dotBwdDone: "bg-[#D97706]",
    dotUpdDone: "bg-[#4ade80]",
    dotFwdActive: "bg-[#E0F4FC] ring-2 ring-[#49B6E5]",
    dotBwdActive: "bg-[#ffedd5] ring-2 ring-[#D97706]",
    dotUpdActive: "bg-[#dcfce7] ring-2 ring-[#22c55e]",

    // Phase badges
    phaseRow: "flex gap-2 flex-wrap",
    phaseFwd:
        "bg-[#E0F4FC] text-[#1e40af] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#49B6E5]",
    phaseBwd:
        "bg-[#ffedd5] text-[#9a3412] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D97706]",
    phaseUpd:
        "bg-[#dcfce7] text-[#14532d] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#16A34A]",

    inlinePhaseFwd:
        "inline-block bg-[#E0F4FC] text-[#1e40af] font-bold px-2 py-0.5 rounded mb-2 text-[10px] uppercase tracking-wide border border-[#49B6E5]",
    inlinePhaseBwd:
        "inline-block bg-[#ffedd5] text-[#9a3412] font-bold px-2 py-0.5 rounded mb-2 text-[10px] uppercase tracking-wide border border-[#D97706]",
    inlinePhaseUpd:
        "inline-block bg-[#dcfce7] text-[#14532d] font-bold px-2 py-0.5 rounded mb-2 text-[10px] uppercase tracking-wide border border-[#16A34A]",
    inlineFormula: "text-[#263D5B] font-bold",
    inlineHighlight: "bg-[#fef9c3] text-[#78350f] font-bold px-1 rounded",
    inlineResult: "bg-[#dcfce7] text-[#14532d] font-bold px-1 rounded",
    inlineGrad: "bg-[#fee2e2] text-[#991b1b] font-bold px-1 rounded",

    // ── Concepts ─────────────────────────────────────────────────────────────
    conceptCard:
        "rounded-2xl border-2 transition-all cursor-pointer hover:shadow-[3px_3px_0px_#49B6E5]",
    conceptHead: "flex items-center justify-between px-4 py-3",
    conceptTerm: "font-bold text-sm text-[#111827]",
    conceptToggle: "text-[#9ca3af] text-xs",
    conceptBody:
        "px-4 pb-3 text-xs text-[#374151] flex flex-col gap-2",
    conceptFormula:
        "bg-white/80 rounded-xl px-3 py-1.5 text-[10px] text-[#6b7280] border-2 border-dashed border-[#B8DFF2]",

    conceptCat: {
        basics: "border-[#49B6E5] bg-[#E0F4FC]",
        activation: "border-[#263D5B] bg-[#E8EDF3]",
        loss: "border-[#fca5a5] bg-[#fff1f2]",
        prop: "border-[#fcd34d] bg-[#fffbeb]",
        optim: "border-[#86efac] bg-[#f0fdf4]",
    } as Record<string, string>,
} as const;

// ─── Inline Style Objects ─────────────────────────────────────────────────────
export const STYLE = {
    fontDisplay: { fontFamily: FONT.display },
    fontMono: { fontFamily: FONT.mono },
    pageRoot: {
        fontFamily: FONT.mono,
        backgroundColor: COLOR.sketchBg,
    },
    scrollbarThin: {
        scrollbarWidth: "thin" as const,
        scrollbarColor: `${COLOR.primary} transparent`,
    },
} as const;

// ─── Chart.js shared options factory ─────────────────────────────────────────
export const chartBaseOptions = {
    responsive: true,
    animation: false as const,
    plugins: { legend: { display: false } },
    scales: {
        x: {
            ticks: {
                maxTicksLimit: 8,
                font: { size: 9, family: "'JetBrains Mono', monospace" },
            },
            title: {
                font: { family: "'JetBrains Mono', monospace", size: 10 },
            },
        },
        y: {
            ticks: { font: { size: 9, family: "'JetBrains Mono', monospace" } },
            title: {
                font: { family: "'JetBrains Mono', monospace", size: 10 },
            },
        },
    },
};

// ─── SVG Weight Color Helper ──────────────────────────────────────────────────
export function weightColor(w: number): string {
    const i = Math.min(1, Math.abs(w) / 2);
    return w > 0
        ? `rgb(0,${Math.round(100 + 100 * i)},60)`
        : `rgb(${Math.round(150 + 100 * i)},0,40)`;
}

// ─── Step HTML token replacer ─────────────────────────────────────────────────
export function applyStepStyles(raw: string): string {
    return raw
        .replace(/class="phase-banner fwd"/g, `class="${S.inlinePhaseFwd}"`)
        .replace(/class="phase-banner bwd"/g, `class="${S.inlinePhaseBwd}"`)
        .replace(/class="phase-banner upd"/g, `class="${S.inlinePhaseUpd}"`)
        .replace(/class="formula"/g, `class="${S.inlineFormula}"`)
        .replace(/class="highlight"/g, `class="${S.inlineHighlight}"`)
        .replace(/class="result"/g, `class="${S.inlineResult}"`)
        .replace(/class="grad"/g, `class="${S.inlineGrad}"`);
}
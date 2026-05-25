'use client';

/**
 * CNN Explorer — Reusable UI Primitives
 * All styling via Tailwind arbitrary values.
 * Design variables imported from lib/tokens.ts.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { drawHeatmap } from '@/utils/helper/cnn-architect.utils';
import { colors, tw } from '@/styles/cnn-architect.styles';

// ── Button ────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'danger' | 'success';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?:    'sm' | 'md';
}

const variantClass: Record<BtnVariant, string> = {
  primary:   tw.btnPrimary,
  secondary: tw.btnSecondary,
  danger:    tw.btnDanger,
  success:   tw.btnSuccess,
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...rest }, ref) => (
    <button
      ref={ref}
      style={{ fontFamily: "'Delius Swash Caps', cursive" }}
      className={[
        tw.btnBase,
        variantClass[variant],
        size === 'sm' ? tw.btnSm : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
);
Button.displayName = 'Button';

// ── Card ──────────────────────────────────────────────────────────
interface CardProps {
  title?:     React.ReactNode;
  tip?:       string;
  className?: string;
  children:   React.ReactNode;
  style?:     React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ title, tip, className = '', children, style }) => (
  <div
    className={[tw.card, className].join(' ')}
    style={{ transform: 'rotate(-0.1deg)', ...style }}
  >
    {title && (
      <div
        className={tw.cardTitle}
        title={tip}
        style={{ cursor: tip ? 'help' : undefined }}
      >
        {title}
      </div>
    )}
    {children}
  </div>
);

// ── Kbd ───────────────────────────────────────────────────────────
export const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd
    style={{
      background:   colors.card,
      border:       `2px solid ${colors.secondary}`,
      borderRadius: '6px',
      padding:      '3px 9px',
      fontSize:     '0.74rem',
      color:        colors.secondary,
      fontWeight:   700,
      boxShadow:    `2px 2px 0 ${colors.secondary}`,
      display:      'inline-block',
      transition:   'box-shadow 0.15s, transform 0.15s',
      fontFamily:   "'JetBrains Mono', monospace",
    }}
  >
    {children}
  </kbd>
);

// ── Badge ─────────────────────────────────────────────────────────
type BadgeVariant = 'idle' | 'running' | 'paused' | 'done';

const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  idle: {
    background:  'rgba(90,98,112,0.1)',
    color:       colors.textDim,
    borderColor: 'rgba(90,98,112,0.2)',
  },
  running: {
    background:  'rgba(73,182,229,0.12)',
    color:       '#1A7DA8',
    borderColor: 'rgba(73,182,229,0.35)',
  },
  paused: {
    background:  'rgba(217,119,6,0.1)',
    color:       colors.warning,
    borderColor: 'rgba(217,119,6,0.3)',
  },
  done: {
    background:  'rgba(22,163,74,0.1)',
    color:       colors.success,
    borderColor: 'rgba(22,163,74,0.3)',
  },
};

export const Badge: React.FC<{ variant: BadgeVariant; label: string }> = ({
  variant,
  label,
}) => (
  <span
    className="inline-flex items-center gap-1.5 px-3.5 py-1.25 rounded-full border-2 font-mono text-[0.76rem] font-bold"
    style={badgeStyles[variant]}
  >
    <span
      className="w-2 h-2 rounded-full"
      style={{
        background: 'currentColor',
        animation:  variant === 'running' ? 'pulse 1s infinite' : 'none',
      }}
    />
    {label}
  </span>
);

// ── CtrlRow ───────────────────────────────────────────────────────
export const CtrlRow: React.FC<{
  label:    string;
  tip?:     string;
  children: React.ReactNode;
}> = ({ label, tip, children }) => (
  <div className={tw.ctrlRow}>
    <span className={tw.ctrlLabel} title={tip} style={{ cursor: tip ? 'help' : undefined }}>
      {label}
    </span>
    {children}
  </div>
);

// ── CtrlVal ───────────────────────────────────────────────────────
export const CtrlVal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className={tw.ctrlVal}>{children}</span>
);

// ── ProgressBar ───────────────────────────────────────────────────
export const ProgressBar: React.FC<{
  value:   number;  // 0–100
  label?:  string;
}> = ({ value, label }) => (
  <div className="mb-1">
    {label && (
      <div
        className="text-[0.76rem] font-mono mb-1"
        style={{ color: colors.textDim }}
      >
        {label}
      </div>
    )}
    <div
      style={{
        background:   colors.progressBg,
        borderRadius: '6px',
        height:       '12px',
        overflow:     'hidden',
        border:       `2px solid ${colors.secondary}`,
        margin:       '4px 0 8px',
        boxShadow:    `2px 2px 0 rgba(38,61,91,0.2)`,
      }}
    >
      <motion.div
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.3 }}
        style={{
          height:          '100%',
          borderRadius:    '4px',
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 16px), linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
        }}
      />
    </div>
  </div>
);

// ── Accordion Section ─────────────────────────────────────────────
export const AccordionSection: React.FC<{
  id:       string;
  num:      number;
  title:    React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ id, num, title, children, defaultOpen = true }) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        background:    colors.card,
        border:        `2.5px solid ${colors.secondary}`,
        borderRadius:  '16px',
        marginBottom:  '24px',
        boxShadow:     open ? '6px 8px 0px rgba(38,61,91,0.25)' : '4px 5px 0px rgba(38,61,91,0.18)',
        overflow:      'hidden',
        transform:     'rotate(-0.3deg)',
        position:      'relative',
        transition:    'box-shadow 0.2s, transform 0.2s',
      }}
      whileHover={{ rotate: 0, y: -2, boxShadow: '6px 8px 0px rgba(38,61,91,0.25)' }}
    >
      {/* Corner fold decoration */}
      <div
        style={{
          position:           'absolute',
          top:                0,
          right:              0,
          width:              '20px',
          height:             '20px',
          background:         `linear-gradient(225deg, ${colors.bg} 50%, rgba(73,182,229,0.15) 50%)`,
          borderBottomLeftRadius: '6px',
          pointerEvents:      'none',
          zIndex:             1,
        }}
      />

      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3.5 w-full text-left px-6.5 py-4.5 cursor-pointer select-none"
        style={{
          background:     open
            ? 'linear-gradient(90deg, rgba(73,182,229,0.15), transparent 70%)'
            : 'linear-gradient(90deg, rgba(73,182,229,0.08), transparent 70%)',
          borderBottom:   open ? `2.5px dashed rgba(38,61,91,0.25)` : '2.5px dashed transparent',
          transition:     'background 0.2s, border-color 0.2s',
          fontFamily:     "'Delius Swash Caps', cursive",
        }}
      >
        {/* Number badge */}
        <span
          className="flex items-center justify-center w-8 h-8 rounded-full text-white text-[0.84rem] font-bold shrink-0"
          style={{
            background: colors.secondary,
            boxShadow:  '2px 2px 0 rgba(38,61,91,0.4)',
            border:     `2px solid ${colors.secondary}`,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {num}
        </span>

        {/* Title */}
        <span
          className="text-[1.1rem] font-bold flex-1 tracking-[0.3px]"
          style={{ color: colors.secondary, fontFamily: "'Delius Swash Caps', cursive" }}
        >
          {title}
        </span>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-bold"
          style={{ color: colors.accent3, fontFamily: "'JetBrains Mono', monospace" }}
        >
          ▾
        </motion.span>
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6.5 py-5.5 pb-7">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── HeatmapCanvas ─────────────────────────────────────────────────
export const HeatmapCanvas: React.FC<{
  data:   number[][];
  width:  number;
  height: number;
  label?: string;
}> = ({ data, width, height, label }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!ref.current || !data.length) return;
    drawHeatmap(ref.current, data, { w: width, h: height });
  }, [data, width, height]);

  return (
    <div className="inline-block">
      <canvas
        ref={ref}
        width={width}
        height={height}
        style={{ display: 'block', borderRadius: '4px' }}
      />
      {label && <div className={tw.heatmapLabel}>{label}</div>}
    </div>
  );
};

// ── Select ────────────────────────────────────────────────────────
export const Select: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }
> = ({ options, ...rest }) => (
  <select
    style={{
      background:   colors.card,
      color:        colors.text,
      border:       `2px solid ${colors.secondary}`,
      borderRadius: '6px',
      padding:      '6px 12px',
      fontFamily:   "'JetBrains Mono', monospace",
      fontSize:     '0.82rem',
      outline:      'none',
      cursor:       'pointer',
      boxShadow:    `2px 2px 0 rgba(38,61,91,0.25)`,
    }}
    {...rest}
  >
    {options.map(o => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);
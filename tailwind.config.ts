import { type Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    theme: {
        extend: {
            // ── Font Families (CSS variables injected by subframe.fonts.ts) ──────
            fontFamily: {
                sans:  ['var(--font-inter)',              'ui-sans-serif', 'system-ui', 'sans-serif'],
                serif: ['var(--font-instrument-serif)',   'ui-serif', 'Georgia', 'serif'],
                mono:  ['var(--font-fragment-mono)',      'ui-monospace', 'monospace'],
            },

            // ── Color Tokens ──────────────────────────────────────────────────────
            colors: {
                // Semantic Subframe palette — each maps to a CSS variable so
                // light/dark automatically resolves via :root / .dark in globals.css
                canvas:  'var(--canvas)',
                hairline:'var(--hairline)',
                'card-surface': 'var(--card-surface)',
                divider: 'var(--divider)',
                graphite:'var(--graphite)',
                ink:     'var(--ink)',
                pencil:  'var(--pencil)',
                faint:   'var(--faint)',

                // Keep `background` / `foreground` aliases so radix/shadcn components work
                background: 'var(--canvas)',
                foreground: 'var(--ink)',
                border:     'var(--hairline)',
                ring:       'var(--ink)',
                primary: {
                    DEFAULT:    'var(--graphite)',
                    foreground: 'var(--canvas)',
                },
                secondary: {
                    DEFAULT:    'var(--card-surface)',
                    foreground: 'var(--ink)',
                },
                muted: {
                    DEFAULT:    'var(--card-surface)',
                    foreground: 'var(--pencil)',
                },
                accent: {
                    DEFAULT:    'var(--card-surface)',
                    foreground: 'var(--ink)',
                },
                card: {
                    DEFAULT:    'var(--card-surface)',
                    foreground: 'var(--ink)',
                },
                popover: {
                    DEFAULT:    'var(--canvas)',
                    foreground: 'var(--ink)',
                },
                input: 'var(--hairline)',
                destructive: 'oklch(0.577 0.245 27.325)',
            },

            // ── Border Radii ──────────────────────────────────────────────────────
            borderRadius: {
                // Subframe three-tier radius system
                buttons: '16px',
                cards:   '24px',
                nav:     '24px',
                images:  '24px',
                pills:   '9999px',
                // Map standard TW names so existing rounded-* classes get the right values
                sm:      '16px',
                md:      '16px',
                lg:      '24px',
                xl:      '24px',
                '2xl':   '24px',
                full:    '9999px',
            },

            // ── Spacing ───────────────────────────────────────────────────────────
            spacing: {
                // Subframe 8px base-unit scale
                '8':   '8px',
                '16':  '16px',
                '24':  '24px',
                '32':  '32px',
                '48':  '48px',
                '64':  '64px',
                '96':  '96px',
                '128': '128px',
                '192': '192px',
            },

            // ── Box Shadows ───────────────────────────────────────────────────────
            boxShadow: {
                // The only shadow in the system — inset glassy bevel on dark surfaces
                sm:  'var(--shadow-subframe)',
                md:  'var(--shadow-subframe)',
                // Utility for card borders (no shadow, use border instead)
                none: 'none',
            },

            // ── Max Widths ────────────────────────────────────────────────────────
            maxWidth: {
                page: '1200px',
            },

            // ── Letter Spacings ───────────────────────────────────────────────────
            letterSpacing: {
                caption:    '-0.06px',
                'body-sm':  '-0.07px',
                body:       '-0.45px',
                subheading: '-0.6px',
                'heading-sm': '-0.7px',
                heading:    '-1.2px',
                display:    '-6.4px',
                tight:      '-0.025em',
                tighter:    '-0.05em',
            },

            // ── Line Heights ──────────────────────────────────────────────────────
            lineHeight: {
                caption:    '1',
                'body-sm':  '1.43',
                body:       '1.33',
                subheading: '1.17',
                'heading-sm': '1.14',
                heading:    '1.13',
                display:    '1',
            },

            // ── Screens ───────────────────────────────────────────────────────────
            screens: {
                '2xl': '1600px',
            },
        },
    },
    plugins: [],
};

export default config;
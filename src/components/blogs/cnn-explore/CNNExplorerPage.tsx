'use client';

/**
 * CNN Explorer — Main Page
 * Next.js 16+ App Router page component.
 * Composes all sections; all styling via Tailwind + inline tokens.
 * No global.css required — fonts loaded via next/font.
 */

import { useState } from 'react';
import { LoaderOverlay } from './LoaderOverlay';
import { colors } from '@/styles/cnn-architect.styles';
import { SiteHeader } from './SiteHeader';
import Section1CNNBasics from './Section1CNNBasics';
import Section2Architecture from './Section2Architecture';
import Section3Dataset from './Section3Dataset';
import Section4Training from './Section4Training';
import Section5Prediction from './Section5Prediction';
import Section6Walkthrough from './Section6Walkthrough';

// ── Page ──────────────────────────────────────────────────────────
export default function CNNExplorerPage() {
    // The loader is purely cosmetic here (sections render client-side)
    const [loading] = useState(false);

    return (
        <>
            {/* Loader */}
            <LoaderOverlay visible={loading} message="Initialising CNN Explorer…" />

            {/* App shell */}
            <div
                style={{
                    minHeight: '100vh',
                    background: colors.bg,
                    color: colors.text,
                    /* Notebook dot-grid + warm paper tint */
                    backgroundImage: [
                        'radial-gradient(circle, rgba(73,182,229,0.18) 1px, transparent 1px)',
                        'linear-gradient(180deg, #FFF9F0 0%, #FFF4E8 100%)',
                    ].join(', '),
                    backgroundSize: '28px 28px, 100% 100%',
                }}
            >
                <div
                    style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        padding: 'clamp(10px,2vw,16px) clamp(14px,3vw,20px) 80px',
                    }}
                >
                    <SiteHeader />
                    <Section1CNNBasics />
                    <Section2Architecture />
                    <Section3Dataset />
                    <Section4Training />
                    <Section5Prediction />
                    <Section6Walkthrough />
                </div>
            </div>
        </>
    );
}
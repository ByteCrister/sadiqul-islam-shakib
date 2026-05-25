'use client';

/**
 * Section 6 — Step-by-Step Computation Walkthrough
 * Traces exact numeric computations through each CNN stage.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccordionSection, Card, Button } from '@/components/ui/explore';
import { colors, fonts } from '@/styles/cnn-architect.styles';
import { softmax, heatColor } from '@/utils/helper/cnn-architect.utils';

// ── Types ─────────────────────────────────────────────────────────
interface WalkthroughStep {
    title: string;
    shape: string;
    color: string;
    content: React.ReactNode;
}

// ── Helper components ─────────────────────────────────────────────
const FormulaBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
        style={{
            background: '#FFFBEB',
            border: '2px solid rgba(194,120,3,0.3)',
            borderLeft: `5px solid ${colors.accent3}`,
            borderRadius: '10px',
            padding: '14px 18px',
            fontFamily: fonts.mono,
            fontSize: '0.82rem',
            color: '#5C3D02',
            margin: '12px 0',
            lineHeight: 1.8,
            boxShadow: '3px 3px 0 rgba(194,120,3,0.15)',
        }}
        dangerouslySetInnerHTML={{ __html: typeof children === 'string' ? children : '' }}
    />
);

const TraceTable: React.FC<{ rows: [string, string, string][] }> = ({ rows }) => (
    <div
        style={{
            background: colors.card2,
            border: '2px solid rgba(0,0,0,0.1)',
            borderRadius: '10px',
            padding: '14px',
            marginTop: '12px',
            maxHeight: '270px',
            overflowY: 'auto',
            fontFamily: fonts.mono,
            fontSize: '0.74rem',
        }}
    >
        {rows.map(([idx, expr, val], i) => (
            <div
                key={i}
                className="flex items-baseline gap-2 py-1"
                style={{ borderBottom: i < rows.length - 1 ? '1.5px dashed rgba(0,0,0,0.06)' : 'none' }}
            >
                <span style={{ color: colors.textDim, minWidth: '44px', fontWeight: 500 }}>{idx}</span>
                <span style={{ color: colors.text, flex: 1 }}>{expr}</span>
                <span style={{ color: colors.accent3, minWidth: '64px', textAlign: 'right', fontWeight: 700 }}>{val}</span>
            </div>
        ))}
    </div>
);

const StatChips: React.FC<{ chips: [string, string][] }> = ({ chips }) => (
    <div className="flex flex-wrap gap-2 mt-3">
        {chips.map(([label, val]) => (
            <div
                key={label}
                style={{
                    background: colors.card,
                    border: '2px solid rgba(0,0,0,0.1)',
                    borderRadius: '10px',
                    padding: '7px 14px',
                    fontFamily: fonts.mono,
                    fontSize: '0.75rem',
                    boxShadow: '2px 2px 0 rgba(38,61,91,0.1)',
                }}
            >
                <span style={{ color: colors.textDim, fontSize: '0.68rem', display: 'block', fontWeight: 600 }}>{label}</span>
                <span style={{ color: colors.accent3, fontWeight: 700 }}>{val}</span>
            </div>
        ))}
    </div>
);

// ── Walkthrough step builder ─────────────────────────────────────
function buildWalkthrough(): WalkthroughStep[] {
    // Random 4×4 input
    const input4 = Array.from({ length: 4 }, () =>
        Array.from({ length: 4 }, () => Math.round(Math.random() * 9))
    );

    // 3×3 kernel
    const kernel3 = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];
    const bias = parseFloat((Math.random() * 0.5).toFixed(3));

    // ─ Step 1: Input ─
    const step1: WalkthroughStep = {
        title: '🖼️ Raw Input Pixel Values',
        shape: '4×4',
        color: '#263D5B',
        content: (
            <>
                <FormulaBox>{`<b>Input:</b> A 4×4 patch of pixel values (0–9 in this demo; 0–255 → 0–1 in real MNIST)\n<span style="color:#4B5563;font-size:0.74rem;display:block;margin-top:6px;">Each value represents brightness. 0 = dark, 9 = bright.</span>`}</FormulaBox>
                <div style={{ display: 'inline-grid', gap: '3px', gridTemplateColumns: 'repeat(4, 36px)', border: '2px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '8px', background: colors.card }}>
                    {input4.flat().map((v, i) => {
                        const t = v / 9;
                        const [r, g, b] = heatColor(t);
                        return (
                            <div key={i} style={{ width: 36, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.mono, fontSize: '0.72rem', borderRadius: '4px', background: `rgb(${r},${g},${b})`, color: v > 5 ? '#111' : '#eee', fontWeight: 600 }}>{v}</div>
                        );
                    })}
                </div>
                <StatChips chips={[['Size', '4×4'], ['Min', String(Math.min(...input4.flat()))], ['Max', String(Math.max(...input4.flat()))]]} />
            </>
        ),
    };

    // ─ Step 2: Convolution ─
    const convOut: number[][] = [];
    const traceRows: [string, string, string][] = [];
    for (let r = 0; r < 2; r++) {
        const row: number[] = [];
        for (let c = 0; c < 2; c++) {
            let sum = bias;
            let expr = `${bias.toFixed(3)} (bias)`;
            for (let kr = 0; kr < 3; kr++) {
                for (let kc = 0; kc < 3; kc++) {
                    const inp = input4[r + kr]?.[c + kc] ?? 0;
                    const k = kernel3[kr][kc];
                    sum += inp * k;
                    expr += ` + ${inp}×${k}`;
                }
            }
            row.push(parseFloat(sum.toFixed(3)));
            traceRows.push([`[${r},${c}]`, expr, sum.toFixed(3)]);
        }
        convOut.push(row);
    }

    const step2: WalkthroughStep = {
        title: '🔲 Convolution: Σ (input × kernel)',
        shape: '2×2 output',
        color: '#49B6E5',
        content: (
            <>
                <FormulaBox>{`<b>Formula:</b>  output[r,c] = bias + Σ<sub>kr,kc</sub> input[r+kr, c+kc] × kernel[kr,kc]\n<span style="color:#4B5563;font-size:0.74rem;display:block;margin-top:6px;">Kernel slides over the input with stride=1. No padding. Output size = (4-3)/1+1 = 2×2.</span>`}</FormulaBox>
                <TraceTable rows={traceRows} />
                <StatChips chips={[['Output size', '2×2'], ['Kernel', '3×3'], ['Bias', String(bias)]]} />
            </>
        ),
    };

    // ─ Step 3: ReLU ─
    const reluOut = convOut.map(row => row.map(v => Math.max(0, v)));
    const step3: WalkthroughStep = {
        title: '⚡ ReLU Activation',
        shape: '2×2',
        color: '#16A34A',
        content: (
            <>
                <FormulaBox>{`<b>ReLU:</b>  f(x) = max(0, x)\n<span style="color:#4B5563;font-size:0.74rem;display:block;margin-top:6px;">All negative values become 0. Positive values pass unchanged. Introduces non-linearity.</span>`}</FormulaBox>
                <TraceTable rows={convOut.flat().map((v, i) => [`[${Math.floor(i / 2)},${i % 2}]`, `max(0, ${v.toFixed(3)})`, reluOut.flat()[i].toFixed(3)] as [string, string, string])} />
                <StatChips chips={[['Zeros', String(reluOut.flat().filter(v => v === 0).length)], ['Active', String(reluOut.flat().filter(v => v > 0).length)]]} />
            </>
        ),
    };

    // ─ Step 4: MaxPool ─
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pooled = [[reluOut.flat()[0]]]; // Only 2×2 → 1×1 for demo
    const maxVal = Math.max(...reluOut.flat());
    const step4: WalkthroughStep = {
        title: '🟦 Max Pooling (2×2)',
        shape: '1×1',
        color: '#D97706',
        content: (
            <>
                <FormulaBox>{`<b>Max Pool:</b>  output[r,c] = max(window)\n<span style="color:#4B5563;font-size:0.74rem;display:block;margin-top:6px;">Takes the maximum value in each 2×2 region. Reduces spatial size by 2×, retains strongest feature.</span>`}</FormulaBox>
                <TraceTable rows={[['[0,0]', `max(${reluOut.flat().join(', ')})`, maxVal.toFixed(3)]]} />
                <StatChips chips={[['Input', '2×2'], ['Output', '1×1'], ['Max value', maxVal.toFixed(3)]]} />
            </>
        ),
    };

    // ─ Step 5: Flatten ─
    const flatVec = [maxVal];
    const step5: WalkthroughStep = {
        title: '📐 Flatten',
        shape: `${flatVec.length} values`,
        color: '#16A34A',
        content: (
            <>
                <FormulaBox>{`<b>Flatten:</b>  Reshape 2D tensor → 1D vector\n<span style="color:#4B5563;font-size:0.74rem;display:block;margin-top:6px;">Row-major order: read all rows left-to-right, top-to-bottom. Result feeds into Dense layers.</span>`}</FormulaBox>
                <div style={{ fontFamily: fonts.mono, fontSize: '0.78rem', color: colors.text, marginTop: '8px', wordBreak: 'break-all' }}>
                    [{flatVec.map(v => v.toFixed(3)).join(', ')}]
                </div>
                <StatChips chips={[['Length', String(flatVec.length)], ['From shape', '1×1×1']]} />
            </>
        ),
    };

    // ─ Step 6: Dense ─
    const W = Array.from({ length: 5 }, () => parseFloat((Math.random() * 2 - 1).toFixed(3)));
    const b2 = Array.from({ length: 5 }, () => parseFloat((Math.random() * 0.5).toFixed(3)));
    const preAct = W.map((w, i) => flatVec[0] * w + b2[i]);
    const denseOut = preAct.map(v => Math.max(0, v));
    const step6: WalkthroughStep = {
        title: '🧠 Dense Layer (Fully Connected)',
        shape: '5 neurons',
        color: '#B91C1C',
        content: (
            <>
                <FormulaBox>{`<b>Dense:</b>  y<sub>i</sub> = ReLU(Σ<sub>j</sub> W<sub>ij</sub> × x<sub>j</sub> + b<sub>i</sub>)\n<span style="color:#4B5563;font-size:0.74rem;display:block;margin-top:6px;">Each neuron computes a weighted sum + bias, then applies ReLU. Weights W are learned during training.</span>`}</FormulaBox>
                <TraceTable rows={preAct.map((v, i) => [`neuron ${i}`, `${flatVec[0].toFixed(3)} × ${W[i].toFixed(3)} + ${b2[i].toFixed(3)} → ReLU(${v.toFixed(3)})`, denseOut[i].toFixed(3)] as [string, string, string])} />
                <StatChips chips={[['Neurons', '5'], ['Active (>0)', String(denseOut.filter(v => v > 0).length)]]} />
            </>
        ),
    };

    // ─ Step 7: Softmax ─
    const nC = 5;
    const seed = denseOut.reduce((a, b) => a + b, 0);
    const logits = Array.from({ length: nC }, (_, i) =>
        parseFloat((Math.sin(seed * (i + 1) * 0.37) * 2).toFixed(3))
    );
    const probs = softmax(logits);
    const predicted = probs.indexOf(Math.max(...probs));

    const step7: WalkthroughStep = {
        title: '📊 Softmax Output',
        shape: `${nC} probs`,
        color: '#6D28D9',
        content: (
            <>
                <FormulaBox>{`<b>Softmax:</b>  P(i) = exp(z<sub>i</sub>) / Σ exp(z<sub>j</sub>)\n<span style="color:#4B5563;font-size:0.74rem;display:block;margin-top:6px;">Converts logits to probabilities summing to 1. Numerically stable: subtract max(z) before exp.</span>`}</FormulaBox>
                <div className="flex flex-col gap-1 mt-3">
                    {probs.map((p, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span style={{ fontFamily: fonts.mono, fontSize: '0.76rem', width: 24, color: colors.textDim, fontWeight: 700 }}>{i}</span>
                            <div style={{ flex: 1, height: 20, background: '#E8DDD0', borderRadius: 4, overflow: 'hidden', border: '1.5px solid rgba(0,0,0,0.1)' }}>
                                <motion.div animate={{ width: `${(p * 100).toFixed(1)}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', borderRadius: 4, background: i === predicted ? `linear-gradient(90deg, ${colors.primary}, ${colors.accent3})` : colors.secondary }} />
                            </div>
                            <span style={{ fontFamily: fonts.mono, fontSize: '0.72rem', width: 56, fontWeight: 600 }}>{(p * 100).toFixed(1)}%</span>
                            <span style={{ fontFamily: fonts.mono, fontSize: '0.68rem', width: 64, color: colors.textDim, textAlign: 'right' }}>z={logits[i].toFixed(3)}</span>
                        </div>
                    ))}
                </div>
                <StatChips chips={[['Predicted', String(predicted)], ['Confidence', `${(probs[predicted] * 100).toFixed(1)}%`], ['Σ probs', probs.reduce((a, b) => a + b, 0).toFixed(4)]]} />
            </>
        ),
    };

    return [step1, step2, step3, step4, step5, step6, step7];
}

// ── Step accordion ────────────────────────────────────────────────
const StepCard: React.FC<{ step: WalkthroughStep; idx: number; delay: number }> = ({ step, idx, delay }) => {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            style={{
                background: colors.card,
                border: '2px solid rgba(0,0,0,0.1)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '2px 2px 0 rgba(38,61,91,0.1)',
                marginBottom: idx > 0 ? 0 : undefined,
            }}
        >
            {/* Header */}
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-3 w-full text-left px-5 py-3.5 cursor-pointer select-none"
                style={{
                    background: open
                        ? 'linear-gradient(90deg, rgba(73,182,229,0.12), transparent)'
                        : 'linear-gradient(90deg, rgba(73,182,229,0.06), transparent)',
                    transition: 'background 0.2s',
                }}
            >
                <span
                    className="flex items-center justify-center w-7 h-7 rounded-full text-white text-[0.74rem] font-bold shrink-0"
                    style={{ background: step.color, boxShadow: '2px 2px 0 rgba(0,0,0,0.3)', border: '2px solid rgba(0,0,0,0.2)', fontFamily: fonts.mono }}
                >
                    {idx + 1}
                </span>
                <span className="text-[0.95rem] font-bold flex-1" style={{ color: colors.secondary, fontFamily: fonts.mono }}>{step.title}</span>
                <span
                    className="text-[0.72rem] px-2.5 py-0.5 rounded font-medium"
                    style={{ fontFamily: fonts.mono, color: colors.textDim, background: colors.card2, border: '1.5px solid rgba(0,0,0,0.1)' }}
                >
                    {step.shape}
                </span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ color: colors.secondary, fontFamily: fonts.mono }}>▾</motion.span>
            </button>

            {/* Body */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div
                            className="px-5 py-5"
                            style={{ borderTop: '2px dashed rgba(38,61,91,0.2)', background: colors.card2 }}
                        >
                            {step.content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Connector between steps
const Connector: React.FC = () => (
    <div className="flex justify-center items-center h-9 relative">
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2.5px', background: `linear-gradient(180deg, ${colors.secondary}, ${colors.primary})`, transform: 'translateX(-50%)' }} />
        <span className="text-[1.1rem] font-bold relative z-10 px-1.5" style={{ color: colors.accent3, background: colors.bg }}>▼</span>
    </div>
);

// ── Section 6 ─────────────────────────────────────────────────────
const Section6Walkthrough: React.FC = () => {
    const [steps, setSteps] = useState<WalkthroughStep[]>([]);
    const [status, setStatus] = useState('Click Generate to start');

    const generate = useCallback(() => {
        setStatus('Generating…');
        setTimeout(() => {
            setSteps(buildWalkthrough());
            setStatus('Done! Click any step header to expand it.');
        }, 100);
    }, []);

    return (
        <AccordionSection id="sec6" num={6} title="🔢 Step-by-Step Computation Walkthrough">
            <Card title="ℹ️ About This Section">
                <p className="text-[0.8rem] leading-7" style={{ color: colors.textDim, fontFamily: fonts.mono }}>
                    This section traces the exact numeric computations at every stage of the CNN pipeline —
                    from raw pixel values through convolution, ReLU, pooling, flattening, dense layers, and softmax.
                    Each step shows the actual formulas and example numbers so you can follow the math precisely.
                    Click any step header to expand it.
                </p>
                <div className="flex items-center gap-3 mt-3">
                    <Button variant="primary" size="sm" onClick={generate}>🎲 Generate New Example</Button>
                    <span className="text-[0.76rem]" style={{ fontFamily: fonts.mono, color: colors.textDim }}>{status}</span>
                </div>
            </Card>

            {steps.length > 0 && (
                <div>
                    {steps.map((step, i) => (
                        <React.Fragment key={i}>
                            <StepCard step={step} idx={i} delay={i * 0.05} />
                            {i < steps.length - 1 && <Connector />}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </AccordionSection>
    );
};

export default Section6Walkthrough;
'use client';

/**
 * Section 5 — Prediction: Draw a digit and classify it.
 * Includes a 280×280 drawing canvas and a softmax probability bar chart.
 */

import React, {
  useRef, useState, useEffect,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccordionSection, Card, Button } from '@/components/ui/explore';
import { colors, fonts } from '@/styles/cnn-architect.styles';
import { softmax } from '@/utils/helper/cnn-architect.utils';

// ── Synthetic forward-pass (replaces TF model predict) ────────────
function predictDigit(imageData: ImageData): { probs: number[]; predicted: number } {
  // Extract grayscale, compute simple pixel-sum heuristics per region
  const px = imageData.data;
  const W  = imageData.width;  // 28
  const sums: number[] = Array(10).fill(0);

  for (let i = 0; i < px.length; i += 4) {
    const g = (px[i] + px[i+1] + px[i+2]) / 3 / 255;
    const pixIdx  = i / 4;
    const row     = Math.floor(pixIdx / W);
    const col     = pixIdx % W;
    const zone    = Math.floor((row / W) * 5) * 2 + Math.floor((col / W) * 2);
    sums[zone % 10] += g;
  }

  const seed    = sums.reduce((a, b) => a + b, 0);
  const logits  = Array.from({ length: 10 }, (_, i) =>
    parseFloat((Math.sin(seed * (i + 1) * 0.37) * 2).toFixed(3))
  );
  const probs     = softmax(logits);
  const predicted = probs.indexOf(Math.max(...probs));
  return { probs, predicted };
}

// ── Probability bars ──────────────────────────────────────────────
const ProbBars: React.FC<{ probs: number[]; predicted: number }> = ({ probs, predicted }) => (
  <div className="flex flex-col gap-1.5 max-w-90">
    {probs.map((p, i) => {
      const pct    = (p * 100).toFixed(1);
      const isTop  = i === predicted;
      return (
        <div key={i} className="flex items-center gap-2">
          <span
            className="text-right font-bold text-[0.78rem] w-5"
            style={{ fontFamily: fonts.mono, color: colors.textDim }}
          >
            {i}
          </span>
          <div
            className="flex-1 rounded overflow-hidden"
            style={{
              height:      '18px',
              background:  colors.progressBg,
              border:      '1.5px solid rgba(0,0,0,0.1)',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
              style={{
                height:         '100%',
                borderRadius:   '4px',
                background:     isTop
                  ? `linear-gradient(90deg, ${colors.primary}, ${colors.accent3})`
                  : colors.secondary,
              }}
            />
          </div>
          <span
            className="text-[0.72rem] font-semibold w-12"
            style={{ fontFamily: fonts.mono, color: colors.text }}
          >
            {pct}%
          </span>
        </div>
      );
    })}
  </div>
);

// ── Drawing canvas ────────────────────────────────────────────────
const Section5Prediction: React.FC = () => {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const [drawing,   setDrawing]   = useState(false);
  const [result,    setResult]    = useState<{ probs: number[]; predicted: number } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasDrawn,  setHasDrawn]  = useState(false);

  // Init canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = colors.drawCanvas;
    ctx.fillRect(0, 0, 280, 280);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth   = 16;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
  }, []);

  // ── Drawing handlers ──
  const getPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = 280 / rect.width;
    const scaleY = 280 / rect.height;
    if ('touches' in e) {
      const t = e.touches[0];
      return {
        x: (t.clientX - rect.left) * scaleX,
        y: (t.clientY - rect.top)  * scaleY,
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top)  * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => setDrawing(false);

  // ── Actions ──
  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = colors.drawCanvas;
    ctx.fillRect(0, 0, 280, 280);
    setResult(null);
    setHasDrawn(false);
  };

  const predict = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ctx = canvas.getContext('2d')!;

    // Downscale to 28×28 offscreen
    const off    = document.createElement('canvas');
    off.width    = 28;
    off.height   = 28;
    const octx   = off.getContext('2d')!;
    octx.drawImage(canvas, 0, 0, 28, 28);
    const imgData = octx.getImageData(0, 0, 28, 28);

    setResult(predictDigit(imgData));
  };

  const loadRandom = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = colors.drawCanvas;
    ctx.fillRect(0, 0, 280, 280);
    // Draw random squiggle
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 16;
    ctx.beginPath();
    const sx = 40 + Math.random() * 60;
    const sy = 80 + Math.random() * 80;
    ctx.moveTo(sx, sy);
    for (let i = 0; i < 8; i++) {
      ctx.lineTo(
        40 + Math.random() * 200,
        40 + Math.random() * 200,
      );
    }
    ctx.stroke();
    setHasDrawn(true);
    setResult(null);
  };

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'c' || e.key === 'C') clearCanvas();
      if (e.key === 'p' || e.key === 'P') predict();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <AccordionSection id="sec5" num={5} title="✏️ Prediction — Draw & Classify">
      <div className="flex flex-wrap gap-6 items-start">

        {/* Canvas column */}
        <div className="flex flex-col gap-2">
          <div className="text-[0.8rem]" style={{ color: colors.textDim }}>Draw a digit (0–9)</div>
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            style={{
              background:   colors.drawCanvas,
              border:       `3px solid ${colors.primary}`,
              borderRadius: '10px',
              cursor:       'crosshair',
              boxShadow:    `4px 4px 0 ${colors.secondary}`,
              touchAction:  'none',
              display:      'block',
              maxWidth:     '100%',
            }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
          <div className="flex flex-col gap-2 mt-2">
            <Button variant="primary"    onClick={predict}>🔍 Predict</Button>
            <Button variant="secondary" size="sm" onClick={clearCanvas}>✕ Clear</Button>
            <Button variant="secondary" size="sm" onClick={loadRandom}>🎲 Random Test</Button>
          </div>
        </div>

        {/* Result column */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              style={{ flex: 1, minWidth: '200px' }}
            >
              <Card title="🎯 Prediction Result">
                <div
                  className="text-center my-3"
                  style={{
                    fontSize:   '3rem',
                    fontFamily: fonts.display,
                    color:      colors.accent3,
                  }}
                >
                  {result.predicted}
                </div>
                <div
                  className="text-[0.72rem] mb-3 text-center"
                  style={{ fontFamily: fonts.mono, color: colors.textDim }}
                >
                  Confidence: {(Math.max(...result.probs) * 100).toFixed(1)}%
                </div>
                <ProbBars probs={result.probs} predicted={result.predicted} />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AccordionSection>
  );
};

export default Section5Prediction;
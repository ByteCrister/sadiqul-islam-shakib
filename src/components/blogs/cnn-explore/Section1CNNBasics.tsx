'use client';

/**
 * Section 1 — CNN Basics: Interactive Demos
 * Convolution Demo, Activation Demo, Pooling Demo, Flatten Demo.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AccordionSection, Card, Button, CtrlRow, CtrlVal, Select } from '@/components/ui/explore';
import {
  drawHeatmap,
  drawVectorStrip,
  computeConvolution,
  applyActivation,
  maxPool2x2,
  heatColor,
  cellColor,
  KERNEL_PRESETS,
  sleep,
} from '@/utils/helper/cnn-architect.utils';
import { colors, fonts } from '@/styles/cnn-architect.styles';
import type { ActivationFn, KernelPreset } from '@/types/cnn.types';

// ── Constants ─────────────────────────────────────────────────────
const CONV_ROWS = 6;
const CONV_COLS = 6;
const KERN_SIZE = 3;

// ── Convolution Demo ──────────────────────────────────────────────
const ConvolutionDemo: React.FC = () => {
  // Deterministic initial state (all zeros) to avoid hydration mismatch
  const [inputData, setInputData] = useState<number[][]>(() =>
    Array.from({ length: CONV_ROWS }, () => Array.from({ length: CONV_COLS }, () => 0))
  );
  const [kernelData, setKernelData] = useState<number[][]>([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]]);
  const [stride, setStride] = useState(1);
  const [padding, setPadding] = useState(false);
  const [outSize, setOutSize] = useState('');
  const [animating, setAnimating] = useState(false);

  const outputCanvasRef = useRef<HTMLCanvasElement>(null);

  // Randomise after mount (client‑only)
  useEffect(() => {
    const randomData = Array.from({ length: CONV_ROWS }, () =>
      Array.from({ length: CONV_COLS }, () => Math.round(Math.random() * 9))
    );
    setInputData(randomData);
    recompute(randomData, kernelData, stride, padding);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recompute = useCallback((
    inp = inputData,
    kern = kernelData,
    s = stride,
    pad = padding,
    hlR = -1,
    hlC = -1,
  ) => {
    const { output, outH, outW } = computeConvolution(inp, kern, s, pad);
    setOutSize(`Output: ${outH}×${outW}`);
    if (outputCanvasRef.current) {
      drawHeatmap(outputCanvasRef.current, output, { w: 120, h: 120 });
      if (hlR >= 0 && hlC >= 0) {
        const ctx = outputCanvasRef.current.getContext('2d')!;
        const cw = 120 / outW, ch = 120 / outH;
        ctx.strokeStyle = '#f7c948';
        ctx.lineWidth = 2;
        ctx.strokeRect(hlC * cw + 1, hlR * ch + 1, cw - 2, ch - 2);
      }
    }
  }, [inputData, kernelData, stride, padding]);

  useEffect(() => { recompute(); }, [recompute]);

  const randomise = () => {
    const next = Array.from({ length: CONV_ROWS }, () =>
      Array.from({ length: CONV_COLS }, () => Math.round(Math.random() * 9))
    );
    setInputData(next);
    recompute(next, kernelData, stride, padding);
  };

  const setPreset = (name: KernelPreset) => {
    const next = KERNEL_PRESETS[name].map(r => [...r]);
    setKernelData(next);
    recompute(inputData, next, stride, padding);
  };

  const animate = async () => {
    if (animating) return;
    setAnimating(true);
    const { outH, outW } = computeConvolution(inputData, kernelData, stride, padding);
    for (let r = 0; r < outH; r++) {
      for (let c = 0; c < outW; c++) {
        recompute(inputData, kernelData, stride, padding, r, c);
        await sleep(90);
      }
    }
    recompute();
    setAnimating(false);
  };

  const updateCell = (type: 'input' | 'kernel', r: number, c: number, val: number) => {
    if (type === 'input') {
      const next = inputData.map(row => [...row]);
      next[r][c] = val;
      setInputData(next);
      recompute(next, kernelData, stride, padding);
    } else {
      const next = kernelData.map(row => [...row]);
      next[r][c] = val;
      setKernelData(next);
      recompute(inputData, next, stride, padding);
    }
  };

  return (
    <Card title="🔲 Convolution Demo" tip="Convolution slides a small kernel (filter) over the input image, computing a weighted sum at each position to detect features like edges.">
      <div className="flex flex-wrap gap-4 items-start">
        {/* Input grid */}
        <div className="flex flex-col gap-2">
          <div className="text-[0.8rem]" style={{ color: colors.textDim }}>Input (click cells to edit)</div>
          <div
            style={{
              display: 'inline-grid',
              gap: '2px',
              gridTemplateColumns: `repeat(${CONV_COLS}, 38px)`,
            }}
          >
            {inputData.map((row, r) =>
              row.map((val, c) => (
                <input
                  key={`${r}-${c}`}
                  type="number" min={0} max={9} step={1}
                  value={val}
                  onChange={e => updateCell('input', r, c, parseFloat(e.target.value) || 0)}
                  style={{
                    width: '38px',
                    height: '38px',
                    textAlign: 'center',
                    padding: 0,
                    fontSize: '0.85rem',
                    background: cellColor(val, 0, 9),
                    color: val > 5 ? '#111' : '#eee',
                    border: 'none',
                    borderRadius: '3px',
                    fontFamily: fonts.mono,
                  }}
                />
              ))
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={randomise}>🎲 Randomise</Button>
        </div>

        {/* Kernel grid */}
        <div className="flex flex-col gap-2">
          <div className="text-[0.8rem]" style={{ color: colors.textDim }}>Kernel (editable)</div>
          <div
            style={{
              display: 'inline-grid',
              gap: '2px',
              gridTemplateColumns: `repeat(${KERN_SIZE}, 44px)`,
            }}
          >
            {kernelData.map((row, r) =>
              row.map((val, c) => (
                <input
                  key={`k${r}-${c}`}
                  type="number" step={0.1}
                  value={val}
                  onChange={e => updateCell('kernel', r, c, parseFloat(e.target.value) || 0)}
                  style={{
                    width: '44px',
                    height: '44px',
                    textAlign: 'center',
                    padding: 0,
                    fontSize: '0.85rem',
                    background: cellColor(val, -3, 3),
                    color: Math.abs(val) < 1 ? '#eee' : '#111',
                    border: 'none',
                    borderRadius: '3px',
                    fontFamily: fonts.mono,
                  }}
                />
              ))
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {(['edge-h', 'edge-v', 'blur', 'sharpen'] as KernelPreset[]).map(p => (
              <Button key={p} variant="secondary" size="sm" onClick={() => setPreset(p)}>
                {p === 'edge-h' ? 'H-Edge' : p === 'edge-v' ? 'V-Edge' : p.charAt(0).toUpperCase() + p.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2">
          <CtrlRow label="Stride" tip="Stride controls how many pixels the kernel moves each step.">
            <input
              type="range" min={1} max={2} value={stride}
              onChange={e => { const s = parseInt(e.target.value); setStride(s); recompute(inputData, kernelData, s, padding); }}
              style={{ flex: 1, maxWidth: '120px' }}
            />
            <CtrlVal>{stride}</CtrlVal>
          </CtrlRow>
          <CtrlRow label="Padding" tip="Padding adds zeros around the input so the output has the same size.">
            <input
              type="checkbox" checked={padding}
              onChange={e => { setPadding(e.target.checked); recompute(inputData, kernelData, stride, e.target.checked); }}
              style={{ accentColor: colors.secondary, width: '17px', height: '17px', cursor: 'pointer' }}
            />
            <span className="text-[0.8rem]" style={{ fontFamily: fonts.mono }}>Same</span>
          </CtrlRow>
          <Button variant="primary" size="sm" onClick={animate} disabled={animating}>
            {animating ? '⏳ Animating…' : '▶ Animate'}
          </Button>
        </div>

        {/* Output canvas */}
        <div className="flex flex-col gap-1">
          <div className="text-[0.8rem]" style={{ color: colors.textDim }}>Output Feature Map</div>
          <canvas ref={outputCanvasRef} width={120} height={120} style={{ display: 'block' }} />
          <div className="text-[0.7rem]" style={{ fontFamily: fonts.mono, color: colors.textDim }}>{outSize}</div>
        </div>
      </div>
    </Card>
  );
};

// ── Activation Demo ───────────────────────────────────────────────
const ActivationDemo: React.FC = () => {
  // Deterministic initial state (all zeros)
  const [matrix, setMatrix] = useState<number[][]>(() =>
    Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => 0))
  );
  const [fn, setFn] = useState<ActivationFn>('relu');

  const beforeRef = useRef<HTMLCanvasElement>(null);
  const afterRef = useRef<HTMLCanvasElement>(null);

  // Randomise after mount
  useEffect(() => {
    const randomMatrix = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => parseFloat(((Math.random() * 4 - 2)).toFixed(2)))
    );
    setMatrix(randomMatrix);
    runActivation(randomMatrix, fn);
  }, []);

  const runActivation = useCallback((m = matrix, f = fn) => {
    if (beforeRef.current) drawHeatmap(beforeRef.current, m, { w: 130, h: 130 });
    const after = applyActivation(m, f);
    if (afterRef.current) drawHeatmap(afterRef.current, after, { w: 130, h: 130 });
  }, [matrix, fn]);

  useEffect(() => { runActivation(); }, [runActivation]);

  const newMatrix = () => {
    const m = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => parseFloat(((Math.random() * 4 - 2)).toFixed(2)))
    );
    setMatrix(m);
    runActivation(m, fn);
  };

  const formula = fn === 'relu' ? 'ReLU(x) = max(0, x)' : 'σ(x) = 1 / (1 + e^-x)';

  return (
    <Card title="⚡ Activation Function Demo" tip="ReLU sets all negative values to zero, introducing non-linearity. Sigmoid squashes values to (0,1).">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex flex-col gap-1">
          <div className="text-[0.8rem]" style={{ color: colors.textDim }}>Before activation</div>
          <canvas ref={beforeRef} width={130} height={130} style={{ display: 'block' }} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <CtrlRow label="Function">
            <Select
              value={fn}
              onChange={e => { const f = e.target.value as ActivationFn; setFn(f); runActivation(matrix, f); }}
              options={[{ value: 'relu', label: 'ReLU' }, { value: 'sigmoid', label: 'Sigmoid' }]}
            />
          </CtrlRow>
          <div className="text-2xl text-center" style={{ color: colors.accent }}>→</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[0.8rem]" style={{ color: colors.textDim }}>After activation</div>
          <canvas ref={afterRef} width={130} height={130} style={{ display: 'block' }} />
        </div>
        <div
          className="text-[0.75rem] max-w-[180px]"
          style={{ fontFamily: fonts.mono }}
        >
          <div style={{ color: colors.accent3 }}>{formula}</div>
          <div className="mt-2 text-[0.72rem]" style={{ color: colors.textDim }}>
            Negative values (blue) become zero. Positive values (yellow) pass through.
          </div>
        </div>
      </div>
      <Button variant="secondary" size="sm" className="mt-2" onClick={newMatrix}>🎲 New matrix</Button>
    </Card>
  );
};

// ── Pooling Demo ──────────────────────────────────────────────────
const PoolingDemo: React.FC = () => {
  // Deterministic initial state (all zeros)
  const [poolData, setPoolData] = useState<number[][]>(() =>
    Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0))
  );

  const inputRef = useRef<HTMLCanvasElement>(null);
  const outputRef = useRef<HTMLCanvasElement>(null);
  const [info, setInfo] = useState<string[]>([]);

  // Randomise after mount
  useEffect(() => {
    const randomData = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => Math.round(Math.random() * 9))
    );
    setPoolData(randomData);
    run(randomData);
  }, []);

  const run = useCallback((data = poolData) => {
    if (inputRef.current) drawHeatmap(inputRef.current, data, { w: 130, h: 130 });
    const { output, info: inf } = maxPool2x2(data);
    if (outputRef.current) drawHeatmap(outputRef.current, output, { w: 130, h: 130 });
    setInfo(inf);
  }, [poolData]);

  useEffect(() => { run(); }, [run]);

  const randomise = () => {
    const next = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => Math.round(Math.random() * 9))
    );
    setPoolData(next);
    run(next);
  };

  return (
    <Card title="🟦 Max Pooling Demo" tip="Max pooling takes the maximum value in each region, reducing spatial size while keeping important features.">
      <div className="flex flex-wrap gap-4 items-start">
        <div className="flex flex-col gap-1">
          <div className="text-[0.8rem]" style={{ color: colors.textDim }}>Input (4×4)</div>
          <canvas ref={inputRef} width={130} height={130} style={{ display: 'block' }} />
        </div>
        <div className="self-center text-2xl" style={{ color: colors.accent }}>→</div>
        <div className="flex flex-col gap-1">
          <div className="text-[0.8rem]" style={{ color: colors.textDim }}>Output (2×2, 2×2 pool)</div>
          <canvas ref={outputRef} width={130} height={130} style={{ display: 'block' }} />
        </div>
        <div className="flex flex-col gap-1 text-[0.78rem]" style={{ fontFamily: fonts.mono }}>
          {info.map((s, i) => (
            <div key={i} style={{ color: colors.accent3 }}>{s}</div>
          ))}
        </div>
      </div>
      <Button variant="secondary" size="sm" className="mt-2" onClick={randomise}>🎲 New example</Button>
    </Card>
  );
};

// ── Flatten + Dense Demo ──────────────────────────────────────────
const FlattenDemo: React.FC = () => {
  const [flatData, setFlatData] = useState<number[][]>([]);
  const [flatVec, setFlatVec] = useState<number[]>([]);
  const [relu, setRelu] = useState<number[]>([]);
  const [formula, setFormula] = useState('');

  const flatInputRef = useRef<HTMLCanvasElement>(null);
  const flatVecRef = useRef<HTMLCanvasElement>(null);
  const flatDenseRef = useRef<HTMLCanvasElement>(null);

  const init = useCallback(() => {
    const data = Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => parseFloat((Math.random() * 2).toFixed(2)))
    );
    const W = Array.from({ length: 3 }, () =>
      Array.from({ length: 4 }, () => parseFloat((Math.random() * 2 - 1).toFixed(2)))
    );
    const b = Array.from({ length: 3 }, () => parseFloat((Math.random() * 0.5).toFixed(2)));
    const flat = data[0].concat(data[1]);
    const neurons = W.map((wRow, i) => wRow.reduce((s, w, j) => s + w * flat[j], b[i]));
    const r = neurons.map(v => Math.max(0, v));

    setFlatData(data);
    setFlatVec(flat);
    setRelu(r);
    setFormula(`y = ReLU(Wx + b) → [${r.map(v => v.toFixed(2)).join(', ')}]`);

    if (flatInputRef.current) drawHeatmap(flatInputRef.current, data, { w: 80, h: 80 });
    if (flatVecRef.current) drawVectorStrip(flatVecRef.current, flat, 28);

    if (flatDenseRef.current) {
      const nc = flatDenseRef.current;
      nc.width = 40; nc.height = 90;
      const ctx = nc.getContext('2d')!;
      ctx.clearRect(0, 0, 40, 90);
      r.forEach((v, i) => {
        const t = Math.max(0, Math.min(1, v));
        const [rr, gg, bb] = heatColor(t);
        ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
        ctx.beginPath();
        ctx.arc(20, 15 + i * 30, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = '9px JetBrains Mono';
        ctx.fillText(v.toFixed(1), 20, 19 + i * 30);
      });
    }
  }, []);

  useEffect(() => { init(); }, [init]);

  return (
    <Card title="📐 Flatten + Dense Demo" tip="Flatten converts the 2D feature map to a 1D vector, then Dense layers apply learned weights and biases.">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex flex-col gap-1">
          <div className="text-[0.8rem]" style={{ color: colors.textDim }}>Feature map</div>
          <canvas ref={flatInputRef} width={80} height={80} style={{ display: 'block' }} />
        </div>
        <div className="self-center text-xl" style={{ color: colors.accent }}>→ flatten →</div>
        <div className="flex flex-col gap-1">
          <div className="text-[0.8rem]" style={{ color: colors.textDim }}>Flat vector</div>
          <canvas ref={flatVecRef} width={112} height={28} style={{ display: 'block' }} />
        </div>
        <div className="self-center text-xl" style={{ color: colors.accent }}>→ dense →</div>
        <div className="flex flex-col gap-1">
          <div className="text-[0.8rem]" style={{ color: colors.textDim }}>Neurons</div>
          <canvas ref={flatDenseRef} width={40} height={90} style={{ display: 'block' }} />
        </div>
      </div>
      <div className="mt-3 text-[0.78rem]" style={{ fontFamily: fonts.mono, color: colors.accent3 }}>
        {formula}
      </div>
      <Button variant="secondary" size="sm" className="mt-2" onClick={init}>🎲 New example</Button>
    </Card>
  );
};

// ── Section 1 ─────────────────────────────────────────────────────
const Section1CNNBasics: React.FC = () => (
  <AccordionSection id="sec1" num={1} title="🧮 CNN Basics — Interactive Demos">
    <ConvolutionDemo />
    <ActivationDemo />
    <PoolingDemo />
    <FlattenDemo />
  </AccordionSection>
);

export default Section1CNNBasics;
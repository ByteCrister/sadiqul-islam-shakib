"use client";

/**
 * Section 3 — Dataset Preview (MNIST-like synthetic samples)
 */

import React, { useEffect, useRef, useState } from "react";
import { AccordionSection, Card, Button } from "@/components/ui/explore";
import { drawHeatmap } from "@/utils/helper/cnn-architect.utils";
import { colors, fonts } from "@/styles/cnn-architect.styles";

// Generate a synthetic digit image (blurry circle/stroke pattern)
function syntheticDigit(digit: number, size = 28): number[][] {
  const mat: number[][] = Array.from({ length: size }, () =>
    Array(size).fill(0),
  );
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const d = Math.sqrt((row - cy) ** 2 + (col - cx) ** 2);
      // Ring for 0, filled for others
      let v = 0;
      if (digit === 0) {
        v = Math.max(0, 1 - Math.abs(d - r) / (size * 0.08));
      } else {
        // Vertical stroke weighted by digit
        const stripe = col - cx + (digit - 5) * size * 0.06;
        v = Math.max(0, 1 - Math.abs(stripe) / (size * 0.08));
        if (digit % 2 === 0) {
          // Add horizontal component
          const hstripe = row - cy + (digit - 5) * size * 0.06;
          v = Math.max(v, Math.max(0, 1 - Math.abs(hstripe) / (size * 0.08)));
        }
      }
      // Add noise
      v = Math.min(1, v + (Math.random() * 0.08 - 0.04));
      mat[row][col] = Math.max(0, Math.min(1, v));
    }
  }
  return mat;
}

const SAMPLE_COUNT = 20;

interface Sample {
  digit: number;
  data: number[][];
}

const MnistSampleCanvas: React.FC<{ sample: Sample; size: number }> = ({
  sample,
  size,
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current)
      drawHeatmap(ref.current, sample.data, { w: size, h: size });
  }, [sample, size]);

  return (
    <div className="flex flex-col items-center gap-1">
      <canvas
        ref={ref}
        width={size}
        height={size}
        style={{
          display: "block",
          borderRadius: "6px",
          border: `2px solid ${colors.secondary}`,
          boxShadow: `2px 2px 0 rgba(38,61,91,0.3)`,
        }}
      />
      <span
        className="text-[0.68rem] font-bold"
        style={{ fontFamily: fonts.mono, color: colors.accent3 }}
      >
        {sample.digit}
      </span>
    </div>
  );
};

const DatasetPreview: React.FC = () => {
  const [samples, setSamples] = useState<Sample[]>([]);

  const generate = () => {
    const s: Sample[] = Array.from({ length: SAMPLE_COUNT }, () => {
      const digit = Math.floor(Math.random() * 10);
      return { digit, data: syntheticDigit(digit, 28) };
    });
    setSamples(s);
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <Card title="🖼️ Dataset Samples (Synthetic MNIST-style)">
      <div
        style={{
          display: "grid",
          gap: "8px",
          gridTemplateColumns: "repeat(auto-fill, 54px)",
        }}
      >
        {samples.map((s, i) => (
          <MnistSampleCanvas key={i} sample={s} size={46} />
        ))}
      </div>
      <Button variant="secondary" size="sm" className="mt-3" onClick={generate}>
        🎲 New Samples
      </Button>
    </Card>
  );
};

const Section3Dataset: React.FC = () => (
  <AccordionSection id="sec3" num={3} title="📊 Dataset — MNIST Samples">
    <DatasetPreview />
  </AccordionSection>
);

export default Section3Dataset;

/**
 * CNN Explorer — Shared Utility Functions
 * Pure functions: canvas drawing, math helpers, CNN primitives.
 */

// ── Heat-map colour scale (blue → cyan → yellow) ────────────────
export function heatColor(t: number): [number, number, number] {
  if (t < 0.33) {
    const s = t / 0.33;
    return [Math.round(s * 108), Math.round(s * 99), Math.round(s * 255)];
  } else if (t < 0.66) {
    const s = (t - 0.33) / 0.33;
    return [
      Math.round(108 + s * (73 - 108)),
      Math.round(99 + s * (182 - 99)),
      Math.round(255 + s * (229 - 255)),
    ];
  } else {
    const s = (t - 0.66) / 0.34;
    return [
      Math.round(73 + s * (247 - 73)),
      Math.round(182 + s * (201 - 182)),
      Math.round(229 + s * 26),
    ];
  }
}

export function cellColor(val: number, mn: number, mx: number): string {
  const t = (val - mn) / (mx - mn || 1e-6);
  const [r, g, b] = heatColor(Math.max(0, Math.min(1, t)));
  return `rgb(${r},${g},${b})`;
}

export function drawHeatmap(
  canvas: HTMLCanvasElement,
  data2d: number[][],
  opts: { w?: number; h?: number } = {},
): void {
  const rows = data2d.length;
  const cols = data2d[0]?.length ?? 0;
  if (!rows || !cols) return;

  canvas.width = opts.w ?? canvas.width;
  canvas.height = opts.h ?? canvas.height;
  const ctx = canvas.getContext("2d")!;
  const cw = canvas.width / cols;
  const ch = canvas.height / rows;

  let mn = Infinity,
    mx = -Infinity;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      mn = Math.min(mn, data2d[r][c]);
      mx = Math.max(mx, data2d[r][c]);
    }
  if (mx === mn) mx = mn + 1e-6;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = (data2d[r][c] - mn) / (mx - mn);
      const [rr, gg, bb] = heatColor(t);
      ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
      ctx.fillRect(c * cw, r * ch, cw, ch);
    }
  }
}

export function drawVectorStrip(
  canvas: HTMLCanvasElement,
  values: number[],
  h = 24,
): void {
  const n = values.length;
  canvas.width = n * 3;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const mn = Math.min(...values);
  let mx = Math.max(...values);
  if (mx === mn) mx = mn + 1e-6;
  for (let i = 0; i < n; i++) {
    const t = (values[i] - mn) / (mx - mn);
    const [rr, gg, bb] = heatColor(t);
    ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
    ctx.fillRect(i * 3, 0, 3, h);
  }
}

export function flat2d(arr: number[], h: number, w: number): number[][] {
  const out: number[][] = [];
  for (let r = 0; r < h; r++) out.push(Array.from(arr.slice(r * w, r * w + w)));
  return out;
}

// ── Convolution helpers ──────────────────────────────────────────
export const KERNEL_PRESETS: Record<string, number[][]> = {
  "edge-h": [
    [-1, -1, -1],
    [0, 0, 0],
    [1, 1, 1],
  ],
  "edge-v": [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
  ],
  blur: [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ],
  sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
};

export function computeConvolution(
  inputData: number[][],
  kernelData: number[][],
  stride: number,
  padding: boolean,
): { output: number[][]; outH: number; outW: number } {
  const ROWS = inputData.length;
  const COLS = inputData[0]?.length ?? 0;
  const K = kernelData.length;

  let padded = inputData;
  if (padding) {
    padded = Array.from({ length: ROWS + 2 }, (_, r) =>
      Array.from({ length: COLS + 2 }, (_, c) => {
        if (r === 0 || r === ROWS + 1 || c === 0 || c === COLS + 1) return 0;
        return inputData[r - 1][c - 1];
      }),
    );
  }

  const ph = padded.length;
  const pw = padded[0]?.length ?? 0;
  const outH = Math.floor((ph - K) / stride) + 1;
  const outW = Math.floor((pw - K) / stride) + 1;

  const output: number[][] = [];
  for (let r = 0; r < outH; r++) {
    const row: number[] = [];
    for (let c = 0; c < outW; c++) {
      let sum = 0;
      for (let kr = 0; kr < K; kr++)
        for (let kc = 0; kc < K; kc++)
          sum += padded[r * stride + kr][c * stride + kc] * kernelData[kr][kc];
      row.push(sum);
    }
    output.push(row);
  }
  return { output, outH, outW };
}

export function applyActivation(
  matrix: number[][],
  fn: "relu" | "sigmoid",
): number[][] {
  return matrix.map((row) =>
    row.map((v) => (fn === "relu" ? Math.max(0, v) : 1 / (1 + Math.exp(-v)))),
  );
}

export function maxPool2x2(data: number[][]): {
  output: number[][];
  info: string[];
} {
  const H = Math.floor(data.length / 2);
  const W = Math.floor((data[0]?.length ?? 0) / 2);
  const output: number[][] = Array.from({ length: H }, () => Array(W).fill(0));
  const info: string[] = [];
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const vals = [
        data[r * 2][c * 2],
        data[r * 2][c * 2 + 1],
        data[r * 2 + 1][c * 2],
        data[r * 2 + 1][c * 2 + 1],
      ];
      output[r][c] = Math.max(...vals);
      info.push(`max(${vals.join(",")})=${output[r][c]}`);
    }
  }
  return { output, info };
}

// ── Misc ─────────────────────────────────────────────────────────
export const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

export function randomMatrix(
  rows: number,
  cols: number,
  min = 0,
  max = 9,
): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () =>
      parseFloat((Math.random() * (max - min) + min).toFixed(2)),
    ),
  );
}

export function softmax(logits: number[]): number[] {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((z) => Math.exp(z - maxLogit));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

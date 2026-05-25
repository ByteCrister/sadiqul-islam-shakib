// ── CNN Explorer — Shared Types ──────────────────────────────────

export type ActivationFn = "relu" | "sigmoid";

export type TrainStatus = "idle" | "running" | "paused" | "done";

export type KernelPreset = "edge-h" | "edge-v" | "blur" | "sharpen";

export interface ConvDemoState {
  inputData: number[][];
  kernelData: number[][];
  stride: number;
  padding: boolean;
}

export interface PoolDemoState {
  inputData: number[][];
}

export interface ActivationDemoState {
  matrix: number[][];
  fn: ActivationFn;
}

export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  lr: number;
  inspect: boolean;
}

export interface TrainingStats {
  epoch: number;
  batch: number;
  loss: number;
  accuracy: number;
}

export interface ArchLayer {
  type: string;
  label: string;
  params: string;
  kind: "conv" | "pool" | "flat" | "dense" | "out";
}

export interface CompStep {
  title: string;
  shape: string;
  content: HTMLElement | null;
}

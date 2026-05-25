"use client";
// src/components/nn/NNContext.tsx
// Global state store for the Neural Network Explorer — no external deps.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  NNState,
  TrainConfig,
  TabKey,
  StepData,
} from "@/types/nn.types";
import {
  initNetwork as engineInit,
  forwardPass,
  backwardAndUpdate,
  computeLoss,
  getPredClass,
  getTrueClass,
  buildSteps,
  f4,
  cloneNN,
} from "@/data/nn.engine";
import { DATASETS } from "@/data/nn.data";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NNContextValue {
  // State
  nn: NNState;
  config: TrainConfig;
  activeTab: TabKey;
  lossHistory: number[];
  accHistory: number[];
  currentEpoch: number;
  totalEpochs: number;
  isTraining: boolean;
  metricsText: string;
  // Step-by-step
  stepData: StepData | null;
  stepIdx: number;
  stepPhase: "idle" | "stepping" | "done";
  stepHint: string;
  stepSampleIdx: number;

  // Actions
  setActiveTab: (t: TabKey) => void;
  setConfig: (c: Partial<TrainConfig>) => void;
  startTraining: () => void;
  stopTraining: () => void;
  reinitWeights: () => void;
  resetAll: () => void;
  doNextStep: () => void;
  resetSteps: () => void;
  setStepSampleIdx: (i: number) => void;
}

const NNCtx = createContext<NNContextValue | null>(null);

export function useNN() {
  const ctx = useContext(NNCtx);
  if (!ctx) throw new Error("useNN must be inside NNProvider");
  return ctx;
}

// ─── Default Config ───────────────────────────────────────────────────────────
const DEFAULT_CONFIG: TrainConfig = {
  dataset: "linear",
  hiddenSize: 3,
  activation: "sigmoid",
  optimiser: "sgd",
  lr: 0.01,
  momentumBeta: 0.9,
  adamB1: 0.9,
  adamB2: 0.999,
  adamEps: 1e-8,
  epochs: 200,
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function NNProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<TrainConfig>(DEFAULT_CONFIG);
  const [nn, setNN] = useState<NNState>(() =>
    engineInit(DEFAULT_CONFIG.dataset, DEFAULT_CONFIG.hiddenSize)
  );
  const [activeTab, setActiveTab] = useState<TabKey>("visualize");

  // Training
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [accHistory, setAccHistory] = useState<number[]>([]);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs, setTotalEpochs] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [metricsText, setMetricsText] = useState("—");

  // Step-by-step
  const [stepData, setStepData] = useState<StepData | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [stepPhase, setStepPhase] = useState<"idle" | "stepping" | "done">("idle");
  const [stepHint, setStepHint] = useState("Click Next Step to start ▶");
  const [stepSampleIdx, setStepSampleIdx] = useState(0);

  // Refs for training loop
  const isTrainingRef = useRef(false);
  const trainHandleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nnRef = useRef<NNState>(nn);
  const configRef = useRef<TrainConfig>(config);

  useEffect(() => {
    nnRef.current = nn;
  }, [nn]);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // ── Config changes ────────────────────────────────────────────────────────
  const setConfig = useCallback((partial: Partial<TrainConfig>) => {
    setConfigState((prev) => {
      const next = { ...prev, ...partial };
      configRef.current = next;
      return next;
    });
  }, []);

  // ── Network re-init helpers ───────────────────────────────────────────────
  const rebuildNN = useCallback(
    (cfg: TrainConfig) => {
      const fresh = engineInit(cfg.dataset, cfg.hiddenSize);
      nnRef.current = fresh;
      setNN(fresh);
      setStepData(null);
      setStepIdx(0);
      setStepPhase("idle");
      setStepHint("Click Next Step to start ▶");
    },
    []
  );

  const reinitWeights = useCallback(() => {
    stopTrainingFn();
    setLossHistory([]);
    setAccHistory([]);
    setCurrentEpoch(0);
    rebuildNN(configRef.current);
  }, [rebuildNN]);

  const resetAll = useCallback(() => {
    stopTrainingFn();
    setLossHistory([]);
    setAccHistory([]);
    setCurrentEpoch(0);
    rebuildNN(configRef.current);
  }, [rebuildNN]);

  // ── Metrics text ──────────────────────────────────────────────────────────
  const updateMetricsText = useCallback(
    (nnState: NNState, cfg: TrainConfig) => {
      const ds = DATASETS[cfg.dataset];
      const lines = ds.data
        .map((sample, i) => {
          const cache = forwardPass(nnState, cfg, sample.x);
          const pred = cache.a2.map(f4).join(",");
          const truth = Array.isArray(sample.y)
            ? sample.y.join(",")
            : sample.y;
          const lossVal = computeLoss(
            cfg.dataset,
            cache.a2.length === 1 ? cache.a2[0] : cache.a2,
            sample.y
          );
          return `S${i + 1}: ŷ=[${pred}]  y=[${truth}]  L=${f4(lossVal)}`;
        })
        .join("\n");
      setMetricsText(lines);
    },
    []
  );

  // ── Training ─────────────────────────────────────────────────────────────
  function stopTrainingFn() {
    isTrainingRef.current = false;
    setIsTraining(false);
    if (trainHandleRef.current) {
      clearTimeout(trainHandleRef.current);
      trainHandleRef.current = null;
    }
  }

  const stopTraining = useCallback(stopTrainingFn, []);

  const startTraining = useCallback(() => {
    stopTrainingFn();
    const cfg = configRef.current;
    const total = cfg.epochs;
    setTotalEpochs(total);
    setCurrentEpoch(0);
    setLossHistory([]);
    setAccHistory([]);
    isTrainingRef.current = true;
    setIsTraining(true);

    // Use a local mutable copy for the hot loop
    const workingNN = cloneNN(nnRef.current);

    function runEpoch(epoch: number) {
      if (!isTrainingRef.current || epoch >= total) {
        isTrainingRef.current = false;
        setIsTraining(false);
        nnRef.current = workingNN;
        setNN({ ...workingNN });
        updateMetricsText(workingNN, cfg);
        return;
      }

      const ds = DATASETS[cfg.dataset];
      let totalLoss = 0;
      let correct = 0;

      ds.data.forEach((sample) => {
        const cache = forwardPass(workingNN, cfg, sample.x);
        const pred = cache.a2.length === 1 ? cache.a2[0] : cache.a2;
        totalLoss += computeLoss(cfg.dataset, pred, sample.y);
        if (ds.lossType !== "mse") {
          if (
            getPredClass(cache.a2, cfg.dataset) === getTrueClass(sample.y)
          )
            correct++;
        }
        backwardAndUpdate(workingNN, cfg, cache, sample.y);
      });

      const avgLoss = totalLoss / ds.data.length;
      const nextEpoch = epoch + 1;

      setLossHistory((h) => [...h, avgLoss]);
      setCurrentEpoch(nextEpoch);

      if (ds.lossType !== "mse") {
        const acc = (correct / ds.data.length) * 100;
        setAccHistory((h) => [...h, acc]);
      }

      // Sync NN to React every 20 epochs for the SVG
      if (nextEpoch % 20 === 0 || nextEpoch === total) {
        setNN({ ...workingNN });
        nnRef.current = workingNN;
      }

      trainHandleRef.current = setTimeout(() => runEpoch(nextEpoch), 0);
    }

    runEpoch(0);
  }, [updateMetricsText]);

  // ── Step-by-step ──────────────────────────────────────────────────────────
  const resetSteps = useCallback(() => {
    setStepData(null);
    setStepIdx(0);
    setStepPhase("idle");
    setStepHint("Click Next Step to start ▶");
  }, []);

  const doNextStep = useCallback(() => {
    const cfg = configRef.current;
    const currentNN = nnRef.current;

    if (stepPhase === "done" || !stepData) {
      // Build fresh steps
      const sd = buildSteps(currentNN, cfg, stepSampleIdx);
      setStepData(sd);
      setStepIdx(0);
      setStepPhase("stepping");
      setStepHint(`Step 1 / ${sd.steps.length}`);
      return;
    }

    if (stepIdx >= stepData.steps.length) {
      // Apply the update
      const ds = DATASETS[cfg.dataset];
      const sample = ds.data[stepData.fwd.x ? stepSampleIdx : 0];
      const updatedNN = cloneNN(currentNN);
      backwardAndUpdate(updatedNN, cfg, stepData.fwd, sample.y);
      nnRef.current = updatedNN;
      setNN({ ...updatedNN });
      setStepPhase("done");
      setStepHint("✅ Weights updated! Start again for the next pass.");
      return;
    }

    const step = stepData.steps[stepIdx];
    setStepIdx((i) => i + 1);
    const nextIdx = stepIdx + 1;
    if (nextIdx >= stepData.steps.length) {
      setStepHint("Click once more to apply weight updates!");
    } else {
      setStepHint(`Step ${nextIdx} / ${stepData.steps.length}`);
    }
    // Return the current step for rendering
    return step;
  }, [stepData, stepIdx, stepPhase, stepSampleIdx]);

  // ── Dataset switch side effects ───────────────────────────────────────────
  useEffect(() => {
    stopTrainingFn();
    setLossHistory([]);
    setAccHistory([]);
    setCurrentEpoch(0);
    const fresh = engineInit(config.dataset, config.hiddenSize);
    nnRef.current = fresh;
    setNN(fresh);
    resetSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.dataset]);

  // ── Hidden size side effect ───────────────────────────────────────────────
  useEffect(() => {
    stopTrainingFn();
    const fresh = engineInit(config.dataset, config.hiddenSize);
    nnRef.current = fresh;
    setNN(fresh);
    resetSteps();
    setLossHistory([]);
    setAccHistory([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.hiddenSize]);

  return (
    <NNCtx.Provider
      value={{
        nn,
        config,
        activeTab,
        lossHistory,
        accHistory,
        currentEpoch,
        totalEpochs,
        isTraining,
        metricsText,
        stepData,
        stepIdx,
        stepPhase,
        stepHint,
        stepSampleIdx,
        setActiveTab,
        setConfig,
        startTraining,
        stopTraining,
        reinitWeights,
        resetAll,
        doNextStep,
        resetSteps,
        setStepSampleIdx,
      }}
    >
      {children}
    </NNCtx.Provider>
  );
}
"use client";
// src/components/nn/StepByStepTab.tsx
import { useState, useCallback, useEffect } from "react";
import { useNN } from "./NNProvider";
import { S, STYLE, applyStepStyles } from "@/styles/explore.styles";
import { buildSteps } from "@/data/nn.engine";
import { DATASETS } from "@/data/nn.data";
import { NetworkSVG } from "./NetworkSVG";
import type { StepData, Step, ForwardCache } from "@/types/nn.types";
import { backwardAndUpdate, cloneNN } from "@/data/nn.engine";

type Phase = "idle" | "stepping" | "done";

export function StepByStepTab() {
  const { nn, config, setActiveTab } = useNN();
  const ds = DATASETS[config.dataset];

  const [sampleIdx, setSampleIdx] = useState(0);
  const [stepData, setStepData] = useState<StepData | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [hint, setHint] = useState("Select a sample and click Next Step →");
  const [activeStep, setActiveStep] = useState<Step | null>(null);
  const [activeFwd, setActiveFwd] = useState<ForwardCache | null>(null);
  const [isBackward, setIsBackward] = useState(false);

  // Reset when dataset changes
  useEffect(() => {
    setStepData(null);
    setStepIdx(0);
    setPhase("idle");
    setHint("Select a sample and click Next Step →");
    setActiveStep(null);
    setActiveFwd(null);
    setSampleIdx(0);
  }, [config.dataset]);

  const handleReset = useCallback(() => {
    setStepData(null);
    setStepIdx(0);
    setPhase("idle");
    setHint("Select a sample and click Next Step →");
    setActiveStep(null);
    setActiveFwd(null);
  }, []);

  const handleNext = useCallback(() => {
    if (phase === "idle" || phase === "done" || !stepData) {
      const sd = buildSteps(nn, config, sampleIdx);
      setStepData(sd);
      setStepIdx(1);
      setPhase("stepping");
      const step = sd.steps[0];
      setActiveStep(step);
      setActiveFwd(sd.fwd);
      setIsBackward(step.phase === "bwd");
      setHint(`Step 1 / ${sd.steps.length}`);
      return;
    }

    if (stepIdx >= stepData.steps.length) {
      // Apply weight update
      const sample = ds.data[sampleIdx];
      const cloned = cloneNN(nn);
      backwardAndUpdate(cloned, config, stepData.fwd, sample.y);
      setPhase("done");
      setHint("✅ Weights updated! Click Next Step to run another pass.");
      setActiveStep(null);
      return;
    }

    const step = stepData.steps[stepIdx];
    setActiveStep(step);
    setActiveFwd(stepData.fwd);
    setIsBackward(step.phase === "bwd");
    setStepIdx((i) => i + 1);

    const next = stepIdx + 1;
    if (next >= stepData.steps.length) {
      setHint("Click once more to apply weight updates and see them change!");
    } else {
      setHint(`Step ${next} / ${stepData.steps.length}`);
    }
  }, [phase, stepData, stepIdx, sampleIdx, nn, config, ds.data]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        (e.code === "Space" || e.code === "ArrowRight") &&
        e.target instanceof Element &&
        !["INPUT", "SELECT"].includes(e.target.tagName)
      ) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleNext]);

  const totalSteps = stepData?.steps.length ?? 0;

  return (
    <div className={S.gridStep}>
      {/* Controls card */}
      <div className={S.card}>
        <h4 className={S.cardTitle} style={STYLE.fontDisplay}>
          👣 Step-by-Step Walkthrough
        </h4>
        <p className={`${S.stepIntro} mb-3`} style={STYLE.fontMono}>
          Choose a training sample and walk through every single computation —
          forward pass, loss, backprop, and weight update — one click at a time.
        </p>

        <div className={`${S.ctrl} mb-3`}>
          <label className={S.label} style={STYLE.fontMono}>Training Sample</label>
          <select
            className={S.select}
            style={STYLE.fontMono}
            value={sampleIdx}
            onChange={(e) => {
              setSampleIdx(parseInt(e.target.value));
              handleReset();
            }}
          >
            {ds.data.map((d, i) => {
              const yStr = Array.isArray(d.y) ? `[${d.y.join(",")}]` : d.y;
              return (
                <option key={i} value={i}>
                  Sample {i + 1}: x=[{(d.x as number[]).join(",")}] y={yStr}
                </option>
              );
            })}
          </select>
        </div>

        <div className={`${S.btnRow} mb-3`}>
          <button
            className={S.btnPrimary}
            onClick={handleNext}
            style={STYLE.fontDisplay}
          >
            {stepIdx >= totalSteps && phase === "stepping"
              ? "✅ Apply Updates"
              : "⏩ Next Step"}
          </button>
          <button
            className={S.btnOutline}
            onClick={handleReset}
            style={STYLE.fontDisplay}
          >
            ↺ Reset
          </button>
        </div>

        <div
          className={phase === "done" ? S.stepHintDone : S.stepHint}
          style={STYLE.fontMono}
        >
          {hint}
        </div>

        {/* Progress dots */}
        {stepData && (
          <div className={`${S.dotsRow} mt-3`}>
            {stepData.steps.map((s, i) => {
              let dotClass = S.dotBase + " " + S.dotPending;
              if (i < stepIdx) {
                dotClass =
                  S.dotBase +
                  " " +
                  (s.phase === "fwd"
                    ? S.dotFwdDone
                    : s.phase === "bwd"
                      ? S.dotBwdDone
                      : S.dotUpdDone);
              } else if (i === stepIdx - 1) {
                dotClass =
                  S.dotBase +
                  " " +
                  (s.phase === "fwd"
                    ? S.dotFwdActive
                    : s.phase === "bwd"
                      ? S.dotBwdActive
                      : S.dotUpdActive);
              }
              return (
                <div
                  key={i}
                  className={dotClass}
                  title={s.title}
                />
              );
            })}
          </div>
        )}

        {/* Phase legend */}
        <div className={`${S.phaseRow} mt-3`}>
          <span className={S.phaseFwd} style={STYLE.fontMono}>Forward Pass</span>
          <span className={S.phaseBwd} style={STYLE.fontMono}>Backward Pass</span>
          <span className={S.phaseUpd} style={STYLE.fontMono}>Weight Update</span>
        </div>
      </div>

      {/* Step output area */}
      <div className={S.stepOutputArea}>
        {/* Step content card */}
        <div className={`${S.card} flex-1`}>
          <div className={S.stepFlowHeader}>
            <span
              className="font-bold text-[#263D5B] text-sm"
              style={STYLE.fontDisplay}
            >
              {activeStep ? activeStep.title : "🔢 Calculation Steps"}
            </span>
            {stepData && (
              <span className={S.stepCounter} style={STYLE.fontMono}>
                {Math.min(stepIdx, totalSteps)}/{totalSteps}
              </span>
            )}
          </div>

          {activeStep ? (
            <div
              className={S.stepContent}
              style={STYLE.fontMono}
              dangerouslySetInnerHTML={{
                __html: applyStepStyles(activeStep.render()),
              }}
            />
          ) : (
            <div className={S.stepPlaceholder}>
              <div className={S.stepPlaceholderIcon}>🧮</div>
              <p style={STYLE.fontMono}>
                Select a sample and click <strong>Next Step</strong> to begin.
              </p>
              <p
                className="text-[11px] text-[#9ca3af] mt-1"
                style={STYLE.fontMono}
              >
                Each click reveals one computation with full formula breakdown.
              </p>
            </div>
          )}
        </div>

        {/* Mini network card */}
        <div className={S.card}>
          <div className={S.cardHead}>
            <h4 className={S.cardHeadTitle} style={STYLE.fontDisplay}>
              Active Neurons
            </h4>
          </div>
          <NetworkSVG
            compact
            highlightNeurons={activeStep?.highlights.neurons ?? null}
            fwdCache={activeFwd}
            isBackward={isBackward}
          />
        </div>
      </div>
    </div>
  );
}
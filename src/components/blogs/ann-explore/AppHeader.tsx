"use client";
// src/components/nn/AppHeader.tsx
import { useEffect, useState } from "react";
import { useNN } from "./NNProvider";
import { S, STYLE } from "@/styles/explore.styles";
import { DATASETS } from "@/data/nn.data";

export function AppHeader() {
  const { nn, config, lossHistory, accHistory, isTraining } = useNN();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const ds = DATASETS[config.dataset];
  const archLabel = `${ds.inputs} → ${nn.nH} → ${ds.outputSize}`;
  const lastLoss = lossHistory[lossHistory.length - 1];
  const lastAcc = accHistory[accHistory.length - 1];
  const isClass = ds.lossType !== "mse";

  return (
    <header className={S.header} style={STYLE.fontDisplay}>
      <span className="text-2xl select-none">🧠</span>
      <div>
        <h1 className={S.headerTitle} style={STYLE.fontDisplay}>
          Neural Network Explorer
        </h1>
        <p className={S.headerSubtitle} style={STYLE.fontMono}>
          Interactive ANN Visualizer &amp; Trainer
        </p>
      </div>
      <div className={`${S.headerBadges} ml-auto`}>
        <span className={S.badgeBlue} style={STYLE.fontMono}>
          {archLabel}
        </span>
        <span className={S.badgeRed} style={STYLE.fontMono}>
          Loss: {!mounted ? "–" : (lastLoss !== undefined ? lastLoss.toFixed(4) : "–")}
          {isTraining && <span className="ml-1 animate-pulse">●</span>}
        </span>
        {isClass && mounted && lastAcc !== undefined && (
          <span className={S.badgeGreen} style={STYLE.fontMono}>
            Acc: {lastAcc.toFixed(1)}%
          </span>
        )}
      </div>
    </header>
  );
}
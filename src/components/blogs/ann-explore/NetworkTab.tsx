"use client";
// src/components/nn/NetworkTab.tsx
import { S, STYLE } from "@/styles/explore.styles";
import { NetworkSVG } from "./NetworkSVG";
import { ScatterChart } from "./ChartsTab";
import { useNN } from "./NNProvider";
import { forwardPass, f4, computeLoss } from "@/data/nn.engine";
import { DATASETS } from "@/data/nn.data";

export function NetworkTab() {
  const { nn, config, metricsText } = useNN();

  return (
    <div className={S.gridNetwork}>
      {/* Network SVG card */}
      <div className={S.card}>
        <div className={S.cardHead}>
          <h4 className={S.cardHeadTitle} style={STYLE.fontDisplay}>
            🕸 Network Architecture
          </h4>
          <span className={S.cardHeadHint} style={STYLE.fontMono}>
            Positive weights = green · Negative = red · Width = magnitude
          </span>
        </div>
        <NetworkSVG compact={false} />
        <div className={`${S.legendRow} mt-2`}>
          <span className={S.legendDotInput} /> <span style={STYLE.fontMono} className="text-[10px]">Input</span>
          <span className={S.legendDotHidden} /> <span style={STYLE.fontMono} className="text-[10px]">Hidden</span>
          <span className={S.legendDotOutput} /> <span style={STYLE.fontMono} className="text-[10px]">Output</span>
          <span className={`${S.legendPos} text-[10px]`} style={STYLE.fontMono}>━ +weight</span>
          <span className={`${S.legendNeg} text-[10px]`} style={STYLE.fontMono}>━ −weight</span>
        </div>
      </div>

      {/* Right column */}
      <div className={S.rightCol}>
        <div className={S.card}>
          <div className={S.cardHead}>
            <h4 className={S.cardHeadTitle} style={STYLE.fontDisplay}>
              🗺 Data &amp; Decision Boundary
            </h4>
          </div>
          <ScatterChart />
        </div>
        <div className={S.card}>
          <div className={S.cardHead}>
            <h4 className={S.cardHeadTitle} style={STYLE.fontDisplay}>
              📌 Sample Predictions
            </h4>
          </div>
          <MetricsDetail />
        </div>
      </div>
    </div>
  );
}

function MetricsDetail() {
  const { nn, config } = useNN();
  const ds = DATASETS[config.dataset];

  const lines = ds.data.map((sample, i) => {
    const cache = forwardPass(nn, config, sample.x);
    const pred = cache.a2.map(f4).join(",");
    const truth = Array.isArray(sample.y) ? sample.y.join(",") : sample.y;
    const loss = computeLoss(
      config.dataset,
      cache.a2.length === 1 ? cache.a2[0] : cache.a2,
      sample.y
    );
    return `S${i + 1}: ŷ=[${pred}]  y=[${truth}]  L=${f4(loss)}`;
  });

  return (
    <pre className={S.metricsPre} style={STYLE.fontMono}>
      {lines.join("\n") || "—"}
    </pre>
  );
}
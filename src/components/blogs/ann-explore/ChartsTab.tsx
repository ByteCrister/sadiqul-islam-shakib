"use client";
// src/components/nn/ChartsTab.tsx
import { useEffect, useRef } from "react";
import { useNN } from "./NNProvider";
import { S, STYLE, COLOR } from "@/styles/explore.styles";
import { DATASETS } from "@/data/nn.data";
import { forwardPass, getPredClass } from "@/data/nn.engine";
import type {
  Chart as ChartType,
  ChartConfiguration,
  ChartDataset,
  ScatterDataPoint,
} from "chart.js";

// Dynamic import guard for Chart.js
let ChartClass: typeof ChartType | null = null;

async function getChart() {
  if (ChartClass) return ChartClass;
  const { Chart, registerables } = await import("chart.js");
  Chart.register(...registerables);
  ChartClass = Chart as unknown as typeof ChartType;
  return ChartClass;
}

function useLossChart(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  lossHistory: number[]
) {
  const chartRef = useRef<ChartType | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let mounted = true;
    getChart().then((Chart) => {
      if (!mounted || !canvasRef.current) return;
      if (chartRef.current) chartRef.current.destroy();
      const cfg: ChartConfiguration = {
        type: "line",
        data: {
          labels: lossHistory.map((_, i) => i + 1),
          datasets: [
            {
              label: "Loss",
              data: lossHistory,
              borderColor: COLOR.chartLoss,
              backgroundColor: COLOR.chartLossFill,
              borderWidth: 1.5,
              pointRadius: 0,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          animation: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              title: {
                display: true,
                text: "Epoch",
                font: { family: "'JetBrains Mono', monospace", size: 10 },
              },
              ticks: { maxTicksLimit: 8, font: { size: 9 } },
            },
            y: {
              title: {
                display: true,
                text: "Loss",
                font: { family: "'JetBrains Mono', monospace", size: 10 },
              },
              ticks: { font: { size: 9 } },
            },
          },
        },
      };
      chartRef.current = new Chart(canvasRef.current, cfg);
    });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.data.labels = lossHistory.map((_, i) => i + 1);
    chartRef.current.data.datasets[0].data = lossHistory;
    chartRef.current.update("none");
  }, [lossHistory]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
    };
  }, []);
}

function useAccChart(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  accHistory: number[]
) {
  const chartRef = useRef<ChartType | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let mounted = true;
    getChart().then((Chart) => {
      if (!mounted || !canvasRef.current) return;
      if (chartRef.current) chartRef.current.destroy();
      const cfg: ChartConfiguration = {
        type: "line",
        data: {
          labels: accHistory.map((_, i) => i + 1),
          datasets: [
            {
              label: "Accuracy %",
              data: accHistory,
              borderColor: COLOR.chartAcc,
              backgroundColor: COLOR.chartAccFill,
              borderWidth: 1.5,
              pointRadius: 0,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          animation: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { maxTicksLimit: 6, font: { size: 9 } } },
            y: { min: 0, max: 100, ticks: { font: { size: 9 } } },
          },
        },
      };
      chartRef.current = new Chart(canvasRef.current, cfg);
    });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.data.labels = accHistory.map((_, i) => i + 1);
    chartRef.current.data.datasets[0].data = accHistory;
    chartRef.current.update("none");
  }, [accHistory]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
    };
  }, []);
}

export function ChartsTab() {
  const { lossHistory, accHistory, config } = useNN();
  const ds = DATASETS[config.dataset];
  const isClass = ds.lossType !== "mse";

  const lossCanvasRef = useRef<HTMLCanvasElement>(null);
  const accCanvasRef = useRef<HTMLCanvasElement>(null);

  useLossChart(lossCanvasRef, lossHistory);
  useAccChart(accCanvasRef, accHistory);

  return (
    <div className={S.gridCharts}>
      <div className={S.card}>
        <div className={S.cardHead}>
          <h4 className={S.cardHeadTitle} style={STYLE.fontDisplay}>
            📉 Loss Curve
          </h4>
          <span className={S.cardHeadHint} style={STYLE.fontMono}>
            Lower is better
          </span>
        </div>
        <canvas ref={lossCanvasRef} height={200} />
      </div>

      {isClass && (
        <div className={S.card}>
          <div className={S.cardHead}>
            <h4 className={S.cardHeadTitle} style={STYLE.fontDisplay}>
              🎯 Accuracy
            </h4>
            <span className={S.cardHeadHint} style={STYLE.fontMono}>
              % correct predictions
            </span>
          </div>
          <canvas ref={accCanvasRef} height={200} />
        </div>
      )}
    </div>
  );
}

// ─── Scatter chart component ──────────────────────────────────────────────────
export function ScatterChart() {
  const { nn, config } = useNN();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartType | null>(null);

  // Initial chart creation (no boundary yet)
  useEffect(() => {
    if (!canvasRef.current) return;
    let mounted = true;
    const ds = DATASETS[config.dataset];

    getChart().then((Chart) => {
      if (!mounted || !canvasRef.current) return;
      if (chartRef.current) chartRef.current.destroy();

      const datasets: ChartDataset<"scatter">[] = [];

      if (ds.lossType === "mse") {
        datasets.push({
          label: "Data",
          data: ds.data.map((d) => ({ x: (d.x as number[])[0], y: (d.x as number[])[1] })),
          backgroundColor: ds.data.map((d) =>
            `hsl(${Math.round(((d.y as number) / 20) * 120)},70%,50%)`
          ),
          pointRadius: 7,
          showLine: false,
          type: "scatter",
        });
      } else if (ds.lossType === "bce") {
        [0, 1].forEach((cls) =>
          datasets.push({
            label: `Class ${cls}`,
            data: ds.data
              .filter((d) => d.y === cls)
              .map((d) => ({ x: (d.x as number[])[0], y: (d.x as number[])[1] })),
            backgroundColor: ds.classColors![cls],
            pointRadius: 7,
            showLine: false,
            type: "scatter",
          })
        );
      } else {
        [0, 1, 2].forEach((cls) =>
          datasets.push({
            label: `Class ${cls}`,
            data: ds.data
              .filter((d) => (d.y as number[])[cls] === 1)
              .map((d) => ({ x: (d.x as number[])[0], y: (d.x as number[])[1] })),
            backgroundColor: ds.classColors![cls],
            pointRadius: 7,
            showLine: false,
            type: "scatter",
          })
        );
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: "scatter",
        data: { datasets },
        options: {
          responsive: true,
          animation: false,
          plugins: {
            legend: {
              position: "top",
              labels: { font: { size: 9, family: "'JetBrains Mono', monospace" } },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "x₁",
                font: { family: "'JetBrains Mono', monospace", size: 10 },
              },
              ticks: { font: { size: 9 } },
            },
            y: {
              title: {
                display: true,
                text: "x₂",
                font: { family: "'JetBrains Mono', monospace", size: 10 },
              },
              ticks: { font: { size: 9 } },
            },
          },
        },
      });
    });

    return () => {
      mounted = false;
    };
  }, [config.dataset]);

  // Update decision boundary when nn changes
  useEffect(() => {
    if (!chartRef.current) return;
    const ds = DATASETS[config.dataset];
    if (ds.lossType === "mse") return;

    const allX = ds.data.map((d) => (d.x as number[])[0]);
    const allY = ds.data.map((d) => (d.x as number[])[1]);
    const minX = Math.min(...allX) - 0.5;
    const maxX = Math.max(...allX) + 0.5;
    const minY = Math.min(...allY) - 0.5;
    const maxY = Math.max(...allY) + 0.5;
    const GRID = 15;
    const boundaryPoints: ScatterDataPoint[] = [];
    const boundaryColors: string[] = [];

    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const xi = minX + ((maxX - minX) * i) / (GRID - 1);
        const xj = minY + ((maxY - minY) * j) / (GRID - 1);
        const cache = forwardPass(nn, config, [xi, xj]);
        const cls = getPredClass(cache.a2, config.dataset);
        const col = (ds.classColors || ["#49B6E5", "#DC2626"])[cls] + "33";
        boundaryPoints.push({ x: xi, y: xj });
        boundaryColors.push(col);
      }
    }

    const chart = chartRef.current;
    const datasets = chart.data.datasets as ChartDataset<"scatter">[];
    const boundaryIndex = datasets.findIndex((d) => d.label === "__boundary__");
    if (boundaryIndex !== -1) {
      datasets.splice(boundaryIndex, 1);
    }
    datasets.unshift({
      label: "__boundary__",
      data: boundaryPoints,
      backgroundColor: boundaryColors,
      pointRadius: 6,
      showLine: false,
      type: "scatter",
    });
    chart.update("none");
  }, [nn, config]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} height={180} />;
}
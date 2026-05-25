"use client";
// src/components/nn/Sidebar.tsx
import { useNN } from "./NNProvider";
import { S, STYLE } from "@/styles/explore.styles";
import type { DatasetKey, ActivationKey, OptimiserKey } from "@/types/nn.types";
import { DATASETS } from "@/data/nn.data";

const DATASET_OPTIONS: { value: DatasetKey; label: string; emoji: string }[] = [
    { value: "linear", label: "Linear Regression", emoji: "📈" },
    { value: "binary", label: "Binary (XOR)", emoji: "⚡" },
    { value: "categorical", label: "Multi-class (3)", emoji: "🎨" },
];

export function Sidebar() {
    const {
        config,
        setConfig,
        isTraining,
        currentEpoch,
        totalEpochs,
        lossHistory,
        accHistory,
        startTraining,
        stopTraining,
        reinitWeights,
        resetAll,
    } = useNN();

    const ds = DATASETS[config.dataset];
    const isClass = ds.lossType !== "mse";
    const lastLoss = lossHistory[lossHistory.length - 1];
    const lastAcc = accHistory[accHistory.length - 1];
    const progress = totalEpochs > 0 ? (currentEpoch / totalEpochs) * 100 : 0;

    return (
        <aside className={S.sidebar} style={STYLE.scrollbarThin}>
            {/* Dataset */}
            <section className={S.card}>
                <h3 className={S.cardTitle}>📊 Dataset</h3>
                <div className="flex flex-col gap-1.5">
                    {DATASET_OPTIONS.map((opt) => (
                        <label
                            key={opt.value}
                            className={
                                config.dataset === opt.value
                                    ? S.datasetActive
                                    : S.datasetInactive
                            }
                        >
                            <input
                                type="radio"
                                name="dataset"
                                value={opt.value}
                                checked={config.dataset === opt.value}
                                onChange={() => setConfig({ dataset: opt.value })}
                                className="hidden"
                            />
                            <span>{opt.emoji}</span>
                            <span className="text-xs">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* Network Config */}
            <section className={S.card}>
                <h3 className={S.cardTitle}>⚙️ Network Config</h3>

                <div className={S.ctrl}>
                    <label className={S.label} style={STYLE.fontMono}>
                        Hidden Neurons (N)
                        <Tip text="More neurons = more capacity to learn complex patterns, but risk overfitting." />
                    </label>
                    <input
                        type="range"
                        min={2}
                        max={8}
                        value={config.hiddenSize}
                        onChange={(e) => setConfig({ hiddenSize: parseInt(e.target.value) })}
                        className={S.rangeAccent}
                    />
                    <div className="text-right text-[10px] text-[#263D5B]" style={STYLE.fontMono}>
                        N = {config.hiddenSize}
                    </div>
                </div>

                <div className={S.ctrl}>
                    <label className={S.label} style={STYLE.fontMono}>
                        Hidden Activation
                        <Tip text="Non-linear function applied after weighted sum. Enables learning complex patterns." />
                    </label>
                    <select
                        className={S.select}
                        style={STYLE.fontMono}
                        value={config.activation}
                        onChange={(e) =>
                            setConfig({ activation: e.target.value as ActivationKey })
                        }
                    >
                        <option value="sigmoid">Sigmoid σ(z)</option>
                        <option value="relu">ReLU max(0,z)</option>
                        <option value="tanh">Tanh tanh(z)</option>
                    </select>
                </div>

                <div className={S.ctrl}>
                    <label className={S.label} style={STYLE.fontMono}>Optimiser</label>
                    <select
                        className={S.select}
                        style={STYLE.fontMono}
                        value={config.optimiser}
                        onChange={(e) =>
                            setConfig({ optimiser: e.target.value as OptimiserKey })
                        }
                    >
                        <option value="sgd">SGD</option>
                        <option value="momentum">Momentum</option>
                        <option value="adam">Adam</option>
                    </select>
                </div>

                <div className={S.ctrl}>
                    <label className={S.label} style={STYLE.fontMono}>
                        Learning Rate (η)
                    </label>
                    <input
                        type="range"
                        min={-3}
                        max={1}
                        step={0.1}
                        value={Math.log10(config.lr)}
                        onChange={(e) =>
                            setConfig({ lr: Math.pow(10, parseFloat(e.target.value)) })
                        }
                        className={S.rangeAccent}
                    />
                    <div className="text-right text-[10px] text-[#263D5B]" style={STYLE.fontMono}>
                        η = {config.lr.toFixed(4)}
                    </div>
                </div>

                {(config.optimiser === "momentum" || config.optimiser === "adam") && (
                    <div className={S.ctrl}>
                        <label className={S.label} style={STYLE.fontMono}>Momentum β</label>
                        <input
                            type="number"
                            className={S.input}
                            style={STYLE.fontMono}
                            value={config.momentumBeta}
                            min={0}
                            max={0.999}
                            step={0.01}
                            onChange={(e) =>
                                setConfig({ momentumBeta: parseFloat(e.target.value) })
                            }
                        />
                    </div>
                )}

                {config.optimiser === "adam" && (
                    <>
                        <div className={S.ctrl}>
                            <label className={S.label} style={STYLE.fontMono}>Adam β₁</label>
                            <input
                                type="number"
                                className={S.input}
                                style={STYLE.fontMono}
                                value={config.adamB1}
                                min={0}
                                max={0.999}
                                step={0.01}
                                onChange={(e) =>
                                    setConfig({ adamB1: parseFloat(e.target.value) })
                                }
                            />
                        </div>
                        <div className={S.ctrl}>
                            <label className={S.label} style={STYLE.fontMono}>Adam β₂</label>
                            <input
                                type="number"
                                className={S.input}
                                style={STYLE.fontMono}
                                value={config.adamB2}
                                min={0}
                                max={0.9999}
                                step={0.0001}
                                onChange={(e) =>
                                    setConfig({ adamB2: parseFloat(e.target.value) })
                                }
                            />
                        </div>
                        <div className={S.ctrl}>
                            <label className={S.label} style={STYLE.fontMono}>Adam ε</label>
                            <input
                                type="number"
                                className={S.input}
                                style={STYLE.fontMono}
                                value={config.adamEps}
                                step={1e-9}
                                onChange={(e) =>
                                    setConfig({ adamEps: parseFloat(e.target.value) })
                                }
                            />
                        </div>
                    </>
                )}
            </section>

            {/* Training */}
            <section className={S.card}>
                <h3 className={S.cardTitle}>🏋️ Training</h3>
                <div className={`${S.ctrl} mb-3`}>
                    <label className={S.label} style={STYLE.fontMono}>Epochs</label>
                    <input
                        type="number"
                        className={S.input}
                        style={STYLE.fontMono}
                        value={config.epochs}
                        min={10}
                        max={2000}
                        step={10}
                        onChange={(e) => setConfig({ epochs: parseInt(e.target.value) })}
                    />
                </div>

                <div className={S.btnRow}>
                    <button
                        className={S.btnPrimary}
                        onClick={startTraining}
                        style={STYLE.fontDisplay}
                    >
                        ▶ Train
                    </button>
                    <button
                        className={S.btnOutline}
                        onClick={stopTraining}
                        style={STYLE.fontDisplay}
                    >
                        ⏹ Stop
                    </button>
                </div>

                <div className={`${S.progressTrack} my-2`}>
                    <div
                        className={S.progressFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className={`${S.metricsEpoch} text-center mb-2`} style={STYLE.fontMono}>
                    {currentEpoch > 0
                        ? currentEpoch >= totalEpochs && !isTraining
                            ? `Done! (${totalEpochs} epochs)`
                            : `Epoch ${currentEpoch} / ${totalEpochs}`
                        : "—"}
                </div>

                <div className={S.metricsRow}>
                    <span className={S.metricsLabel} style={STYLE.fontMono}>Loss</span>
                    <span className={S.metricsLoss} style={STYLE.fontMono}>
                        {lastLoss !== undefined ? lastLoss.toFixed(5) : "—"}
                    </span>
                </div>
                {isClass && (
                    <div className={S.metricsRow}>
                        <span className={S.metricsLabel} style={STYLE.fontMono}>Accuracy</span>
                        <span className={S.metricsAcc} style={STYLE.fontMono}>
                            {lastAcc !== undefined ? `${lastAcc.toFixed(1)}%` : "—"}
                        </span>
                    </div>
                )}
            </section>

            {/* Weights */}
            <section className={S.card}>
                <h3 className={S.cardTitle}>🎲 Weights</h3>
                <div className={`${S.btnRow} flex-col gap-2`}>
                    <button
                        className={S.btnOutline}
                        onClick={reinitWeights}
                        style={STYLE.fontDisplay}
                    >
                        🔀 Re-initialise
                    </button>
                    <button
                        className={S.btnDanger}
                        onClick={resetAll}
                        style={STYLE.fontDisplay}
                    >
                        🗑 Reset All
                    </button>
                </div>
            </section>
        </aside>
    );
}

function Tip({ text }: { text: string }) {
    return (
        <span className="relative inline-block ml-1 cursor-help group">
            <span className="text-[#263D5B] text-xs">❓</span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[#1C202B] text-white text-[10px] rounded px-2 py-1 w-44 leading-relaxed z-50 shadow-lg whitespace-normal pointer-events-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {text}
            </span>
        </span>
    );
}
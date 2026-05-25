// src/lib/nn.engine.ts
import type {
    NNState,
    TrainConfig,
    ForwardCache,
    BackwardResult,
    Step,
    StepData,
    DatasetKey,
} from "@/types/nn.types";
import { DATASETS } from "./nn.data";

// ─── Deterministic random generator (fixed seed) ─────────────────────────────
function createSeededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

// ─── Activation Functions ─────────────────────────────────────────────────────
export const ACT = {
    sigmoid: {
        f: (z: number) => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z)))),
        df: (a: number) => a * (1 - a),
        name: "σ(z) = 1/(1+e⁻ᶻ)",
        dfName: "σ'= σ(1-σ)",
    },
    relu: {
        f: (z: number) => Math.max(0, z),
        df: (a: number) => (a > 0 ? 1 : 0),
        name: "max(0,z)",
        dfName: "f'= 1 if a>0 else 0",
    },
    tanh: {
        f: (z: number) => Math.tanh(z),
        df: (a: number) => 1 - a * a,
        name: "tanh(z)",
        dfName: "f'= 1-tanh²(z)",
    },
    linear: {
        f: (z: number) => z,
        df: (_: number) => 1,
        name: "z (identity)",
        dfName: "f'= 1",
    },
    softmax: {
        fVec: (z: number[]) => {
            const mx = Math.max(...z);
            const ex = z.map((v) => Math.exp(v - mx));
            const s = ex.reduce((a, b) => a + b, 0);
            return ex.map((e) => e / s);
        },
        name: "softmax(z)",
        dfName: "δ = ŷ-y (combined w/ CCE)",
    },
};

// ─── Network Initialisation ───────────────────────────────────────────────────
export function initNetwork(dataset: DatasetKey, hiddenSize: number): NNState {
    const ds = DATASETS[dataset];
    const nIn = ds.inputs;
    const nH = hiddenSize;
    const nOut = ds.outputSize;

    // Use deterministic random with fixed seed (42)
    const rand = createSeededRandom(42);
    const mat = (r: number, c: number) =>
        Array.from({ length: r }, () => Array.from({ length: c }, () => rand() * 1.6 - 0.8));
    const vec = (n: number) => Array.from({ length: n }, () => rand() * 1.6 - 0.8);
    const zeroMat = (r: number, c: number) =>
        Array.from({ length: r }, () => Array(c).fill(0));
    const zeroVec = (n: number) => Array(n).fill(0);

    return {
        W1: mat(nH, nIn),
        b1: vec(nH),
        W2: mat(nOut, nH),
        b2: vec(nOut),
        mW1: zeroMat(nH, nIn),
        vW1: zeroMat(nH, nIn),
        mb1: zeroVec(nH),
        vb1: zeroVec(nH),
        mW2: zeroMat(nOut, nH),
        vW2: zeroMat(nOut, nH),
        mb2: zeroVec(nOut),
        vb2: zeroVec(nOut),
        t: 0,
        nIn,
        nH,
        nOut,
    };
}

// ─── Deep clone a NNState ─────────────────────────────────────────────────────
export function cloneNN(nn: NNState): NNState {
    return JSON.parse(JSON.stringify(nn));
}

// ─── Forward Pass ─────────────────────────────────────────────────────────────
export function forwardPass(
    nn: NNState,
    config: TrainConfig,
    x: number[]
): ForwardCache {
    const ds = DATASETS[config.dataset];
    const act = ACT[config.activation];
    const z1 = nn.W1.map((wRow, j) =>
        wRow.reduce((s, w, i) => s + w * x[i], 0) + nn.b1[j]
    );
    const a1 = z1.map((z) => act.f(z));
    const z2 = nn.W2.map((wRow) =>
        wRow.reduce((s, w, j) => s + w * a1[j], 0)
    ).map((v, k) => v + nn.b2[k]);
    let a2: number[];
    if (ds.outputActivation === "softmax") {
        a2 = ACT.softmax.fVec(z2);
    } else if (ds.outputActivation === "sigmoid") {
        a2 = z2.map((z) => ACT.sigmoid.f(z));
    } else {
        a2 = z2.slice();
    }
    return { x, z1, a1, z2, a2 };
}

// ─── Loss ─────────────────────────────────────────────────────────────────────
export function computeLoss(
    dataset: DatasetKey,
    pred: number | number[],
    yTrue: number | number[]
): number {
    const ds = DATASETS[dataset];
    const ys = Array.isArray(yTrue) ? yTrue : [yTrue];
    const ps = Array.isArray(pred) ? pred : [pred];
    if (ds.lossType === "mse")
        return 0.5 * ps.reduce((s, p, i) => s + Math.pow(p - ys[i], 2), 0);
    if (ds.lossType === "bce") {
        const eps = 1e-12;
        return -ys.reduce(
            (s, y, i) =>
                s + y * Math.log(ps[i] + eps) + (1 - y) * Math.log(1 - ps[i] + eps),
            0
        );
    }
    const eps = 1e-12;
    return -ys.reduce((s, y, i) => s + y * Math.log(ps[i] + eps), 0);
}

// ─── Backward + Update ───────────────────────────────────────────────────────
function clampGrad(g: number) {
    return Math.max(-5, Math.min(5, g));
}

function applyUpdate(
    param: number[] | number[][],
    grad: number[] | number[][],
    m: number[] | number[][],
    v: number[] | number[][],
    config: TrainConfig,
    t: number,
    type: "matrix" | "vector"
) {
    const lr = config.lr;
    const opt = config.optimiser;
    if (type === "matrix") {
        (param as number[][]).forEach((row, i) => {
            row.forEach((_, j) => {
                const g = clampGrad((grad as number[][])[i][j]);
                if (opt === "sgd") {
                    row[j] -= lr * g;
                } else if (opt === "momentum") {
                    const beta = config.momentumBeta;
                    (m as number[][])[i][j] =
                        beta * (m as number[][])[i][j] + (1 - beta) * g;
                    row[j] -= lr * (m as number[][])[i][j];
                } else {
                    const b1 = config.adamB1,
                        b2 = config.adamB2,
                        eps = config.adamEps;
                    (m as number[][])[i][j] =
                        b1 * (m as number[][])[i][j] + (1 - b1) * g;
                    (v as number[][])[i][j] =
                        b2 * (v as number[][])[i][j] + (1 - b2) * g * g;
                    const mH =
                        (m as number[][])[i][j] / (1 - Math.pow(b1, t));
                    const vH =
                        (v as number[][])[i][j] / (1 - Math.pow(b2, t));
                    row[j] -= (lr * mH) / (Math.sqrt(vH) + eps);
                }
            });
        });
    } else {
        (param as number[]).forEach((_, i) => {
            const g = clampGrad((grad as number[])[i]);
            if (opt === "sgd") {
                (param as number[])[i] -= lr * g;
            } else if (opt === "momentum") {
                const beta = config.momentumBeta;
                (m as number[])[i] = beta * (m as number[])[i] + (1 - beta) * g;
                (param as number[])[i] -= lr * (m as number[])[i];
            } else {
                const b1 = config.adamB1,
                    b2 = config.adamB2,
                    eps = config.adamEps;
                (m as number[])[i] = b1 * (m as number[])[i] + (1 - b1) * g;
                (v as number[])[i] = b2 * (v as number[])[i] + (1 - b2) * g * g;
                const mH = (m as number[])[i] / (1 - Math.pow(b1, t));
                const vH = (v as number[])[i] / (1 - Math.pow(b2, t));
                (param as number[])[i] -= (lr * mH) / (Math.sqrt(vH) + eps);
            }
        });
    }
}

export function backwardAndUpdate(
    nn: NNState,
    config: TrainConfig,
    cache: ForwardCache,
    yTrue: number | number[]
): BackwardResult {
    const { x, a1, a2 } = cache;
    const ys = Array.isArray(yTrue) ? yTrue : [yTrue];
    const act = ACT[config.activation];

    const delta2 = a2.map((a, i) => a - ys[i]);
    const dW2 = delta2.map((d) => a1.map((h: number) => d * h));
    const db2 = delta2.slice();

    const delta1 = a1.map((a, j) => {
        const sum = delta2.reduce((s, d, k) => s + d * nn.W2[k][j], 0);
        return sum * act.df(a);
    });
    const dW1 = delta1.map((d) => x.map((xi: number) => d * xi));
    const db1 = delta1.slice();

    nn.t++;
    applyUpdate(nn.W1, dW1, nn.mW1, nn.vW1, config, nn.t, "matrix");
    applyUpdate(nn.b1, db1, nn.mb1, nn.vb1, config, nn.t, "vector");
    applyUpdate(nn.W2, dW2, nn.mW2, nn.vW2, config, nn.t, "matrix");
    applyUpdate(nn.b2, db2, nn.mb2, nn.vb2, config, nn.t, "vector");

    return { delta2, delta1, dW2, db2, dW1, db1 };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const f4 = (v: number) => (isFinite(v) ? v.toFixed(4) : "—");
export const f2 = (v: number) => (isFinite(v) ? v.toFixed(2) : "—");

export function getPredClass(a2: number[], dataset: DatasetKey): number {
    const ds = DATASETS[dataset];
    return ds.outputSize === 1
        ? a2[0] >= 0.5
            ? 1
            : 0
        : a2.indexOf(Math.max(...a2));
}

export function getTrueClass(y: number | number[]): number {
    if (!Array.isArray(y)) return y;
    return y.indexOf(Math.max(...y));
}

// ─── Step Builder ─────────────────────────────────────────────────────────────
export function buildSteps(
    nn: NNState,
    config: TrainConfig,
    sampleIdx: number
): StepData {
    const ds = DATASETS[config.dataset];
    const sample = ds.data[sampleIdx];
    const x = sample.x;
    const yTrue = sample.y;
    const act = ACT[config.activation];
    const steps: Step[] = [];
    const fwd = forwardPass(nn, config, x);
    const ys = Array.isArray(yTrue) ? yTrue : [yTrue];

    // Forward: inputs
    steps.push({
        title: "➡️ Forward: Set Inputs",
        phase: "fwd",
        highlights: { neurons: [0, 1], connections: [] },
        render: () => `<span class="phase-banner fwd">FORWARD PASS</span>
<span class="formula">Step 1 — Feed input features into the network</span>

x₁ = <span class="highlight">${x[0]}</span>
x₂ = <span class="highlight">${x[1]}</span>

Each input neuron passes its raw value (no computation)
directly to all neurons in the hidden layer.`,
    });

    // Hidden neurons
    for (let j = 0; j < nn.nH; j++) {
        const terms = nn.W1[j].map((w, i) => `${f4(w)}×${x[i]}`).join(" + ");
        const z = fwd.z1[j];
        const a = fwd.a1[j];
        steps.push({
            title: `➡️ Hidden Neuron h${j + 1}`,
            phase: "fwd",
            highlights: { neurons: [0, 1, 2 + j], connections: [j] },
            render: () => `<span class="phase-banner fwd">FORWARD PASS — Hidden Layer</span>
<span class="formula">Weighted Sum z[h${j + 1}]  (dot product + bias)</span>

z[h${j + 1}] = ${nn.W1[j].map((_, i) => `w${j + 1}${i + 1}·x${i + 1}`).join(" + ")} + b${j + 1}
       = ${terms} + ${f4(nn.b1[j])}
<span class="highlight">z[h${j + 1}] = ${f4(z)}</span>

<span class="formula">Activation function: ${config.activation}</span>
a[h${j + 1}] = ${act.name.replace("z", "(" + f4(z) + ")")}
<span class="result">a[h${j + 1}] = ${f4(a)}</span>

💡 The weight controls HOW MUCH each input influences this neuron.
   The bias shifts the activation threshold.`,
        });
    }

    // Output neurons
    const outActName = ds.outputActivation;
    for (let k = 0; k < nn.nOut; k++) {
        const terms = nn.W2[k].map((w, j) => `${f4(w)}×${f4(fwd.a1[j])}`).join(" + ");
        const z = fwd.z2[k];
        const a = fwd.a2[k];
        steps.push({
            title: `➡️ Output Neuron o${k + 1}`,
            phase: "fwd",
            highlights: { neurons: [2 + nn.nH + k], connections: [] },
            render: () => {
                let actLine = "";
                if (outActName === "softmax")
                    actLine = `\n<span class="formula">Softmax converts all z2 scores to probabilities</span>\n<span class="result">a[o${k + 1}] = ${f4(a)}  (probability)</span>`;
                else if (outActName === "sigmoid")
                    actLine = `\nActivation (sigmoid): σ(${f4(z)})\n<span class="result">a[o${k + 1}] = ${f4(a)}  (0–1 probability)</span>`;
                else
                    actLine = `\nActivation (linear): output = z\n<span class="result">ŷ = ${f4(a)}</span>`;
                return `<span class="phase-banner fwd">FORWARD PASS — Output Layer</span>
<span class="formula">Weighted Sum z[o${k + 1}]</span>

z[o${k + 1}] = ${nn.W2[k].map((_, j) => `w_h${j + 1}o${k + 1}·a[h${j + 1}]`).join(" + ")} + b_o${k + 1}
       = ${terms} + ${f4(nn.b2[k])}
<span class="highlight">z[o${k + 1}] = ${f4(z)}</span>
${actLine}`;
            },
        });
    }

    // Loss
    const loss = computeLoss(
        config.dataset,
        fwd.a2.length === 1 ? fwd.a2[0] : fwd.a2,
        yTrue
    );
    steps.push({
        title: "📉 Compute Loss",
        phase: "fwd",
        highlights: { neurons: [], connections: [] },
        render: () => {
            let lossLine = "";
            if (ds.lossType === "mse")
                lossLine = `L = ½(ŷ − y)²\n  = ½(${f4(fwd.a2[0])} − ${ys[0]})²`;
            else if (ds.lossType === "bce")
                lossLine = `L = −y·log(ŷ) − (1−y)·log(1−ŷ)\n  = −${ys[0]}·log(${f4(fwd.a2[0])}) − ${1 - ys[0]}·log(${f4(1 - fwd.a2[0])})`;
            else
                lossLine = `L = −Σ yᵢ·log(ŷᵢ)\n  = ${ys.map((y, i) => `−${y}·log(${f4(fwd.a2[i])})`)
                    .join(" + ")}`;
            return `<span class="phase-banner fwd">FORWARD PASS — Loss</span>
<span class="formula">Loss function: ${ds.lossType.toUpperCase()}</span>

${lossLine}
<span class="highlight">Loss L = ${f4(loss)}</span>

Prediction ŷ = [${fwd.a2.map(f4).join(", ")}]
True label y = [${ys.join(", ")}]

💡 The loss measures HOW WRONG the prediction is.
   Backprop will compute how to change each weight to reduce it.`;
        },
    });

    // Backward
    const delta2 = fwd.a2.map((a, i) => a - ys[i]);
    const dW2 = delta2.map((d) => fwd.a1.map((h) => d * h));
    const db2 = delta2.slice();
    const delta1 = fwd.a1.map((a, j) => {
        const sum = delta2.reduce((s, d, k) => s + d * nn.W2[k][j], 0);
        return sum * act.df(a);
    });
    const dW1 = delta1.map((d) => x.map((xi) => d * xi));
    const db1 = delta1.slice();

    steps.push({
        title: "⬅️ Backward: Output δ",
        phase: "bwd",
        highlights: {
            neurons: Array.from({ length: nn.nOut }, (_, k) => 2 + nn.nH + k),
            connections: [],
        },
        render: () => {
            const note =
                ds.lossType === "mse"
                    ? "∂L/∂ŷ = (ŷ−y)  and  ∂ŷ/∂z = 1  (linear)\n→ δ = ŷ − y"
                    : ds.lossType === "bce"
                        ? "BCE + Sigmoid combined gradient simplifies to:\n→ δ = ŷ − y  (no need to multiply separately!)"
                        : "CCE + Softmax combined gradient simplifies to:\n→ δ = ŷ − y  (elegant result from chain rule!)";
            return `<span class="phase-banner bwd">BACKWARD PASS — Output Layer</span>
<span class="formula">Output delta δ (error signal at output)</span>

${note}

${delta2.map((d, k) => `<span class="grad">δ[o${k + 1}] = ŷ − y = ${f4(fwd.a2[k])} − ${ys[k]} = ${f4(d)}</span>`).join("\n")}

💡 δ is the "blame" — how much is the output neuron
   responsible for the error? We'll propagate this backward.`;
        },
    });

    steps.push({
        title: "⬅️ Output Weight Gradients",
        phase: "bwd",
        highlights: { neurons: [], connections: [] },
        render: () => {
            let lines =
                "∂L/∂W₂[k,j] = δ[ok] × a[hj]  (chain rule)\n∂L/∂b₂[k]   = δ[ok]\n\n";
            delta2.forEach((d, k) => {
                fwd.a1.forEach((h, j) => {
                    lines += `dW₂[o${k + 1},h${j + 1}] = ${f4(d)} × ${f4(h)} = <span class="grad">${f4(dW2[k][j])}</span>\n`;
                });
                lines += `db₂[o${k + 1}] = <span class="grad">${f4(db2[k])}</span>\n\n`;
            });
            return `<span class="phase-banner bwd">BACKWARD PASS — Output Gradients</span>
<span class="formula">How much does each W₂ weight affect the loss?</span>

${lines}💡 Positive gradient → weight currently too large (should decrease).
   Negative gradient → weight too small (should increase).`;
        },
    });

    steps.push({
        title: "⬅️ Hidden Layer δ",
        phase: "bwd",
        highlights: {
            neurons: Array.from({ length: nn.nH }, (_, j) => 2 + j),
            connections: [],
        },
        render: () => {
            let lines =
                "δ[hj] = (Σₖ δ[ok] × W₂[k,j]) × f'(z[hj])\n\n";
            fwd.a1.forEach((a, j) => {
                const backsum = delta2.reduce((s, d, k) => s + d * nn.W2[k][j], 0);
                const deriv = act.df(a);
                lines += `h${j + 1}: back-propagated sum = Σ(δ·w) = ${f4(backsum)}\n`;
                lines += `     activation derivative f'(z[h${j + 1}]) = ${f4(deriv)} [${config.activation}]\n`;
                lines += `<span class="grad">δ[h${j + 1}] = ${f4(backsum)} × ${f4(deriv)} = ${f4(delta1[j])}</span>\n\n`;
            });
            return `<span class="phase-banner bwd">BACKWARD PASS — Hidden Layer</span>
<span class="formula">Chain rule: propagate error backward through hidden layer</span>

${lines}💡 This is the CHAIN RULE in action — error flows backward
   through the activation function's derivative.`;
        },
    });

    steps.push({
        title: "⬅️ Hidden Weight Gradients",
        phase: "bwd",
        highlights: { neurons: [], connections: [] },
        render: () => {
            let lines =
                "∂L/∂W₁[j,i] = δ[hj] × xᵢ\n∂L/∂b₁[j]   = δ[hj]\n\n";
            delta1.forEach((d, j) => {
                x.forEach((xi, i) => {
                    lines += `dW₁[h${j + 1},x${i + 1}] = ${f4(d)} × ${xi} = <span class="grad">${f4(dW1[j][i])}</span>\n`;
                });
                lines += `db₁[h${j + 1}] = <span class="grad">${f4(db1[j])}</span>\n\n`;
            });
            return `<span class="phase-banner bwd">BACKWARD PASS — Hidden Gradients</span>
<span class="formula">How much does each W₁ weight affect the loss?</span>

${lines}💡 Every single weight now has a gradient — its personal
   instruction: "increase me" or "decrease me" to reduce loss.`;
        },
    });

    steps.push({
        title: "✅ Apply Weight Update",
        phase: "update",
        highlights: { neurons: [], connections: [] },
        render: () => {
            const opt = config.optimiser;
            let formula = "";
            if (opt === "sgd")
                formula = `w ← w − η × ∂L/∂w\nb ← b − η × ∂L/∂b\n\nη (learning rate) = ${config.lr}`;
            else if (opt === "momentum")
                formula = `v  = β·v + (1−β)·g       [β=${config.momentumBeta}]\nw ← w − η·v\n\nη = ${config.lr}`;
            else
                formula = `m = β₁m + (1−β₁)g       [β₁=${config.adamB1}]\nv = β₂v + (1−β₂)g²     [β₂=${config.adamB2}]\nm̂ = m/(1−β₁ᵗ)  ← bias correction\nv̂ = v/(1−β₂ᵗ)\nw ← w − η·m̂/(√v̂+ε)   [ε=${config.adamEps}]\n\nη = ${config.lr},  t = ${nn.t + 1}`;

            const g = dW1[0][0];
            const w_old = nn.W1[0][0];
            let ex = "";
            if (opt === "sgd") {
                ex = `Example: W₁[h1,x1]\n  w_old = ${f4(w_old)}\n  grad  = ${f4(g)}\n  w_new = ${f4(w_old)} − ${config.lr} × ${f4(g)} = <span class="result">${f4(w_old - config.lr * g)}</span>`;
            } else {
                ex = `Click "Next Step" once more to apply the updates\nand see the network weights change in real time!`;
            }

            return `<span class="phase-banner upd">WEIGHT UPDATE — Optimiser: ${opt.toUpperCase()}</span>
<span class="formula">Apply gradient descent to all weights and biases</span>

${formula}

<span class="formula">Sample calculation (W₁[h1,x1]):</span>
${ex}

💡 After this step, ALL weights and biases are updated.
   Run another pass — the loss should be a little lower!`;
        },
    });

    return { steps, fwd, delta2, delta1, dW2, db2, dW1, db1 };
}

// ─── SVG Drawing ─────────────────────────────────────────────────────────────
const SVG_W = 640;
const NEURON_R = 22;

export function getWeightColor(w: number): string {
    const i = Math.min(1, Math.abs(w) / 2);
    return w > 0
        ? `rgb(0,${Math.round(100 + 100 * i)},60)`
        : `rgb(${Math.round(150 + 100 * i)},0,40)`;
}

export function buildNetworkSVG(
    nn: NNState,
    config: TrainConfig,
    svgH: number,
    highlightNeurons: number[] | null,
    fwdCache: ForwardCache | null,
    compact: boolean,
    isBackward: boolean
): string {
    const ds = DATASETS[config.dataset];
    const layers = [
        { count: ds.inputs, x: 90, label: "Input" },
        { count: nn.nH, x: 320, label: "Hidden" },
        { count: ds.outputSize, x: 560, label: "Output" },
    ].map((layer) => {
        const spacing = Math.min(72, (svgH - 60) / layer.count);
        const startY = svgH / 2 - ((layer.count - 1) * spacing) / 2;
        return {
            ...layer,
            positions: Array.from({ length: layer.count }, (_, i) => ({
                x: layer.x,
                y: startY + i * spacing,
            })),
        };
    });

    const svgId = compact ? "step" : "main";
    let html = `<defs>
    <filter id="glow${svgId}">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

    // Layer labels
    [
        ["Input", "#1d4ed8"],
        ["Hidden", "#78350f"],
        ["Output", "#14532d"],
    ].forEach(([lbl, col], li) => {
        const x = layers[li].x;
        html += `<text x="${x}" y="18" text-anchor="middle" font-family="var(--font-bangers), cursive" font-size="11" fill="${col}" font-weight="bold">${lbl}</text>`;
        html += `<text x="${x}" y="30" text-anchor="middle" font-family="var(--font-jetbrains), monospace" font-size="9" fill="#9ca3af">(${layers[li].count} neuron${layers[li].count > 1 ? "s" : ""})</text>`;
    });

    // Input → Hidden connections
    for (let j = 0; j < nn.nH; j++) {
        for (let i = 0; i < ds.inputs; i++) {
            const p1 = layers[0].positions[i];
            const p2 = layers[1].positions[j];
            const w = nn.W1[j][i];
            const col = getWeightColor(w);
            const active =
                highlightNeurons?.includes(i) && highlightNeurons?.includes(2 + j);
            const strokeW = active ? 3 : 1.2;
            const opacity = active ? 1 : 0.35;
            html += `<line x1="${p1.x + NEURON_R}" y1="${p1.y}" x2="${p2.x - NEURON_R}" y2="${p2.y}" stroke="${col}" stroke-width="${strokeW}" opacity="${opacity}"/>`;
            if (!compact) {
                const mx = (p1.x + p2.x) / 2 + (j % 2 === 0 ? 5 : -5);
                const my = (p1.y + p2.y) / 2 + (i % 2 === 0 ? -5 : 5);
                html += `<text x="${mx}" y="${my}" font-family="var(--font-jetbrains), monospace" font-size="8" fill="${col}" text-anchor="middle" opacity="${active ? 1 : 0.6}">${f2(w)}</text>`;
            }
        }
    }

    // Hidden → Output connections
    for (let k = 0; k < ds.outputSize; k++) {
        for (let j = 0; j < nn.nH; j++) {
            const p1 = layers[1].positions[j];
            const p2 = layers[2].positions[k];
            const w = nn.W2[k][j];
            const col = getWeightColor(w);
            const active =
                highlightNeurons?.includes(2 + j) &&
                highlightNeurons?.includes(2 + nn.nH + k);
            const strokeW = active ? 3 : 1.2;
            const opacity = active ? 1 : 0.35;
            html += `<line x1="${p1.x + NEURON_R}" y1="${p1.y}" x2="${p2.x - NEURON_R}" y2="${p2.y}" stroke="${col}" stroke-width="${strokeW}" opacity="${opacity}"/>`;
            if (!compact) {
                const mx = (p1.x + p2.x) / 2;
                const my = (p1.y + p2.y) / 2 - 4;
                html += `<text x="${mx}" y="${my}" font-family="var(--font-jetbrains), monospace" font-size="8" fill="${col}" text-anchor="middle" opacity="${active ? 1 : 0.6}">${f2(w)}</text>`;
            }
        }
    }

    let neuronIdx = 0;

    // Input neurons
    layers[0].positions.forEach((pos, i) => {
        const active = highlightNeurons?.includes(neuronIdx) ?? false;
        const fillColor = active
            ? isBackward
                ? "#fb923c"
                : "#fbbf24"
            : "#dbeafe";
        const filterStr = active ? `filter="url(#glow${svgId})"` : "";
        html += `<circle cx="${pos.x}" cy="${pos.y}" r="${NEURON_R}" fill="${fillColor}" stroke="#111827" stroke-width="2" ${filterStr}/>`;
        html += `<text x="${pos.x}" y="${pos.y - 7}" text-anchor="middle" font-family="var(--font-bangers), cursive" font-size="10" fill="#111827">x${i + 1}</text>`;
        if (fwdCache) {
            html += `<text x="${pos.x}" y="${pos.y + 7}" text-anchor="middle" font-family="var(--font-jetbrains), monospace" font-size="9" fill="#1d4ed8">${f2(fwdCache.x[i])}</text>`;
        } else {
            html += `<text x="${pos.x}" y="${pos.y + 7}" text-anchor="middle" font-family="var(--font-jetbrains), monospace" font-size="9" fill="#6b7280">in</text>`;
        }
        neuronIdx++;
    });

    // Hidden neurons
    layers[1].positions.forEach((pos, j) => {
        const active = highlightNeurons?.includes(neuronIdx) ?? false;
        const fillColor = active
            ? isBackward
                ? "#fb923c"
                : "#fbbf24"
            : "#fef9c3";
        const filterStr = active ? `filter="url(#glow${svgId})"` : "";
        html += `<circle cx="${pos.x}" cy="${pos.y}" r="${NEURON_R}" fill="${fillColor}" stroke="#111827" stroke-width="2" ${filterStr}/>`;
        html += `<text x="${pos.x}" y="${pos.y - 8}" text-anchor="middle" font-family="var(--font-bangers), cursive" font-size="10" fill="#111827">h${j + 1}</text>`;
        html += `<text x="${pos.x}" y="${pos.y + 5}" text-anchor="middle" font-family="var(--font-jetbrains), monospace" font-size="8" fill="#78350f" font-weight="700">b:${f2(nn.b1[j])}</text>`;
        if (fwdCache && active) {
            html += `<text x="${pos.x}" y="${pos.y + NEURON_R + 12}" text-anchor="middle" font-family="var(--font-jetbrains), monospace" font-size="9" fill="#dc2626" font-weight="700">a=${f2(fwdCache.a1[j])}</text>`;
        }
        neuronIdx++;
    });

    // Output neurons
    layers[2].positions.forEach((pos, k) => {
        const active = highlightNeurons?.includes(neuronIdx) ?? false;
        const fillColor = active
            ? isBackward
                ? "#fb923c"
                : "#fbbf24"
            : "#dcfce7";
        const filterStr = active ? `filter="url(#glow${svgId})"` : "";
        html += `<circle cx="${pos.x}" cy="${pos.y}" r="${NEURON_R}" fill="${fillColor}" stroke="#111827" stroke-width="2" ${filterStr}/>`;
        html += `<text x="${pos.x}" y="${pos.y - 8}" text-anchor="middle" font-family="var(--font-bangers), cursive" font-size="10" fill="#111827">o${k + 1}</text>`;
        html += `<text x="${pos.x}" y="${pos.y + 5}" text-anchor="middle" font-family="var(--font-jetbrains), monospace" font-size="8" fill="#14532d" font-weight="700">b:${f2(nn.b2[k])}</text>`;
        if (fwdCache && active) {
            html += `<text x="${pos.x}" y="${pos.y + NEURON_R + 12}" text-anchor="middle" font-family="var(--font-jetbrains), monospace" font-size="9" fill="#dc2626" font-weight="700">ŷ=${f2(fwdCache.a2[k])}</text>`;
        }
        neuronIdx++;
    });

    if (!compact) {
        html += `<text x="${layers[1].x}" y="${svgH - 10}" text-anchor="middle" font-family="var(--font-jetbrains), monospace" font-size="9" fill="#6b7280">f: ${config.activation}</text>`;
        html += `<text x="${layers[2].x}" y="${svgH - 10}" text-anchor="middle" font-family="var(--font-jetbrains), monospace" font-size="9" fill="#6b7280">f: ${ds.outputActivation}</text>`;
    }

    if (highlightNeurons && highlightNeurons.length > 0) {
        const arrow = isBackward ? "⬅️ backward" : "➡️ forward";
        const col = isBackward ? "#d97706" : "#49b6e5";
        html += `<text x="${SVG_W / 2}" y="${svgH - 2}" text-anchor="middle" font-family="var(--font-bangers), cursive" font-size="10" fill="${col}">${arrow}</text>`;
    }

    return html;
}
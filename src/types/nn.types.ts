// src/types/nn.types.ts

export type DatasetKey = "linear" | "binary" | "categorical";
export type ActivationKey = "sigmoid" | "relu" | "tanh";
export type OutputActivationKey = "linear" | "sigmoid" | "softmax";
export type LossType = "mse" | "bce" | "cce";
export type OptimiserKey = "sgd" | "momentum" | "adam";
export type TabKey = "visualize" | "stepbystep" | "charts" | "concepts";
export type StepPhase = "fwd" | "bwd" | "update";

export interface DataSample {
    x: number[];
    y: number | number[];
}

export interface DatasetConfig {
    name: string;
    inputs: number;
    outputSize: number;
    outputActivation: OutputActivationKey;
    lossType: LossType;
    data: DataSample[];
    classColors: string[] | null;
}

export interface NNState {
    W1: number[][];
    b1: number[];
    W2: number[][];
    b2: number[];
    mW1: number[][];
    vW1: number[][];
    mb1: number[];
    vb1: number[];
    mW2: number[][];
    vW2: number[][];
    mb2: number[];
    vb2: number[];
    t: number;
    nIn: number;
    nH: number;
    nOut: number;
}

export interface TrainConfig {
    dataset: DatasetKey;
    hiddenSize: number;
    activation: ActivationKey;
    optimiser: OptimiserKey;
    lr: number;
    momentumBeta: number;
    adamB1: number;
    adamB2: number;
    adamEps: number;
    epochs: number;
}

export interface ForwardCache {
    x: number[];
    z1: number[];
    a1: number[];
    z2: number[];
    a2: number[];
}

export interface BackwardResult {
    delta2: number[];
    delta1: number[];
    dW2: number[][];
    db2: number[];
    dW1: number[][];
    db1: number[];
}

export interface Step {
    title: string;
    phase: StepPhase;
    highlights: { neurons: number[]; connections: number[] };
    render: () => string;
}

export interface StepData {
    steps: Step[];
    fwd: ForwardCache;
    delta2: number[];
    delta1: number[];
    dW2: number[][];
    db2: number[];
    dW1: number[][];
    db1: number[];
}

export interface ConceptEntry {
    cat: string;
    emoji: string;
    term: string;
    def: string;
    formula: string;
}
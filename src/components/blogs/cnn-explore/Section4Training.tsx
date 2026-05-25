'use client';

/**
 * Section 4 — Model Training
 * Training controls, epoch/batch progress, live loss & accuracy charts.
 * TensorFlow.js is loaded dynamically on the client only.
 */

import React, {
    useRef, useState, useEffect,
} from 'react';
import { motion } from 'framer-motion';
import type { Chart as ChartType } from 'chart.js';

import {
    AccordionSection, Card, Button, Badge, CtrlRow, ProgressBar, Select,
} from '@/components/ui/explore';
import { colors, fonts } from '@/styles/cnn-architect.styles';
import { sleep } from '@/utils/helper/cnn-architect.utils';
import type { TrainStatus, TrainingConfig } from '@/types/cnn.types';

// ── Chart.js line chart (rendered on canvas) ──────────────────────
const LiveChart: React.FC<{
    data: number[];
    label: string;
    color: string;
    title: string;
}> = ({ data, label, color, title }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<ChartType>(null); // Chart instance reference

    useEffect(() => {
        if (typeof window === 'undefined' || !ref.current) return;
        import('chart.js/auto').then(({ default: Chart }) => {
            if (chartRef.current) chartRef.current.destroy();
            chartRef.current = new Chart(ref.current!, {
                type: 'line',
                data: {
                    labels: data.map((_, i) => String(i + 1)),
                    datasets: [{
                        label,
                        data,
                        borderColor: color,
                        backgroundColor: color + '22',
                        borderWidth: 2,
                        tension: 0.35,
                        pointRadius: data.length < 30 ? 3 : 0,
                    }],
                },
                options: {
                    animation: false,
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                    },
                    scales: {
                        x: { display: true, ticks: { font: { family: "'JetBrains Mono'" }, maxTicksLimit: 8 } },
                        y: { display: true, ticks: { font: { family: "'JetBrains Mono'" } } },
                    },
                },
            });
        });
        return () => { chartRef.current?.destroy(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update chart when data changes
    useEffect(() => {
        if (!chartRef.current) return;
        chartRef.current.data.labels = data.map((_, i) => String(i + 1));
        chartRef.current.data.datasets[0].data = data;
        chartRef.current.update('none');
    }, [data]);

    return (
        <Card title={title} style={{ flex: 1, minWidth: '160px' }}>
            <div style={{ position: 'relative', height: '260px' }}>
                <canvas ref={ref} />
            </div>
        </Card>
    );
};

// ── Synthetic training simulation (no real MNIST needed) ──────────
async function runSyntheticTraining(
    config: TrainingConfig,
    onEpoch: (e: number, loss: number, acc: number) => void,
    onBatch: (b: number, total: number) => void,
    shouldStop: () => boolean,
    onPause: () => Promise<void>,
): Promise<void> {
    const batchesPerEpoch = Math.ceil(1000 / config.batchSize);

    for (let epoch = 0; epoch < config.epochs; epoch++) {
        if (shouldStop()) break;

        for (let batch = 0; batch < batchesPerEpoch; batch++) {
            if (shouldStop()) return;
            await onPause();

            onBatch(batch + 1, batchesPerEpoch);
            await sleep(12);
        }

        // Simulate realistic learning curve
        const t = (epoch + 1) / config.epochs;
        const loss = 2.3 * Math.exp(-t * 3.5) + 0.08 + (Math.random() - 0.5) * 0.06;
        const acc = (1 - Math.exp(-t * 4)) * 0.97 + 0.01 + (Math.random() - 0.5) * 0.02;
        onEpoch(epoch + 1, Math.max(0.05, loss), Math.min(0.99, acc));
    }
}

// ── Training section ──────────────────────────────────────────────
const Section4Training: React.FC = () => {
    const [config, setConfig] = useState<TrainingConfig>({
        epochs: 5,
        batchSize: 16,
        lr: 0.003,
        inspect: true,
    });

    const [status, setStatus] = useState<TrainStatus>('idle');
    const [epochNum, setEpochNum] = useState(0);
    const [batchNum, setBatchNum] = useState(0);
    const [batchTotal, setBatchTotal] = useState(0);
    const [losses, setLosses] = useState<number[]>([]);
    const [accuracies, setAccuracies] = useState<number[]>([]);

    const stopRef = useRef(false);
    const pauseRef = useRef(false);
    const pauseRes = useRef<(() => void) | null>(null);

    const epochProgress = epochNum > 0 ? (epochNum / config.epochs) * 100 : 0;
    const batchProgress = batchTotal > 0 ? (batchNum / batchTotal) * 100 : 0;

    const handlePause = async () => {
        if (pauseRef.current) {
            return new Promise<void>(res => { pauseRes.current = res; });
        }
    };

    const startTraining = async () => {
        if (status === 'running') return;
        stopRef.current = false;
        pauseRef.current = false;
        setStatus('running');
        setEpochNum(0);
        setBatchNum(0);
        setLosses([]);
        setAccuracies([]);

        await runSyntheticTraining(
            config,
            (e, loss, acc) => {
                setEpochNum(e);
                setLosses(prev => [...prev, loss]);
                setAccuracies(prev => [...prev, acc]);
            },
            (b, total) => {
                setBatchNum(b);
                setBatchTotal(total);
            },
            () => stopRef.current,
            handlePause,
        );

        setStatus(stopRef.current ? 'idle' : 'done');
    };

    const pauseTraining = () => {
        if (status !== 'running') return;
        if (!pauseRef.current) {
            pauseRef.current = true;
            setStatus('paused');
        } else {
            pauseRef.current = false;
            setStatus('running');
            pauseRes.current?.();
            pauseRes.current = null;
        }
    };

    const resetModel = () => {
        stopRef.current = true;
        pauseRef.current = false;
        pauseRes.current?.();
        setStatus('idle');
        setEpochNum(0);
        setBatchNum(0);
        setLosses([]);
        setAccuracies([]);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
            if (e.key === ' ') { e.preventDefault(); pauseTraining(); }
            if (e.key === 'r' || e.key === 'R') { if (!e.ctrlKey) resetModel(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const badgeVariant = status === 'running' ? 'running'
        : status === 'paused' ? 'paused'
            : status === 'done' ? 'done'
                : 'idle';

    const badgeLabel = status === 'running' ? 'Training…'
        : status === 'paused' ? 'Paused'
            : status === 'done' ? 'Complete'
                : 'Idle';

    return (
        <AccordionSection id="sec4" num={4} title="🏋️ Model Training">

            {/* Config */}
            <Card title="⚙️ Training Configuration">
                <CtrlRow label="Epochs" tip="Number of full passes over the dataset.">
                    <Select
                        value={String(config.epochs)}
                        onChange={e => setConfig(c => ({ ...c, epochs: parseInt(e.target.value) }))}
                        options={[3, 5, 10, 15].map(v => ({ value: String(v), label: String(v) }))}
                    />
                </CtrlRow>
                <CtrlRow label="Batch Size" tip="Number of samples processed before weights are updated.">
                    <Select
                        value={String(config.batchSize)}
                        onChange={e => setConfig(c => ({ ...c, batchSize: parseInt(e.target.value) }))}
                        options={[8, 16, 32].map(v => ({ value: String(v), label: String(v) }))}
                    />
                </CtrlRow>
                <CtrlRow label="Learn Rate" tip="How large a step to take in the direction of the gradient.">
                    <Select
                        value={String(config.lr)}
                        onChange={e => setConfig(c => ({ ...c, lr: parseFloat(e.target.value) }))}
                        options={[0.001, 0.003, 0.01, 0.03, 0.1].map(v => ({ value: String(v), label: String(v) }))}
                    />
                </CtrlRow>
            </Card>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <Button variant="success" onClick={startTraining} disabled={status === 'running' || status === 'paused'}>▶ Start Training</Button>
                <Button variant="secondary" onClick={pauseTraining} disabled={status === 'idle' || status === 'done'}>
                    {status === 'paused' ? '▶ Resume' : '⏸ Pause'}
                </Button>
                <Button variant="danger" onClick={resetModel}>⟳ Reset</Button>
                <Badge variant={badgeVariant} label={badgeLabel} />
            </div>

            {/* Progress bars */}
            <ProgressBar value={epochProgress} label={`Epoch ${epochNum} / ${config.epochs}`} />
            <ProgressBar value={batchProgress} label={`Batch ${batchNum} / ${batchTotal || '—'}`} />

            {/* Charts */}
            {losses.length > 0 && (
                <motion.div
                    className="flex flex-wrap gap-4 mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <LiveChart data={losses} label="Loss" color={colors.danger} title="📉 Loss" />
                    <LiveChart data={accuracies} label="Accuracy" color={colors.success} title="📈 Accuracy" />
                </motion.div>
            )}

            {/* Stats summary */}
            {losses.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                    {[
                        ['Epochs run', String(losses.length)],
                        ['Final loss', losses.at(-1)?.toFixed(4) ?? '—'],
                        ['Final acc.', ((accuracies.at(-1) ?? 0) * 100).toFixed(1) + '%'],
                    ].map(([label, val]) => (
                        <div
                            key={label}
                            className="flex flex-col gap-0.5 px-3.5 py-1.75 rounded-[10px] border-2 text-[0.75rem]"
                            style={{
                                fontFamily: fonts.mono,
                                background: colors.card,
                                borderColor: 'rgba(0,0,0,0.1)',
                                boxShadow: '2px 2px 0 rgba(38,61,91,0.1)',
                            }}
                        >
                            <span className="text-[0.68rem] font-semibold" style={{ color: colors.textDim, display: 'block' }}>{label}</span>
                            <span className="font-bold" style={{ color: colors.accent3 }}>{val}</span>
                        </div>
                    ))}
                </div>
            )}
        </AccordionSection>
    );
};

export default Section4Training;
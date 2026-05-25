'use client';

/**
 * Section 2 — CNN Architecture Diagram
 * Displays the layer-by-layer architecture as a doodle-styled diagram.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AccordionSection, Card } from '@/components/ui/explore';
import { colors, fonts, gradients } from '@/styles/cnn-architect.styles';
import type { ArchLayer } from '@/types/cnn.types';

// ── Architecture definition ────────────────────────────────────────
const ARCH_LAYERS: ArchLayer[] = [
  { type: 'Input',   label: 'Input',    params: '28×28×1',  kind: 'conv'  },
  { type: 'Conv2D',  label: 'Conv2D',   params: '5×5, 8 filters, ReLU', kind: 'conv'  },
  { type: 'MaxPool', label: 'MaxPool',  params: '2×2',      kind: 'pool'  },
  { type: 'Conv2D',  label: 'Conv2D',   params: '3×3, 16 filters, ReLU', kind: 'conv'  },
  { type: 'MaxPool', label: 'MaxPool',  params: '2×2',      kind: 'pool'  },
  { type: 'Flatten', label: 'Flatten',  params: '→ 400',    kind: 'flat'  },
  { type: 'Dense',   label: 'Dense',    params: '64 units, ReLU', kind: 'dense' },
  { type: 'Dense',   label: 'Output',   params: '10 softmax',kind: 'out'  },
];

const gradientByKind: Record<ArchLayer['kind'], string> = {
  conv:  gradients.archConv,
  pool:  gradients.archPool,
  flat:  gradients.archFlat,
  dense: gradients.archDense,
  out:   gradients.archOut,
};

// ── Component ─────────────────────────────────────────────────────
const ArchDiagram: React.FC = () => (
  <Card title="🗂️ Network Architecture">
    <div
      className="flex items-center flex-wrap gap-2 py-3 overflow-x-auto"
    >
      {ARCH_LAYERS.map((layer, i) => (
        <React.Fragment key={i}>
          {/* Layer block */}
          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
          >
            <motion.div
              className="text-center text-[0.72rem] text-white min-w-20 px-3 py-2.5 rounded-[10px] relative"
              style={{
                background: gradientByKind[layer.kind],
                border:     '2.5px solid rgba(0,0,0,0.35)',
                boxShadow:  '3px 3px 0 rgba(0,0,0,0.35)',
                fontFamily: fonts.mono,
              }}
              whileHover={{
                translateX: -1,
                translateY: -1,
                boxShadow:  '4px 4px 0 rgba(0,0,0,0.35)',
              }}
            >
              <div className="font-bold">{layer.label}</div>
            </motion.div>
            <div
              className="text-[0.63rem] font-medium"
              style={{ fontFamily: fonts.mono, color: colors.textDim }}
            >
              {layer.params}
            </div>
          </motion.div>

          {/* Arrow between layers */}
          {i < ARCH_LAYERS.length - 1 && (
            <div
              className="text-[1.2rem] font-bold self-start mt-7"
              style={{ color: colors.accent3 }}
            >
              →
            </div>
          )}
        </React.Fragment>
      ))}
    </div>

    {/* Legend */}
    <div className="flex flex-wrap gap-3 mt-4">
      {(Object.entries(gradientByKind) as [ArchLayer['kind'], string][]).map(([kind, grad]) => (
        <div key={kind} className="flex items-center gap-1.5 text-[0.7rem]" style={{ fontFamily: fonts.mono }}>
          <div
            style={{
              width:        '16px',
              height:       '16px',
              borderRadius: '4px',
              background:   grad,
              border:       '1.5px solid rgba(0,0,0,0.2)',
            }}
          />
          <span style={{ color: colors.textDim, textTransform: 'capitalize' }}>{kind}</span>
        </div>
      ))}
    </div>
  </Card>
);

const Section2Architecture: React.FC = () => (
  <AccordionSection id="sec2" num={2} title="🏗️ CNN Architecture">
    <ArchDiagram />
  </AccordionSection>
);

export default Section2Architecture;
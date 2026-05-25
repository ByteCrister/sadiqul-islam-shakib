"use client";
// src/components/nn/ConceptsTab.tsx
import { useState } from "react";
import { CONCEPTS } from "@/data/nn.data";
import { S, STYLE } from "@/styles/explore.styles";

export function ConceptsTab() {
  return (
    <div className={S.gridConcepts}>
      {CONCEPTS.map((c, i) => (
        <ConceptCard key={i} concept={c} />
      ))}
    </div>
  );
}

function ConceptCard({ concept }: { concept: (typeof CONCEPTS)[number] }) {
  const [open, setOpen] = useState(false);
  const catClass = S.conceptCat[concept.cat] ?? "border-[#e5e7eb] bg-white";

  return (
    <div
      className={`${S.conceptCard} ${catClass}`}
      onClick={() => setOpen((o) => !o)}
    >
      <div className={S.conceptHead}>
        <span className={S.conceptTerm} style={STYLE.fontDisplay}>
          {concept.emoji} {concept.term}
        </span>
        <span
          className={`${S.conceptToggle} transition-transform duration-200`}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </div>
      {open && (
        <div className={S.conceptBody} style={STYLE.fontMono}>
          <p>{concept.def}</p>
          <div className={S.conceptFormula}>{concept.formula}</div>
        </div>
      )}
    </div>
  );
}
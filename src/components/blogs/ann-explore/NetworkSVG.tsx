"use client";
// src/components/nn/NetworkSVG.tsx
import { useEffect, useRef } from "react";
import { useNN } from "./NNProvider";
import { buildNetworkSVG } from "@/data/nn.engine";
import type { ForwardCache } from "@/types/nn.types";

interface Props {
  compact?: boolean;
  highlightNeurons?: number[] | null;
  fwdCache?: ForwardCache | null;
  isBackward?: boolean;
  className?: string;
}

export function NetworkSVG({
  compact = false,
  highlightNeurons = null,
  fwdCache = null,
  isBackward = false,
  className = "",
}: Props) {
  const { nn, config } = useNN();
  const svgRef = useRef<SVGSVGElement>(null);
  const svgH = compact ? 260 : 360;

  useEffect(() => {
    if (!svgRef.current) return;
    const html = buildNetworkSVG(
      nn,
      config,
      svgH,
      highlightNeurons,
      fwdCache,
      compact,
      isBackward
    );
    svgRef.current.innerHTML = html;
  }, [nn, config, svgH, highlightNeurons, fwdCache, compact, isBackward]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 640 ${svgH}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto ${className}`}
    />
  );
}
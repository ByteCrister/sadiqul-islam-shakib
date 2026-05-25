'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export default function Cursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // These trigger re-renders only on mode change, not on mouse move
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Trail points stored in a ring buffer — no React state
  const trailBuf = useRef<{ x: number; y: number; t: number }[]>([]);
  const rafId = useRef<number>(0);
  const TRAIL_LEN = 12;
  const TRAIL_LIFETIME = 350; // ms

  const isTouch =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // ── Dark mode detection ────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // ── Canvas trail loop — runs completely outside React ─────────────────────
  useEffect(() => {
    if (isTouch) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      rafId.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      const pts = trailBuf.current;
      const trailColor = isDark ? '180,185,195' : '100,105,115';

      for (let i = 0; i < pts.length; i++) {
        const age = now - pts[i].t;
        if (age > TRAIL_LIFETIME) continue;
        const life = 1 - age / TRAIL_LIFETIME;
        const size = 3 + life * 2;
        ctx.fillStyle = `rgba(${trailColor},${life * 0.45})`;
        ctx.beginPath();
        // Pixel square, not circle — matches retro aesthetic
        ctx.rect(pts[i].x - size / 2, pts[i].y - size / 2, size, size);
        ctx.fill();
      }
    };
    rafId.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('resize', resize);
    };
  }, [isTouch, isDark]);

  // ── Mouse event listeners ──────────────────────────────────────────────────
  useEffect(() => {
    if (isTouch) return;

    const move = (e: MouseEvent) => {
      // Motion values are set synchronously — no batching delay
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Push into ring buffer directly, no setState
      const buf = trailBuf.current;
      buf.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (buf.length > TRAIL_LEN) buf.shift();
    };

    const down = () => setIsClicking(true);
    const up = () => setIsClicking(false);

    // Throttle hover detection: only re-check on target change
    let lastTarget: EventTarget | null = null;
    const over = (e: MouseEvent) => {
      if (e.target === lastTarget) return;
      lastTarget = e.target;
      const t = e.target as HTMLElement;
      const isPtr =
        t.tagName === 'A' ||
        t.tagName === 'BUTTON' ||
        !!t.closest('a') ||
        !!t.closest('button') ||
        window.getComputedStyle(t).cursor === 'pointer';
      setIsHovering((prev) => (prev === isPtr ? prev : isPtr));
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    window.addEventListener('mousedown', down, { passive: true });
    window.addEventListener('mouseup', up, { passive: true });

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [isTouch, mouseX, mouseY]);

  if (isTouch) return null;

  // ── Color tokens ───────────────────────────────────────────────────────────
  const c = isDark
    ? {
        face: '#c8cdd6',
        faceHighlight: '#e2e6ed',
        sideRight: '#6b7280',
        sideBottom: '#52575f',
        outline: '#3a3e45',
        bevel: '#f0f2f5',
        hoverRing: '#7dd3d4',
        sparkColor: '#e2e6ed',
      }
    : {
        face: '#d4d8e0',
        faceHighlight: '#edf0f4',
        sideRight: '#8b909a',
        sideBottom: '#6b6f78',
        outline: '#2c2f35',
        bevel: '#ffffff',
        hoverRing: '#38b2ac',
        sparkColor: '#2c2f35',
      };

  const scale = isClicking ? 0.88 : isHovering ? 1.25 : 1;
  const depth = isClicking ? 1.5 : 4;
  const arrowPoints = '0,0 0,20 5.5,15 9,24 12,23 8.5,14 15,14';

  return (
    <>
      {/* Canvas handles all trails — zero React re-renders */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9997,
        }}
        aria-hidden
      />

      {/* Main cursor — motion values drive transform directly via CSS, no re-render */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: mouseX,
          y: mouseY,
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
        aria-hidden
      >
        {/* Hover retro ring */}
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.7, 0.3, 0.7], scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 10,
              left: 6,
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: `2px dashed ${c.hoverRing}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* 3D Arrow */}
        <motion.svg
          animate={{ scale, rotate: isHovering ? -8 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          width="40"
          height="44"
          viewBox="-6 -4 36 40"
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          {/* Drop shadow */}
          <motion.polygon
            points={arrowPoints}
            transform={`translate(${depth + 1}, ${depth + 1})`}
            fill="rgba(0,0,0,0.22)"
            stroke="none"
            style={{ filter: 'blur(1.5px)' }}
          />
          {/* Extrusion back */}
          <polygon
            points={arrowPoints}
            transform={`translate(${depth}, ${depth})`}
            fill={c.sideBottom}
            stroke={c.outline}
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          {/* Extrusion front */}
          <polygon
            points={arrowPoints}
            transform={`translate(${depth - 1}, ${depth - 1})`}
            fill={c.sideRight}
            stroke="none"
          />
          {/* Face */}
          <polygon
            points={arrowPoints}
            fill={c.face}
            stroke={c.outline}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Bevel highlights */}
          <polygon points="0,0 0,9 3.5,7" fill={c.bevel} opacity={0.55} />
          <polygon points="0,0 7,0 5.5,3.5" fill={c.bevel} opacity={0.38} />
          {/* Pixel outline */}
          <polygon
            points={arrowPoints}
            fill="none"
            stroke={c.outline}
            strokeWidth="1.8"
            strokeLinejoin="miter"
            opacity={0.7}
          />
          {isClicking && (
            <polygon
              points={arrowPoints}
              fill="none"
              stroke={c.outline}
              strokeWidth="3"
              opacity={0.3}
              strokeLinejoin="round"
            />
          )}
        </motion.svg>

        {/* Click burst sparks */}
        {isClicking &&
          [0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.div
              key={angle}
              initial={{ x: 6, y: 10, opacity: 1, scale: 1 }}
              animate={{
                x: 6 + Math.cos((angle * Math.PI) / 180) * 18,
                y: 10 + Math.sin((angle * Math.PI) / 180) * 18,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: i % 2 === 0 ? 4 : 3,
                height: i % 2 === 0 ? 4 : 3,
                borderRadius: 1,
                background: c.sparkColor,
                pointerEvents: 'none',
              }}
            />
          ))}
      </motion.div>
    </>
  );
}
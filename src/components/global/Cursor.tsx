'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [isDark, setIsDark] = useState(false);
  const trailIdRef = useRef(0);
  const rafRef = useRef<number>(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Optimized trail addition with throttling
  const addTrail = useCallback(() => {
    if (rafRef.current) return;
  
    rafRef.current = requestAnimationFrame(() => {
      // use the smoothed spring values so trails appear behind the visible cursor
      const sx = x.get();
      const sy = y.get();
  
      setTrails(prev => {
        const newTrail = { x: sx, y: sy, id: trailIdRef.current++ };
        return [...prev.slice(-6), newTrail];
      });
  
      rafRef.current = 0;
    });
  }, [x, y]);

  useEffect(() => {
    if (isTouch) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      addTrail();
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [mouseX, mouseY, isTouch, addTrail]);

  if (isTouch) return null;

  // Theme-aware colors
  const colors = isDark ? {
    trail: 'rgba(156, 163, 175, 0.4)',
    ring: isHovering ? 'rgba(156, 163, 175, 0.8)' : 'rgba(107, 114, 128, 0.5)',
    glow: 'rgba(156, 163, 175, 0.4)',
    core: isHovering 
      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
      : isClicking
      ? '#9ca3af'
      : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
    shadow: isHovering 
      ? '0 0 20px rgba(156, 163, 175, 0.6), 0 0 40px rgba(156, 163, 175, 0.3)' 
      : '0 0 15px rgba(229, 231, 235, 0.5), 0 0 30px rgba(209, 213, 217, 0.3)',
    particle1: '#9ca3af',
    particle2: '#6b7280',
    ripple: '#9ca3af',
  } : {
    trail: 'rgba(75, 85, 99, 0.25)',
    ring: isHovering ? 'rgba(31, 41, 55, 0.8)' : 'rgba(75, 85, 99, 0.5)',
    glow: 'rgba(75, 85, 99, 0.3)',
    core: isHovering 
      ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' 
      : isClicking
      ? '#4b5563'
      : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    shadow: isHovering 
      ? '0 0 20px rgba(31, 41, 55, 0.6), 0 0 40px rgba(31, 41, 55, 0.3)' 
      : '0 0 15px rgba(31, 41, 55, 0.5), 0 0 30px rgba(17, 24, 39, 0.3)',
    particle1: '#4b5563',
    particle2: '#374151',
    ripple: '#4b5563',
  };

  return (
    <>
      {/* Trail effect - memoized for better performance */}
      {trails.map((trail, i) => (
        <motion.div
          key={trail.id}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            position: 'fixed',
            top: trail.y,
            left: trail.x,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: colors.trail,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        />
      ))}

      {/* Main cursor */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x,
          y,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
        aria-hidden
      >
        {/* Outer ring */}
        <motion.div
          animate={{
            width: isHovering ? 50 : isClicking ? 30 : 40,
            height: isHovering ? 50 : isClicking ? 30 : 40,
          }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '50%',
            border: `2px solid ${colors.ring}`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Middle glow ring */}
        <motion.div
          animate={{
            width: isHovering ? 35 : 28,
            height: isHovering ? 35 : 28,
            opacity: isHovering ? 0.4 : 0.2,
          }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(8px)',
          }}
        />

        {/* Core dot */}
        <motion.div
          animate={{
            width: isHovering ? 8 : isClicking ? 6 : 10,
            height: isHovering ? 8 : isClicking ? 6 : 10,
          }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '50%',
            background: colors.core,
            transform: 'translate(-50%, -50%)',
            boxShadow: colors.shadow,
          }}
        />

        {/* Hover particles - optimized positioning */}
        {isHovering && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                top: '-25px', // Half of 50px
                left: 0,
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: colors.particle1,
                transform: 'translateX(-50%)',
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                top: '25px', // Half of 50px
                left: 0,
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: colors.particle2,
                transform: 'translateX(-50%)',
              }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                top: 0,
                left: '25px', // Half of 50px
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: colors.particle1,
                transform: 'translateY(-50%)',
              }}
            />
          </>
        )}

        {/* Click ripple effect */}
        {isClicking && (
          <motion.div
            initial={{ width: 10, height: 10, opacity: 0.8 }}
            animate={{ width: 60, height: 60, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius: '50%',
              border: `2px solid ${colors.ripple}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </motion.div>
    </>
  );
}
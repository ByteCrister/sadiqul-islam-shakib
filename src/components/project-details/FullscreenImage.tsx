'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import screenfull from 'screenfull';

interface FullscreenImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    maxZoom?: number;
    minZoom?: number;
    step?: number;
    /** optional filename for download */
    filename?: string;
}

export function FullscreenImage({
    src,
    alt,
    width = 1280,
    height = 720,
    maxZoom = 6,
    minZoom = 0.25,
    step = 0.25,
    filename,
}: FullscreenImageProps) {
    const fsRef = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [scale, setScale] = useState(1);
    const originRef = useRef({ x: 50, y: 50 }); // percent origin for transform-origin
    const [translate, setTranslate] = useState({ x: 0, y: 0 }); // px translation for panning
    const draggingRef = useRef<{ active: boolean; startX: number; startY: number; startTx: number; startTy: number }>({
        active: false,
        startX: 0,
        startY: 0,
        startTx: 0,
        startTy: 0,
    });
    const [rotation, setRotation] = useState(0); // degrees
    const rafRef = useRef<number | null>(null);

    // Touch pinch state
    const pinchRef = useRef<{ initialDistance: number; initialScale: number; lastCenter: { x: number; y: number } | null } | null>(null);

    // Keep fullscreen state in sync with screenfull
    useEffect(() => {
        if (!screenfull.isEnabled) return;
        const onChange = () => {
            setIsFullscreen(screenfull.isFullscreen);
            if (!screenfull.isFullscreen) {
                // reset interactive state on exit if desired
                setScale(1);
                setTranslate({ x: 0, y: 0 });
                setRotation(0);
            }
        };
        screenfull.on('change', onChange);
        return () => {
            screenfull.off('change', onChange);
        };
    }, []);

    // Open / close fullscreen
    const openFullscreen = useCallback(async () => {
        if (!screenfull.isEnabled || !fsRef.current) return;
        try {
            await screenfull.request(fsRef.current);
        } catch (err) {
            console.error('Failed to open fullscreen', err);
        }
    }, []);

    const closeFullscreen = useCallback(async () => {
        if (!screenfull.isEnabled) return;
        try {
            await screenfull.exit();
        } catch (err) {
            console.error('Failed to exit fullscreen', err);
        }
    }, []);

    // Zoom helpers (centered on current origin)
    const clamp = (v: number) => Math.max(minZoom, Math.min(maxZoom, v));

    const setScaleClamped = useCallback((next: number) => {
        setScale((s) => {
            const clamped = clamp(next);
            // adjust translate so zoom appears centered at originRef
            // compute image center in px relative to wrapper
            const wrapper = innerRef.current;
            const imgEl = imgRef.current;
            if (wrapper && imgEl) {
                const imgRect = imgEl.getBoundingClientRect();

                // origin in px relative to image top-left
                const originPxX = (originRef.current.x / 100) * imgRect.width;
                const originPxY = (originRef.current.y / 100) * imgRect.height;

                // compute delta due to scale change and adjust translate to keep origin under cursor
                const scaleRatio = clamped / s;
                const newTx = translate.x - (originPxX * (scaleRatio - 1));
                const newTy = translate.y - (originPxY * (scaleRatio - 1));
                // apply new translate
                setTranslate({ x: newTx, y: newTy });
            }
            return clamped;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxZoom, minZoom, translate.x, translate.y]);

    const zoomIn = useCallback(() => setScaleClamped(scale + step), [scale, step, setScaleClamped]);
    const zoomOut = useCallback(() => setScaleClamped(scale - step), [scale, step, setScaleClamped]);
    const resetZoom = useCallback(() => {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
        originRef.current = { x: 50, y: 50 };
        setRotation(0);
    }, []);

    const fitToScreen = useCallback(() => {
        // compute scale to fit image inside viewport (innerRef)
        const wrapper = innerRef.current;
        const imgEl = imgRef.current;
        if (!wrapper || !imgEl) return;
        const wrapperRect = wrapper.getBoundingClientRect();
        const imgNaturalW = imgEl.naturalWidth;
        const imgNaturalH = imgEl.naturalHeight;
        if (!imgNaturalW || !imgNaturalH) return;
        const scaleX = wrapperRect.width / imgNaturalW;
        const scaleY = wrapperRect.height / imgNaturalH;
        const newScale = Math.min(scaleX, scaleY, maxZoom);
        // center
        setScale(newScale);
        setTranslate({ x: 0, y: 0 });
        originRef.current = { x: 50, y: 50 };
    }, [maxZoom]);

    // Rotate
    const rotateCW = useCallback(() => setRotation((r) => (r + 90) % 360), []);
    const rotateCCW = useCallback(() => setRotation((r) => (r - 90 + 360) % 360), []);

    // Mouse / pointer handlers for panning and origin update
    const onPointerDown = useCallback((e: React.PointerEvent) => {
        if (!innerRef.current) return;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        draggingRef.current.active = true;
        draggingRef.current.startX = e.clientX;
        draggingRef.current.startY = e.clientY;
        draggingRef.current.startTx = translate.x;
        draggingRef.current.startTy = translate.y;
    }, [translate.x, translate.y]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!draggingRef.current.active) return;
        const dx = e.clientX - draggingRef.current.startX;
        const dy = e.clientY - draggingRef.current.startY;
        // update translate
        const nextTx = draggingRef.current.startTx + dx;
        const nextTy = draggingRef.current.startTy + dy;
        // throttle with rAF
        if (rafRef.current == null) {
            rafRef.current = requestAnimationFrame(() => {
                setTranslate({ x: nextTx, y: nextTy });
                rafRef.current = null;
            });
        }
    }, []);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        draggingRef.current.active = false;
        try {
            (e.target as Element).releasePointerCapture?.(e.pointerId);
        } catch { }
    }, []);

    // Mouse move to update transform-origin (for zoom centering) — only update when not dragging
    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!innerRef.current || draggingRef.current.active) return;
        const rect = innerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        originRef.current = { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) };
    }, []);

    // Wheel zoom (Ctrl+wheel or wheel with alt) and wheel pan fallback
    const onWheel = useCallback((e: React.WheelEvent) => {
        if (!isFullscreen) return;
        // If user holds ctrl or meta, zoom; otherwise if scale > 1, pan horizontally/vertically
        const zoomIntent = e.ctrlKey || e.metaKey || e.shiftKey;
        if (zoomIntent) {
            e.preventDefault();
            const delta = -e.deltaY;
            const factor = delta > 0 ? 1 + step : 1 - step;
            setScaleClamped(clamp(scale * factor));
        } else if (scale > 1) {
            // pan by wheel
            e.preventDefault();
            const nextTx = translate.x - e.deltaX;
            const nextTy = translate.y - e.deltaY;
            setTranslate({ x: nextTx, y: nextTy });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFullscreen, scale, step, translate.x, translate.y, setScaleClamped]);

    // Double click to zoom in / reset
    const onDoubleClick = useCallback((e: React.MouseEvent) => {
        if (!innerRef.current || !imgRef.current) return;
        const rect = innerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        originRef.current = { x, y };
        if (scale <= 1) {
            setScaleClamped(2);
        } else {
            resetZoom();
        }
    }, [scale, setScaleClamped, resetZoom]);

     // Download helper
     const onDownload = useCallback(() => {
        const a = document.createElement('a');
        a.href = src; // MUST be /images/xxx.png
        a.download = filename ?? src.split('/').pop() ?? 'image';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }, [src, filename]);

    // Keyboard shortcuts while fullscreen
    useEffect(() => {
        if (!isFullscreen) return;
        const onKey = (e: KeyboardEvent) => {
            const add = e.key === '+' || e.key === '=' || e.code === 'NumpadAdd';
            const sub = e.key === '-' || e.code === 'NumpadSubtract';
            if (add) {
                e.preventDefault();
                zoomIn();
            } else if (sub) {
                e.preventDefault();
                zoomOut();
            } else if (e.key === '0') {
                e.preventDefault();
                resetZoom();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeFullscreen();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setTranslate((t) => ({ x: t.x + 50, y: t.y }));
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setTranslate((t) => ({ x: t.x - 50, y: t.y }));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setTranslate((t) => ({ x: t.x, y: t.y + 50 }));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setTranslate((t) => ({ x: t.x, y: t.y - 50 }));
            } else if (e.key.toLowerCase() === 'd') {
                e.preventDefault();
                onDownload();
              }
        };
        window.addEventListener('keydown', onKey, { passive: false });
        return () => window.removeEventListener('keydown', onKey);
    }, [isFullscreen, zoomIn, zoomOut, resetZoom, closeFullscreen, onDownload]);

    // Touch: pinch to zoom and two-finger pan
    useEffect(() => {
        const wrapper = innerRef.current;
        if (!wrapper) return;

        const onTouchStart = (ev: TouchEvent) => {
            if (ev.touches.length === 2) {
                const t0 = ev.touches[0];
                const t1 = ev.touches[1];
                const dx = t1.clientX - t0.clientX;
                const dy = t1.clientY - t0.clientY;
                const dist = Math.hypot(dx, dy);
                pinchRef.current = { initialDistance: dist, initialScale: scale, lastCenter: { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 } };
            } else if (ev.touches.length === 1) {
                // start drag
                const t = ev.touches[0];
                draggingRef.current.active = true;
                draggingRef.current.startX = t.clientX;
                draggingRef.current.startY = t.clientY;
                draggingRef.current.startTx = translate.x;
                draggingRef.current.startTy = translate.y;
            }
        };

        const onTouchMove = (ev: TouchEvent) => {
            if (pinchRef.current && ev.touches.length === 2) {
                ev.preventDefault();
                const t0 = ev.touches[0];
                const t1 = ev.touches[1];
                const dx = t1.clientX - t0.clientX;
                const dy = t1.clientY - t0.clientY;
                const dist = Math.hypot(dx, dy);
                const ratio = dist / pinchRef.current.initialDistance;
                const newScale = clamp(pinchRef.current.initialScale * ratio);
                // update origin to center of pinch relative to wrapper
                const center = { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 };
                const rect = wrapper.getBoundingClientRect();
                originRef.current = { x: ((center.x - rect.left) / rect.width) * 100, y: ((center.y - rect.top) / rect.height) * 100 };
                setScale(newScale);
            } else if (draggingRef.current.active && ev.touches.length === 1) {
                ev.preventDefault();
                const t = ev.touches[0];
                const dx = t.clientX - draggingRef.current.startX;
                const dy = t.clientY - draggingRef.current.startY;
                setTranslate({ x: draggingRef.current.startTx + dx, y: draggingRef.current.startTy + dy });
            }
        };

        const onTouchEnd = (ev: TouchEvent) => {
            if (ev.touches.length < 2) pinchRef.current = null;
            if (ev.touches.length === 0) draggingRef.current.active = false;
        };

        wrapper.addEventListener('touchstart', onTouchStart, { passive: false });
        wrapper.addEventListener('touchmove', onTouchMove, { passive: false });
        wrapper.addEventListener('touchend', onTouchEnd);
        wrapper.addEventListener('touchcancel', onTouchEnd);

        return () => {
            wrapper.removeEventListener('touchstart', onTouchStart);
            wrapper.removeEventListener('touchmove', onTouchMove);
            wrapper.removeEventListener('touchend', onTouchEnd);
            wrapper.removeEventListener('touchcancel', onTouchEnd);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scale, translate.x, translate.y]);

    // Compose transform style
    const transformStyle: React.CSSProperties = {
        transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: `${originRef.current.x}% ${originRef.current.y}%`,
        transition: 'transform 100ms linear',
        willChange: 'transform',
        maxWidth: 'none',
        height: 'auto',
        display: 'block',
    };

    // Wrapper style when fullscreen
    const fsInnerStyle: React.CSSProperties = isFullscreen
        ? {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflow: 'auto',
            padding: 24,
            zIndex: 9999,
        }
        : { display: 'none' };

    return (
        <>
            {/* Thumbnail / normal view */}
            <div className="relative group cursor-zoom-in">
                <div onClick={openFullscreen} className="block">
                    <Image
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        className="w-full rounded-2xl object-contain"
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>

                <div
                    onClick={openFullscreen}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                >
                    View Full Screen
                </div>
            </div>

            {/* Fullscreen container */}
            <div
                ref={fsRef}
                className={`fixed inset-0 z-[9999] bg-black ${isFullscreen ? 'flex' : 'hidden'} flex-col`}
                aria-hidden={!isFullscreen}
            >

                {/* Top controls with shortcut hints */}
                <div className="fixed top-0 left-0 right-0 z-[10001] pointer-events-none">
                    <div className="flex justify-end gap-2 p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-auto">
                        <button
                            onClick={zoomOut}
                            aria-label="Zoom out (minus)"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            {`Zoom In (-)`}
                        </button>

                        <button
                            onClick={resetZoom}
                            aria-label="Reset zoom"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            {`Reset (0)`}
                        </button>

                        <button
                            onClick={zoomIn}
                            aria-label="Zoom in (plus)"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            {`Zoom Out (+)`}
                        </button>

                        <button
                            onClick={fitToScreen}
                            aria-label="Fit to screen"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            {`Fit (F)`}
                        </button>

                        <button
                            onClick={rotateCCW}
                            aria-label="Rotate left"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            ⟲
                            <kbd className="ml-1 rounded bg-white/10 px-2 py-0.5 text-xs font-medium text-white">L</kbd>
                        </button>

                        <button
                            onClick={rotateCW}
                            aria-label="Rotate right"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            ⟳
                            <kbd className="ml-1 rounded bg-white/10 px-2 py-0.5 text-xs font-medium text-white">R</kbd>
                        </button>

                        <button
                            onClick={onDownload}
                            aria-label="Download image"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            Download
                            <kbd className="ml-1 rounded bg-white/10 px-2 py-0.5 text-xs font-medium text-white">D</kbd>
                        </button>

                        <button
                            onClick={closeFullscreen}
                            aria-label="Close fullscreen"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            <kbd className="ml-1 rounded bg-white/10 px-2 py-0.5 text-xs font-medium text-white">Esc ✕</kbd>
                        </button>
                    </div>
                </div>


                {/* Zoom HUD */}
                <div style={{ position: 'fixed', left: 16, top: 16, zIndex: 10002 }}>
                    <div className="px-3 py-2 rounded bg-black/60 text-white border border-white/10">
                        <strong>{Math.round(scale * 100)}%</strong>
                    </div>
                </div>

                {/* Fullscreen inner area */}
                <div style={fsInnerStyle}>
                    <div
                        ref={innerRef}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                        onMouseMove={onMouseMove}
                        onWheel={onWheel}
                        onDoubleClick={onDoubleClick}
                        className="flex justify-center items-start w-full"
                        style={{ paddingTop: 48, touchAction: 'none' }} // touchAction none to allow pinch/drag handling
                    >
                        {/* Use next/image unoptimized in fullscreen for predictable native behavior.
                We still reference the underlying <img> via ref by using onLoadingComplete to set imgRef. */}
                        <Image
                            src={src}
                            alt={alt}
                            width={width}
                            height={height}
                            unoptimized
                            style={transformStyle}
                            onLoad={() => {
                                // next/image renders an <img> inside; find it
                                const wrapper = innerRef.current;
                                if (!wrapper) return;
                                const img = wrapper.querySelector('img');
                                if (img) imgRef.current = img as HTMLImageElement;
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
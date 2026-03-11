'use client';

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
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

interface Transform {
    scale: number;
    x: number; // translation X (px)
    y: number; // translation Y (px)
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
    const fsRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [transform, setTransform] = useState<Transform>({
        scale: 1,
        x: 0,
        y: 0,
    });
    const originRef = useRef({ x: 50, y: 50 }); // percent for transform-origin
    const [rotation, setRotation] = useState(0); // degrees

    // Dragging state (mouse/pen)
    const dragRef = useRef({
        active: false,
        startX: 0,
        startY: 0,
        startTx: 0,
        startTy: 0,
    });

    // Pinch state (touch)
    const pinchRef = useRef<{
        initialDistance: number;
        initialScale: number;
        initialTx: number;
        initialTy: number;
        lastCenter: { x: number; y: number } | null;
    } | null>(null);

    // RAF throttling for pointer moves
    const rafRef = useRef<number | null>(null);

    // --- Clamp helper ---
    const clamp = (v: number) => Math.max(minZoom, Math.min(maxZoom, v));

    // --- Atomic transform update ---
    // const updateTransform = useCallback(
    //     (newScale: number, newX?: number, newY?: number) => {
    //         setTransform((prev) => ({
    //             scale: clamp(newScale),
    //             x: newX ?? prev.x,
    //             y: newY ?? prev.y,
    //         }));
    //     },
    //     []
    // );

    // --- Zoom with origin locking ---
    const zoomAtOrigin = useCallback(
        (factor: number) => {
            setTransform((prev) => {
                const nextScale = clamp(prev.scale * factor);
                if (!imgRef.current || !innerRef.current) return prev;

                const imgRect = imgRef.current.getBoundingClientRect();
                const originPxX = (originRef.current.x / 100) * imgRect.width;
                const originPxY = (originRef.current.y / 100) * imgRect.height;

                const scaleRatio = nextScale / prev.scale;
                const newX = prev.x - originPxX * (scaleRatio - 1);
                const newY = prev.y - originPxY * (scaleRatio - 1);

                return { scale: nextScale, x: newX, y: newY };
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // --- Public zoom controls ---
    const zoomIn = useCallback(() => zoomAtOrigin(1 + step), [zoomAtOrigin, step]);
    const zoomOut = useCallback(() => zoomAtOrigin(1 - step), [zoomAtOrigin, step]);
    const resetZoom = useCallback(() => {
        setTransform({ scale: 1, x: 0, y: 0 });
        originRef.current = { x: 50, y: 50 };
        setRotation(0);
    }, []);

    // --- Fit to screen (respects rotation) ---
    const fitToScreen = useCallback(() => {
        if (!imgRef.current || !innerRef.current) return;
        const wrapper = innerRef.current.getBoundingClientRect();
        const imgNatural = {
            width: imgRef.current.naturalWidth,
            height: imgRef.current.naturalHeight,
        };
        if (!imgNatural.width || !imgNatural.height) return;

        // Swap dimensions if rotated 90° or 270°
        let fitW = imgNatural.width;
        let fitH = imgNatural.height;
        if (rotation % 180 !== 0) {
            [fitW, fitH] = [fitH, fitW];
        }

        const scaleX = wrapper.width / fitW;
        const scaleY = wrapper.height / fitH;
        const newScale = Math.min(scaleX, scaleY, maxZoom);

        setTransform({ scale: newScale, x: 0, y: 0 });
        originRef.current = { x: 50, y: 50 };
    }, [maxZoom, rotation]);

    // --- Rotate ---
    const rotateCW = useCallback(() => setRotation((r) => (r + 90) % 360), []);
    const rotateCCW = useCallback(() => setRotation((r) => (r - 90 + 360) % 360), []);

    // --- Download with blob fallback (handles CORS better) ---
    const onDownload = useCallback(async () => {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename ?? src.split('/').pop() ?? 'image';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            // Fallback: direct link (may open in new tab if cross-origin)
            const a = document.createElement('a');
            a.href = src;
            a.download = filename ?? src.split('/').pop() ?? 'image';
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    }, [src, filename]);

    // --- Fullscreen state sync ---
    useEffect(() => {
        if (!screenfull.isEnabled) return;
        const onChange = () => {
            setIsFullscreen(screenfull.isFullscreen);
            if (!screenfull.isFullscreen) {
                // Reset state when exiting fullscreen
                setTransform({ scale: 1, x: 0, y: 0 });
                setRotation(0);
            }
        };
        screenfull.on('change', onChange);
        return () => {
            screenfull.off('change', onChange);
        };
    }, []);

    // --- Focus management and trap (accessibility) ---
    useEffect(() => {
        if (!isFullscreen || !fsRef.current) return;

        // Move focus to the dialog
        fsRef.current.focus();

        // Simple focus trap
        const focusableSelectors =
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab' || !fsRef.current) return;

            const focusable = Array.from(
                fsRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
            ).filter((el) => el.offsetParent !== null); // only visible

            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (e.shiftKey) {
                if (active === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    // --- Keyboard shortcuts ---
    useEffect(() => {
        if (!isFullscreen) return;
        const onKey = (e: KeyboardEvent) => {
            const key = e.key;
            const add = key === '+' || key === '=' || e.code === 'NumpadAdd';
            const sub = key === '-' || e.code === 'NumpadSubtract';

            if (add) {
                e.preventDefault();
                zoomIn();
            } else if (sub) {
                e.preventDefault();
                zoomOut();
            } else if (key === '0') {
                e.preventDefault();
                resetZoom();
            } else if (key === 'Escape') {
                e.preventDefault();
                if (screenfull.isEnabled) screenfull.exit();
            } else if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
                e.preventDefault();
                // Apply rotated panning
                let dx = 0,
                    dy = 0;
                if (key === 'ArrowLeft') dx = 50;
                else if (key === 'ArrowRight') dx = -50;
                else if (key === 'ArrowUp') dy = 50;
                else if (key === 'ArrowDown') dy = -50;

                // Rotate delta based on current rotation
                const rad = (rotation * Math.PI) / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                const rotatedDx = dx * cos - dy * sin;
                const rotatedDy = dx * sin + dy * cos;

                setTransform((prev) => ({
                    ...prev,
                    x: prev.x + rotatedDx,
                    y: prev.y + rotatedDy,
                }));
            } else if (key.toLowerCase() === 'd') {
                e.preventDefault();
                onDownload();
            } else if (key.toLowerCase() === 'r') {
                e.preventDefault();
                rotateCW();
            } else if (key.toLowerCase() === 'l') {
                e.preventDefault();
                rotateCCW();
            } else if (key.toLowerCase() === 'f') {
                e.preventDefault();
                fitToScreen();
            }
        };
        window.addEventListener('keydown', onKey, { passive: false });
        return () => window.removeEventListener('keydown', onKey);
    }, [isFullscreen, zoomIn, zoomOut, resetZoom, onDownload, rotateCW, rotateCCW, fitToScreen, rotation]);

    // --- Mouse/Pointer handlers for panning and origin update ---
    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (!innerRef.current) return;
            (e.target as Element).setPointerCapture?.(e.pointerId);
            dragRef.current = {
                active: true,
                startX: e.clientX,
                startY: e.clientY,
                startTx: transform.x,
                startTy: transform.y,
            };
        },
        [transform.x, transform.y]
    );

    const onPointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!dragRef.current.active) return;
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;
            const nextTx = dragRef.current.startTx + dx;
            const nextTy = dragRef.current.startTy + dy;

            if (rafRef.current == null) {
                rafRef.current = requestAnimationFrame(() => {
                    setTransform((prev) => ({ ...prev, x: nextTx, y: nextTy }));
                    rafRef.current = null;
                });
            }
        },
        []
    );

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        dragRef.current.active = false;
        try {
            (e.target as Element).releasePointerCapture?.(e.pointerId);
        } catch { }
    }, []);

    // Update transform-origin on mouse move (for zoom centering)
    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!innerRef.current || dragRef.current.active) return;
        const rect = innerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        originRef.current = {
            x: Math.min(100, Math.max(0, x)),
            y: Math.min(100, Math.max(0, y)),
        };
    }, []);

    // --- Wheel handling (zoom with Ctrl/Cmd, pan otherwise) ---
    const onWheel = useCallback(
        (e: React.WheelEvent) => {
            if (!isFullscreen) return;
            e.preventDefault(); // always prevent background scroll

            const zoomIntent = e.ctrlKey || e.metaKey || e.shiftKey;
            if (zoomIntent) {
                const delta = -e.deltaY;
                const factor = delta > 0 ? 1 + step : 1 - step;
                zoomAtOrigin(factor);
            } else if (transform.scale > 1) {
                // pan with wheel
                setTransform((prev) => ({
                    ...prev,
                    x: prev.x - e.deltaX,
                    y: prev.y - e.deltaY,
                }));
            }
        },
        [isFullscreen, step, transform.scale, zoomAtOrigin]
    );

    // --- Double-click to zoom in / reset ---
    const onDoubleClick = useCallback(
        (e: React.MouseEvent) => {
            if (!innerRef.current || !imgRef.current) return;
            const rect = innerRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            originRef.current = { x, y };
            if (transform.scale <= 1) {
                zoomAtOrigin(2);
            } else {
                resetZoom();
            }
        },
        [transform.scale, zoomAtOrigin, resetZoom]
    );

    // --- Touch handlers (pinch + pan) ---
    useEffect(() => {
        const wrapper = innerRef.current;
        if (!wrapper) return;

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                const t0 = e.touches[0];
                const t1 = e.touches[1];
                const dx = t1.clientX - t0.clientX;
                const dy = t1.clientY - t0.clientY;
                const dist = Math.hypot(dx, dy);
                pinchRef.current = {
                    initialDistance: dist,
                    initialScale: transform.scale,
                    initialTx: transform.x,
                    initialTy: transform.y,
                    lastCenter: {
                        x: (t0.clientX + t1.clientX) / 2,
                        y: (t0.clientY + t1.clientY) / 2,
                    },
                };
            } else if (e.touches.length === 1) {
                const t = e.touches[0];
                dragRef.current = {
                    active: true,
                    startX: t.clientX,
                    startY: t.clientY,
                    startTx: transform.x,
                    startTy: transform.y,
                };
            }
        };

        const onTouchMove = (e: TouchEvent) => {
            if (pinchRef.current && e.touches.length === 2) {
                e.preventDefault();
                const t0 = e.touches[0];
                const t1 = e.touches[1];
                const dx = t1.clientX - t0.clientX;
                const dy = t1.clientY - t0.clientY;
                const dist = Math.hypot(dx, dy);
                const ratio = dist / pinchRef.current.initialDistance;
                const newScale = clamp(pinchRef.current.initialScale * ratio);

                // Calculate center of pinch in wrapper coordinates
                const center = {
                    x: (t0.clientX + t1.clientX) / 2,
                    y: (t0.clientY + t1.clientY) / 2,
                };
                const rect = wrapper.getBoundingClientRect();
                const originX = ((center.x - rect.left) / rect.width) * 100;
                const originY = ((center.y - rect.top) / rect.height) * 100;
                originRef.current = { x: originX, y: originY };

                // Adjust translation to keep center fixed
                const imgRect = imgRef.current?.getBoundingClientRect();
                if (imgRect) {
                    const originPxX = (originX / 100) * imgRect.width;
                    const originPxY = (originY / 100) * imgRect.height;
                    const scaleRatio = newScale / pinchRef.current.initialScale;
                    const newX = pinchRef.current.initialTx - originPxX * (scaleRatio - 1);
                    const newY = pinchRef.current.initialTy - originPxY * (scaleRatio - 1);
                    setTransform({ scale: newScale, x: newX, y: newY });
                } else {
                    setTransform((prev) => ({ ...prev, scale: newScale }));
                }
            } else if (dragRef.current.active && e.touches.length === 1) {
                e.preventDefault();
                const t = e.touches[0];
                const dx = t.clientX - dragRef.current.startX;
                const dy = t.clientY - dragRef.current.startY;
                setTransform((prev) => ({
                    ...prev,
                    x: dragRef.current.startTx + dx,
                    y: dragRef.current.startTy + dy,
                }));
            }
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (e.touches.length < 2) pinchRef.current = null;
            if (e.touches.length === 0) dragRef.current.active = false;
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
    }, [transform.scale, transform.x, transform.y]); // re-run when transform changes to keep refs fresh

    // --- Set imgRef when image loads ---
    const onImageLoad = useCallback((img: HTMLImageElement) => {
        imgRef.current = img;
    }, []);

    // --- Fullscreen open/close ---
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

    // --- Transform style for image ---
    const transformStyle: React.CSSProperties = {
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${rotation}deg)`,
        transformOrigin: `${originRef.current.x}% ${originRef.current.y}%`,
        transition: 'transform 100ms linear',
        willChange: 'transform',
        maxWidth: 'none',
        height: 'auto',
        display: 'block',
    };

    // --- Wrapper style for fullscreen inner area ---
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
                className={`fixed inset-0 z-9999 bg-black ${isFullscreen ? 'flex' : 'hidden'} flex-col`}
                aria-hidden={!isFullscreen}
                role="dialog"
                aria-modal="true"
                aria-label="Fullscreen image viewer"
                tabIndex={-1} // make focusable
            >
                {/* Top controls */}
                <div className="fixed top-0 left-0 right-0 z-10001 pointer-events-none">
                    <div className="flex justify-end gap-2 p-4 bg-linear-to-b from-black/70 to-transparent pointer-events-auto">
                        <button
                            onClick={zoomOut}
                            aria-label="Zoom out (minus)"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            Zoom Out (-)
                        </button>
                        <button
                            onClick={resetZoom}
                            aria-label="Reset zoom"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            Reset (0)
                        </button>
                        <button
                            onClick={zoomIn}
                            aria-label="Zoom in (plus)"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            Zoom In (+)
                        </button>
                        <button
                            onClick={fitToScreen}
                            aria-label="Fit to screen"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            Fit (F)
                        </button>
                        <button
                            onClick={rotateCCW}
                            aria-label="Rotate left"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            ⟲ L
                        </button>
                        <button
                            onClick={rotateCW}
                            aria-label="Rotate right"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            ⟳ R
                        </button>
                        <button
                            onClick={onDownload}
                            aria-label="Download image"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            Download (D)
                        </button>
                        <button
                            onClick={closeFullscreen}
                            aria-label="Close fullscreen"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-black/60 border border-white/10 hover:bg-black/80 transition"
                        >
                            Esc ✕
                        </button>
                    </div>
                </div>

                {/* Zoom HUD */}
                <div style={{ position: 'fixed', left: 16, top: 16, zIndex: 10002 }}>
                    <div className="px-3 py-2 rounded bg-black/60 text-white border border-white/10">
                        <strong>{Math.round(transform.scale * 100)}%</strong>
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
                        style={{ paddingTop: 48, touchAction: 'none' }}
                    >
                        <Image
                            src={src}
                            alt={alt}
                            width={width}
                            height={height}
                            loading="lazy"
                            unoptimized
                            style={transformStyle}
                            onLoadingComplete={onImageLoad}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
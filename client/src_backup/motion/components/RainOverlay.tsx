import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface RainOverlayProps {
  /** Number of raindrops simulated concurrently */
  intensity?: number;
  /** Base speed multiplier for drops */
  speed?: number;
  /** CSS color for the rain stroke */
  color?: string;
  /** Max angle wind in radians (positive = slant to right) */
  wind?: number;
  /** Additional className for the canvas element */
  className?: string;
  /** Render canvas into document.body via portal for guaranteed viewport sizing */
  portal?: boolean;
}

/**
 * Lightweight canvas-based rain animation overlay.
 *
 * Usage:
 * <RainOverlay intensity={200} speed={1} />
 */
const RainOverlay: React.FC<RainOverlayProps> = ({
  intensity = 180,
  speed = 1,
  color = "rgba(180, 200, 255, 0.35)",
  wind = 0.35,
  className = "",
  portal = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle DPR for crisp rendering
    let viewW = 0;
    let viewH = 0;
    const setSize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      let w: number;
      let h: number;
      if (portal) {
        // Use viewport directly when rendering into body
        w = window.innerWidth;
        h = window.innerHeight;
      } else {
        const rect = canvas.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        if (w < 2 || h < 2) {
          w = window.innerWidth;
          h = window.innerHeight;
        }
      }
      viewW = Math.max(1, Math.floor(w));
      viewH = Math.max(1, Math.floor(h));
      const targetW = Math.floor(viewW * dpr);
      const targetH = Math.floor(viewH * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    setSize();
    const onResize = () => setSize();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize as any);
    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => setSize());
      ro.observe(canvas);
    }

    type Drop = {
      x: number;
      y: number;
      len: number;
      vy: number;
      vx: number;
      w: number; // line width
      alpha: number;
    };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    // Spawn initial drops
    const drops: Drop[] = [];
    const spawn = (n: number) => {
      for (let i = 0; i < n; i++) {
        const s = rand(0.8, 1.6) * speed;
        const angle = rand(-wind, wind);
        drops.push({
          x: rand(0, viewW),
          y: rand(-viewH, 0),
          len: rand(8, 18),
          vy: rand(380, 620) * s,
          vx: Math.tan(angle) * rand(220, 360) * 0.2 * s,
          w: rand(0.75, 1.5),
          alpha: rand(0.25, 0.6),
        });
      }
    };

    spawn(intensity);

    let last = performance.now();

    const step = (t: number) => {
      const dt = Math.min(50, t - last) / 1000; // clamp delta to avoid big jumps
      last = t;

      // Clear with subtle fade for motion trails
      ctx.clearRect(0, 0, viewW, viewH);

      ctx.lineCap = "round";

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.x += d.vx * dt;
        d.y += d.vy * dt;

        // Recycle drop when exiting screen
        if (d.y - d.len > viewH || d.x < -20 || d.x > viewW + 20) {
          const s = rand(0.8, 1.6) * speed;
          const angle = rand(-wind, wind);
          d.x = rand(0, viewW);
          d.y = rand(-viewH * 0.2, 0);
          d.len = rand(8, 18);
          d.vy = rand(380, 620) * s;
          d.vx = Math.tan(angle) * rand(220, 360) * 0.2 * s;
          d.w = rand(0.75, 1.5);
          d.alpha = rand(0.25, 0.6);
        }

        ctx.strokeStyle = color.replace(/\b(0?\.\d+|1(\.0+)?)\)$/,
          `${d.alpha})`
        );
        ctx.lineWidth = d.w;

        // Draw the drop as a short slanted line
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.vx * 0.02, d.y - d.vy * 0.02 - d.len);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize as any);
      if (ro) ro.disconnect();
    };
  }, [intensity, speed, color, wind, portal]);

  const canvasEl = (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none w-full h-full ${className}`}
    />
  );

  // By default, render into body so it's not constrained by containers
  return portal && typeof document !== "undefined"
    ? createPortal(canvasEl, document.body)
    : canvasEl;
};

export default RainOverlay;

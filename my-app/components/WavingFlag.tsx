"use client";

import { useEffect, useRef } from "react";

const FLAG_W = 600;
const FLAG_H = 400;
const STRIPS = 160;   // vertical slices — more = smoother wave
const AMP    = 30;    // max wave amplitude (px internal coords)
const FREQ   = 1.6;   // wave cycles visible across the flag
const SPEED  = 0.032; // radians per frame

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

function drawChakra(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.strokeStyle = "#000080";
  ctx.lineWidth = Math.max(1.5, r * 0.075);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = Math.max(0.8, r * 0.04);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r * 0.15, cy + Math.sin(a) * r * 0.15);
    ctx.lineTo(cx + Math.cos(a) * r * 0.93, cy + Math.sin(a) * r * 0.93);
    ctx.stroke();
  }

  ctx.fillStyle = "#000080";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.13, 0, Math.PI * 2);
  ctx.fill();
}

export default function WavingFlag({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    function frame() {
      const sw  = FLAG_W / STRIPS;
      const h3  = FLAG_H / 3;

      ctx!.clearRect(0, 0, FLAG_W, FLAG_H);

      for (let i = 0; i < STRIPS; i++) {
        const nx  = i / (STRIPS - 1);
        const amp = AMP * nx;                                   // 0 at pole, max at free edge
        const dy  = Math.sin(nx * Math.PI * 2 * FREQ - phase) * amp;

        // cosine gives slope → used for shading (light from upper-left)
        const slope = Math.cos(nx * Math.PI * 2 * FREQ - phase);
        const shade = slope * amp * 0.9;                        // −ve = shadow, +ve = highlight

        const x = i * sw;

        // ── Saffron ──
        ctx!.fillStyle = `rgb(${clamp(255 + shade * 0.4, 195, 255)},${clamp(153 + shade * 0.5, 95, 200)},${clamp(51 + shade * 0.3, 8, 100)})`;
        ctx!.fillRect(x, dy, sw + 0.6, h3 + 0.5);

        // ── White ──
        const wv = clamp(248 + shade * 0.25, 185, 255);
        ctx!.fillStyle = `rgb(${wv},${wv},${clamp(244 + shade * 0.25, 185, 255)})`;
        ctx!.fillRect(x, h3 + dy, sw + 0.6, h3 + 0.5);

        // ── Green ──
        ctx!.fillStyle = `rgb(${clamp(19 + shade * 0.15, 0, 55)},${clamp(136 + shade * 0.65, 78, 192)},${clamp(8 + shade * 0.1, 0, 28)})`;
        ctx!.fillRect(x, h3 * 2 + dy, sw + 0.6, h3 + 1);
      }

      // Ashoka Chakra at wave-offset center
      const midDy = Math.sin(0.5 * Math.PI * 2 * FREQ - phase) * AMP * 0.5;
      drawChakra(ctx!, FLAG_W / 2, FLAG_H / 2 + midDy, FLAG_H * 0.147);

      // Soft left-edge vignette so flag visually "starts" at the pole
      const grad = ctx!.createLinearGradient(0, 0, 40, 0);
      grad.addColorStop(0, "rgba(7,7,14,0.55)");
      grad.addColorStop(1, "rgba(7,7,14,0)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, 40, FLAG_H);

      phase += SPEED;
      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className={`flex items-start ${className}`}>

      {/* ── Golden Flagpole ── */}
      <div className="relative shrink-0 flex flex-col items-center z-10" style={{ width: 28, height: "100%" }}>
        {/* Spear / Finial */}
        <div style={{
          width: 0, height: 0,
          borderLeft:  "7px solid transparent",
          borderRight: "7px solid transparent",
          borderBottom: "22px solid #d4a017",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
          flexShrink: 0,
          marginTop: -24,
        }} />
        {/* Shaft */}
        <div style={{
          flex: 1,
          width: 9,
          background: "linear-gradient(90deg,#e8c76a 0%,#f8e090 22%,#d4a017 55%,#9a7310 100%)",
          borderRadius: 4.5,
          boxShadow: "3px 0 14px rgba(0,0,0,0.55), inset -2px 0 5px rgba(0,0,0,0.25)",
        }} />
        {/* Horizontal rope ring where flag attaches */}
        <div style={{
          position: "absolute",
          top: 24,
          width: 20,
          height: 4,
          background: "linear-gradient(90deg,#c9a84c,#f8e090,#c9a84c)",
          borderRadius: 2,
          boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }} />
        {/* Base plinth */}
        <div style={{
          width: 36,
          height: 16,
          background: "linear-gradient(180deg,#d4a017 0%,#8B6914 60%,#5c430d 100%)",
          borderRadius: "0 0 6px 6px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.65)",
        }} />
      </div>

      {/* ── Canvas flag ── */}
      <canvas
        ref={canvasRef}
        width={FLAG_W}
        height={FLAG_H}
        className="block"
        style={{
          width: "100%",
          borderRadius: "0 14px 14px 0",
          boxShadow: "10px 10px 50px rgba(0,0,0,0.6), 0 0 100px rgba(255,153,51,0.1)",
        }}
      />
    </div>
  );
}

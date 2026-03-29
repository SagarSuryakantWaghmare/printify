"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  afterImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&sat=-100",
  beforeLabel = "ORIGINAL",
  afterLabel = "AI ENHANCED",
}: BeforeAfterSliderProps = {}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const getRelativeX = useCallback((clientX: number): number => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    const x = clientX - rect.left;
    return Math.min(Math.max((x / rect.width) * 100, 0), 100);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setSliderPos(getRelativeX(e.clientX));
    },
    [isDragging, getRelativeX]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      setSliderPos(getRelativeX(e.touches[0].clientX));
    },
    [isDragging, getRelativeX]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, #1a1a2e 0%, #0d0d1a 55%, #060608 100%)",
      }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: 600,
            height: 400,
            top: "5%",
            left: "10%",
            background: "radial-gradient(circle, #FF5A36, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-15"
          style={{
            width: 500,
            height: 400,
            top: "15%",
            right: "5%",
            background: "radial-gradient(circle, #FF8A65, transparent 70%)",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center relative z-20">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-[#FF5A36]/30 bg-[#FF5A36]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36] animate-pulse" />
            <span
              className="text-xs font-semibold tracking-widest text-[#FF5A36] uppercase"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              AI Vision Engine
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black leading-tight tracking-tight font-display"
            style={{}}
          >
            <span className="bg-gradient-to-r from-[#FF5A36] via-[#FF8A65] to-[#FF6B4A] bg-clip-text text-transparent">
              See the AI
            </span>
            <br />
            <span className="text-white">Transformation</span>
          </h1>
          <p
            className="mt-3 text-sm sm:text-base text-white/40 max-w-md mx-auto leading-relaxed font-sans"
            style={{}}
          >
            Drag the divider to reveal the difference between original and
            AI-enhanced imagery in real time.
          </p>
        </div>

        {/* Slider Container */}
        <div className="px-6 pb-2 relative z-20">
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-2xl select-none"
            style={{
              cursor: isDragging ? "col-resize" : "ew-resize",
              aspectRatio: "16/9",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08) inset",
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
              setIsDragging(true);
              setSliderPos(getRelativeX(e.touches[0].clientX));
            }}
          >
            {/* BOTTOM: original (full width) */}
            <img
              src={beforeImage}
              alt="Original"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "grayscale(100%) brightness(0.85)" }}
            />

            {/* TOP: AI enhanced (clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={afterImage}
                alt="AI Enhanced"
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  maxWidth: "none",
                  filter: "saturate(1.3) contrast(1.05) brightness(1.05)",
                }}
              />
            </div>

            {/* Divider line */}
            <div
              className="absolute top-0 bottom-0 z-30"
              style={{
                left: `${sliderPos}%`,
                transform: "translateX(-50%)",
              }}
            >
              {/* Line */}
              <div
                className="absolute inset-y-0 left-1/2 -translate-x-1/2"
                style={{ width: 2, background: "rgba(255,255,255,0.9)" }}
              />

              {/* Handle */}
              <div
                className="absolute rounded-full transition-transform duration-150 hover:scale-110"
                style={{
                  top: "50%",
                  left: "50%",
                  width: 60,
                  height: 60,
                  marginLeft: -30,
                  marginTop: -30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 40,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.5), inset 0 0 0 4px rgba(255,255,255,0.2)",
                  transform: isDragging ? "scale(1.2)" : "scale(1)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: "block" }}
                >
                  <path
                    d="M8 6L3 12L8 18M16 6L21 12L16 18"
                    stroke="#1a1a1a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* LEFT label — AI Enhanced */}
            <div
              className="absolute top-4 left-4 z-20 pointer-events-none"
              style={{
                opacity: sliderPos > 12 ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            >
              <div
                className="px-3 py-1.5 rounded-lg text-white text-xs font-bold tracking-widest uppercase"
                style={{
                  background: "linear-gradient(90deg, #FF5A36, #FF8A65)",
                  fontFamily: "'DM Mono', monospace",
                  boxShadow: "0 2px 12px rgba(255,90,54,0.4)",
                }}
              >
                {afterLabel}
              </div>
              <p
                className="mt-1 text-white/60 text-[10px] pl-1"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Neural upscale · HDR
              </p>
            </div>

            {/* RIGHT label — Original */}
            <div
              className="absolute top-4 right-4 z-20 pointer-events-none text-right"
              style={{
                opacity: sliderPos < 88 ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            >
              <div
                className="inline-block px-3 py-1.5 rounded-lg text-white/90 text-xs font-bold tracking-widest uppercase"
                style={{
                  background: "rgba(0,0,0,0.55)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontFamily: "'DM Mono', monospace",
                  backdropFilter: "blur(8px)",
                }}
              >
                {beforeLabel}
              </div>
              <p
                className="mt-1 text-white/40 text-[10px] pr-1"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Unprocessed · Raw
              </p>
            </div>

            {/* Gradient vignette */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)",
              }}
            />
          </div>
        </div>

        {/* Slider progress bar */}
        <div className="px-6 pt-4 relative z-20">
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] text-[#FF5A36] font-bold tracking-widest uppercase"
              style={{ fontFamily: "'DM Mono', monospace", minWidth: 36 }}
            >
              {Math.round(sliderPos)}%
            </span>
            <div className="flex-1 h-0.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${sliderPos}%`,
                  background: "linear-gradient(90deg, #FF5A36, #FF8A65)",
                }}
              />
            </div>
            <span
              className="text-[10px] text-white/30 font-medium tracking-widest uppercase"
              style={{ fontFamily: "'DM Mono', monospace", minWidth: 36, textAlign: "right" }}
            >
              100%
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pt-5 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-20">
          <div className="flex items-center gap-2 text-white/35">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
            </svg>
            <span
              className="text-xs"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Drag to compare before and after
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full bg-green-400"
              style={{ boxShadow: "0 0 6px #22c55e" }}
            />
            <span
              className="text-xs text-white/35"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Live compliance preview
            </span>
          </div>
        </div>
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&display=swap');
      `}</style>
    </div>
  );
}
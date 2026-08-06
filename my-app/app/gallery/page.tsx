"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const photos = [
  { id: 1,  src: "https://nischalsingana.com/PHOTOS/DSC09263.JPG", caption: "79th Independence Day Celebrations" },
  { id: 2,  src: "https://nischalsingana.com/PHOTOS/DSC09241.JPG", caption: "79th Independence Day Celebrations" },
  { id: 3,  src: "https://nischalsingana.com/PHOTOS/DSC09262.JPG", caption: "79th Independence Day Celebrations" },
  { id: 4,  src: "https://nischalsingana.com/PHOTOS/DSC09226.JPG", caption: "79th Independence Day Celebrations" },
  { id: 5,  src: "https://nischalsingana.com/PHOTOS/DSC09270.JPG", caption: "79th Independence Day Celebrations" },
  { id: 6,  src: "https://nischalsingana.com/PHOTOS/DSC09274.JPG", caption: "79th Independence Day Celebrations" },
  { id: 7,  src: "https://nischalsingana.com/PHOTOS/DSC09279.JPG", caption: "79th Independence Day Celebrations" },
  { id: 8,  src: "https://nischalsingana.com/PHOTOS/DSC09283.JPG", caption: "79th Independence Day Celebrations" },
  { id: 9,  src: "https://nischalsingana.com/PHOTOS/DSC09291.JPG", caption: "79th Independence Day Celebrations" },
  { id: 10, src: "https://nischalsingana.com/PHOTOS/DSC09305.JPG", caption: "79th Independence Day Celebrations" },
  { id: 11, src: "https://nischalsingana.com/PHOTOS/DSC09313.JPG", caption: "79th Independence Day Celebrations" },
  { id: 12, src: "https://nischalsingana.com/PHOTOS/DSC09318.JPG", caption: "79th Independence Day Celebrations" },
];

/* ─── Photo tile — no Framer Motion, no state ─── */
function PhotoTile({
  photo,
  index,
  onClick,
}: {
  photo: (typeof photos)[0];
  index: number;
  onClick: () => void;
}) {
  const num = String(photo.id).padStart(2, "0");

  return (
    <div
      className="gallery-tile relative w-full h-full min-h-[140px] overflow-hidden rounded-2xl group cursor-pointer select-none bg-[#0F0F1A]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.caption}
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
      />

      {/* Permanent bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* Hover overlay — CSS only, no JS */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Frame number */}
      <div className="absolute top-3 left-3.5 font-[family-name:var(--font-cinzel)] text-[10px] font-black text-white/20 tracking-[0.3em] group-hover:text-white/80 transition-colors duration-300 pointer-events-none">
        {num}
      </div>

      {/* Expand icon */}
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-250 pointer-events-none">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 2M10 2H4M10 2V8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Caption — slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <div className="flex gap-0 mb-1.5 rounded-full overflow-hidden" style={{ height: 2, width: 32 }}>
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>
        <p className="text-white text-[11px] font-semibold tracking-wide leading-tight">{photo.caption}</p>
        <p className="text-white/35 text-[9px] tracking-widest mt-0.5 uppercase">KL University · 2025</p>
      </div>
    </div>
  );
}

/* ─── Thin section mark ─── */
function SectionMark({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#FF9933]/12" />
      <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]/40" />
        <span className="text-[8px] tracking-[0.45em] text-white/15 font-bold uppercase font-[family-name:var(--font-cinzel)]">
          {label}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#138808]/40" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#138808]/12" />
    </div>
  );
}

export default function GalleryPage() {
  const [selected, setSelected] = useState<(typeof photos)[0] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const open = (photo: (typeof photos)[0], i: number) => {
    setSelected(photo);
    setSelectedIndex(i);
  };
  const close = () => setSelected(null);
  const prev = () => {
    const i = (selectedIndex - 1 + photos.length) % photos.length;
    setSelected(photos[i]);
    setSelectedIndex(i);
  };
  const next = () => {
    const i = (selectedIndex + 1) % photos.length;
    setSelected(photos[i]);
    setSelectedIndex(i);
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-16 sm:pt-20 pb-10 sm:pb-14 bg-gradient-to-b from-[#0A0A15] to-[#07070E] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#FF9933]/3 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <p className="text-[10px] tracking-[0.4em] text-[#FF9933] uppercase font-semibold mb-3 font-[family-name:var(--font-cinzel)] hero-enter-1">
            ✦ Captured Moments ✦
          </p>
          <h1 className="font-[family-name:var(--font-cinzel)] font-black leading-tight mb-5 hero-enter-2">
            <span className="block text-4xl sm:text-5xl lg:text-7xl text-white">Gallery of</span>
            <span className="block text-5xl sm:text-6xl lg:text-8xl gradient-text-tri">Pride</span>
          </h1>
          <p className="text-[#8888A8] text-base max-w-xl mx-auto leading-relaxed mb-4 hero-enter-3">
            A visual celebration of patriotism, talent, and unity — moments that make KL University proud.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 hero-enter-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#FF9933]" />
            <span className="text-[10px] tracking-[0.25em] text-[#FF9933]/70 uppercase font-semibold">
              79th Independence Day · KL University
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#138808]" />
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="pb-16 bg-[#07070E]">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">

          {/* MOBILE: 2-col grid */}
          <div className="md:hidden grid grid-cols-2 gap-2">
            {photos.map((photo, i) => {
              const mh = [230, 190, 200, 250, 185, 225, 210, 180, 245, 200, 215, 190];
              return (
                <div key={photo.id} style={{ height: mh[i] }}>
                  <PhotoTile photo={photo} index={i} onClick={() => open(photo, i)} />
                </div>
              );
            })}
          </div>

          {/* DESKTOP: Editorial magazine layout */}
          <div className="hidden md:block space-y-3">

            {/* Block 1: Hero left + 2 stacked right */}
            <div className="grid gap-3 h-[520px]" style={{ gridTemplateColumns: "2fr 1fr" }}>
              <PhotoTile photo={photos[0]} index={0} onClick={() => open(photos[0], 0)} />
              <div className="grid grid-rows-2 gap-3">
                <PhotoTile photo={photos[1]} index={1} onClick={() => open(photos[1], 1)} />
                <PhotoTile photo={photos[2]} index={2} onClick={() => open(photos[2], 2)} />
              </div>
            </div>

            <SectionMark label="15 August 2025 · KL University SAC" />

            {/* Block 2: Three equal strip */}
            <div className="grid grid-cols-3 gap-3 h-[310px]">
              <PhotoTile photo={photos[3]} index={3} onClick={() => open(photos[3], 3)} />
              <PhotoTile photo={photos[4]} index={4} onClick={() => open(photos[4], 4)} />
              <PhotoTile photo={photos[5]} index={5} onClick={() => open(photos[5], 5)} />
            </div>

            <SectionMark label="Patriotism · Unity · Pride" />

            {/* Block 3: 2 stacked left + Hero right */}
            <div className="grid gap-3 h-[520px]" style={{ gridTemplateColumns: "1fr 2fr" }}>
              <div className="grid grid-rows-2 gap-3">
                <PhotoTile photo={photos[6]} index={6} onClick={() => open(photos[6], 6)} />
                <PhotoTile photo={photos[7]} index={7} onClick={() => open(photos[7], 7)} />
              </div>
              <PhotoTile photo={photos[8]} index={8} onClick={() => open(photos[8], 8)} />
            </div>

            <SectionMark label="Jai Hind · 79th Independence Day" />

            {/* Block 4: Wide trio finale */}
            <div className="grid grid-cols-3 gap-3 h-[380px]">
              <PhotoTile photo={photos[9]}  index={9}  onClick={() => open(photos[9],  9)} />
              <PhotoTile photo={photos[10]} index={10} onClick={() => open(photos[10], 10)} />
              <PhotoTile photo={photos[11]} index={11} onClick={() => open(photos[11], 11)} />
            </div>

          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-8 bg-white/8" />
            <span className="text-[8px] tracking-[0.5em] text-white/12 font-[family-name:var(--font-cinzel)] font-bold uppercase">
              12 Frames · KLU Independence Day 2025
            </span>
            <div className="h-px w-8 bg-white/8" />
          </div>
        </div>
      </section>

      {/* ── Lightbox — Framer Motion only here ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/93 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.28 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Counter */}
              <div className="absolute -top-9 right-0 flex items-center gap-2">
                <span className="font-[family-name:var(--font-cinzel)] text-xs text-white/40 tabular-nums">
                  {String(selectedIndex + 1).padStart(2, "0")}
                </span>
                <div className="h-px w-16 bg-white/15" />
                <span className="font-[family-name:var(--font-cinzel)] text-xs text-white/20 tabular-nums">
                  {String(photos.length).padStart(2, "0")}
                </span>
              </div>

              {/* Image */}
              <div className="rounded-2xl overflow-hidden bg-[#0F0F1A] ring-1 ring-white/8 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex items-center justify-center min-h-[280px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.src}
                  alt={selected.caption}
                  decoding="async"
                  className="w-full max-h-[75vh] object-contain"
                />
              </div>

              {/* Caption */}
              <div className="mt-4 px-1">
                <div className="flex gap-0 mb-2 rounded-full overflow-hidden" style={{ height: 2, width: 40 }}>
                  <div className="flex-1 bg-[#FF9933]" />
                  <div className="flex-1 bg-white" />
                  <div className="flex-1 bg-[#138808]" />
                </div>
                <p className="text-white font-semibold text-sm">{selected.caption}</p>
                <p className="text-[#8888A8] text-xs mt-1">KL University · 79th Independence Day Celebrations</p>
              </div>

              <button onClick={prev} className="absolute left-3 md:-left-14 top-[44%] -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/22 flex items-center justify-center text-white transition-colors z-10">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={next} className="absolute right-3 md:-right-14 top-[44%] -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/22 flex items-center justify-center text-white transition-colors z-10">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={close} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-black/80 transition-colors z-10">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-white/8 bg-[#07070E] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(255,153,51,0.03)] to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[#FF9933]/40" />
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
              <span className="w-2 h-2 rounded-full bg-white/60" />
              <span className="w-2 h-2 rounded-full bg-[#138808]" />
            </div>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[#138808]/40" />
          </div>
          <p className="text-[#8888A8] text-sm mb-1 tracking-wide">© 2026 KL University · Student Activity Centre</p>
          <p className="text-[#8888A8]/50 text-xs mb-6">Celebrating 80 Years of Independence · Jai Hind 🇮🇳</p>
          <div className="border-t border-white/5 pt-5">
            <p className="text-[#8888A8]/70 text-xs tracking-wide">
              Designed &amp; Developed by{" "}
              <a href="https://www.linkedin.com/in/singananischal/" target="_blank" rel="noopener noreferrer"
                className="text-white font-medium hover:text-white/80 transition-colors duration-200 underline underline-offset-2 decoration-white/20 hover:decoration-white/50">
                Nischal Singana
              </a>
              {" "}|{" "}
              <span className="text-white/60">ZeroOne Code Club</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

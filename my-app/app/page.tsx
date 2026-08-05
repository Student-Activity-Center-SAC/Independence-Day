"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AshokaCss from "@/components/AshokaCss";
import ParticleCanvas from "@/components/ParticleCanvas";
import WavingFlag from "@/components/WavingFlag";

/* ─── countdown ─── */
function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  /* Start with zeros — SSR and initial client render match; real values set in effect */
  const [cd, setCd] = useState(() => calc());
  useEffect(() => {
    const id = setInterval(() => setCd(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return cd;
}

/* ─── data ─── */
const timeline = [
  { year: "1857", title: "First War of Independence", icon: "⚔️", color: "#FF9933", desc: "The Great Revolt of 1857 became the first major uprising against British colonial rule, igniting the flame of independence across India." },
  { year: "1905", title: "Partition of Bengal & Swadeshi", icon: "🔥", color: "#FF9933", desc: "Lord Curzon's partition of Bengal sparked the Swadeshi movement — a powerful economic and cultural resistance that united Indians." },
  { year: "1919", title: "Jallianwala Bagh Massacre", icon: "🕯️", color: "#FF9933", desc: "The massacre at Amritsar fuelled nationwide outrage and strengthened the resolve for complete independence under Mahatma Gandhi." },
  { year: "1930", title: "Dandi Salt March", icon: "🚶", color: "#FFFFFF", desc: "Gandhi led 240 miles to the sea in defiance of the Salt Tax — one of the most iconic acts of civil disobedience in history." },
  { year: "1942", title: "Quit India Movement", icon: "✊", color: "#138808", desc: "'Do or Die' — Gandhi's clarion call electrified the nation. Millions took to the streets demanding immediate British withdrawal." },
  { year: "1947", title: "Independence at Midnight", icon: "🇮🇳", color: "#138808", desc: "At the stroke of midnight on 15 August 1947, India awoke to life and freedom. Nehru's 'Tryst with Destiny' speech echoed through history." },
  { year: "2026", title: "80th Independence Day", icon: <AshokaCss size={32} color="#138808" />, color: "#138808", desc: "KL University honors 80 glorious years of freedom with pride, creativity, competitions, and the spirit of a new India." },
];

const stats = [
  { value: "80", label: "Years of Freedom", suffix: "" },
  { value: "9", label: "Competitions", suffix: "+" },
  { value: "11", label: "Clubs", suffix: "" },
  { value: "15", label: "August 2026", suffix: "" },
];

/* ─── fade-in helper ─── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── countdown box ─── */
function CBox({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-[#0F0F1A] border border-[rgba(255,153,51,0.25)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,153,51,0.06)] to-transparent" />
        <AnimatePresence mode="popLayout">
          <motion.span key={n} initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }} transition={{ duration: 0.25 }} className="text-xl sm:text-3xl lg:text-4xl font-black font-[family-name:var(--font-cinzel)] text-white tabular-nums">
            {String(n).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1.5 text-[8px] sm:text-[10px] tracking-widest text-[#8888A8] uppercase">{label}</span>
    </div>
  );
}

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const cd = useCountdown(new Date("2026-08-15T00:00:00+05:30"));

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <>
      {/* ══ HERO ══ */}
      <section ref={heroRef} className="relative h-screen min-h-[580px] overflow-hidden">
        <motion.div style={{ scale: videoScale }} className="absolute inset-0">
          <video
            ref={videoRef}
            src="https://nischalsingana.com/0805.mp4"
            autoPlay muted loop playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(7,7,14,0.5)] via-[rgba(7,7,14,0.3)] to-[rgba(7,7,14,0.95)]" />

        {/* Tricolor pole */}
        <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col z-20">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <motion.div style={{ opacity: overlayOpacity, y: titleY }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          {/* CSS entrance animation — immune to React strict-mode double-mount */}
          <div className="mb-6 chakra-spin-slow opacity-80 hero-enter-1">
            <AshokaCss size={72} />
          </div>

          <p className="text-[10px] sm:text-xs tracking-[0.25em] text-[#FF9933] font-semibold uppercase mb-4 font-[family-name:var(--font-cinzel)] hero-enter-2">
            KL University · Student Activity Centre
          </p>

          <h1 className="font-[family-name:var(--font-cinzel)] font-black text-[2.4rem] sm:text-6xl lg:text-[5.5rem] leading-tight mb-5 saffron-glow-text hero-enter-3">
            <span className="gradient-text-tri">80th</span>
            <br />
            <span className="text-white">Independence</span>
            <br />
            <span className="gradient-text-saffron">Day</span>
          </h1>

          <p className="text-white/65 text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed hero-enter-4">
            Celebrating 80 glorious years of freedom with pride, passion, creativity, and nation building.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0 hero-enter-5">
            <Link href="/register" className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black font-bold text-sm tracking-wide hover:shadow-[0_0_28px_rgba(255,153,51,0.5)] hover:-translate-y-0.5 transition-all duration-300 text-center">
              Register Now →
            </Link>
            <Link href="/competitions" className="px-8 py-3.5 rounded-full border border-white/25 text-white font-semibold text-sm tracking-wide hover:bg-white/8 hover:border-white/50 transition-all duration-300 text-center">
              View Competitions
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 scroll-bounce z-20">
          <span className="text-[9px] text-white/40 tracking-widest uppercase">Scroll</span>
          <svg width="14" height="22" viewBox="0 0 14 22" className="text-[#FF9933]">
            <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <motion.rect x="5.5" y="4" width="3" height="5" rx="1.5" fill="currentColor" animate={{ y: [4, 11, 4] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}/>
          </svg>
        </div>

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          title={isMuted ? "Unmute video" : "Mute video"}
          className="absolute bottom-8 right-6 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 hover:border-[#FF9933]/50 transition-all duration-300 group hero-enter-5"
        >
          {isMuted ? (
            /* Volume off */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-[#FF9933] transition-colors">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            /* Volume on */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF9933]">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
          {/* Tooltip */}
          <span className="absolute right-full mr-3 text-[10px] whitespace-nowrap bg-black/70 text-white/80 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {isMuted ? "Tap to unmute" : "Mute"}
          </span>
        </button>
      </section>

      {/* ══ COUNTDOWN ══ */}
      <section className="relative py-16 bg-gradient-to-b from-[#07070E] to-[#0A0A15] border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[10px] tracking-[0.3em] text-[#FF9933] uppercase font-semibold mb-2">Countdown to</p>
            <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-white mb-10">15 August 2026 · Independence Day</h2>
            <div className="flex items-center justify-center gap-1.5 sm:gap-5">
              <CBox n={cd.days} label="Days" />
              <span className="text-base sm:text-2xl font-bold text-[#FF9933] mb-5 sm:mb-7">:</span>
              <CBox n={cd.hours} label="Hours" />
              <span className="text-base sm:text-2xl font-bold text-[#FF9933] mb-5 sm:mb-7">:</span>
              <CBox n={cd.minutes} label="Mins" />
              <span className="text-base sm:text-2xl font-bold text-[#FF9933] mb-5 sm:mb-7">:</span>
              <CBox n={cd.seconds} label="Secs" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section className="relative py-14 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <ParticleCanvas />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <FadeIn>
                <p className="text-[10px] tracking-[0.3em] text-[#FF9933] uppercase font-semibold mb-4">About the Celebration</p>
                <h2 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
                  India&apos;s 80 Years of{" "}
                  <span className="gradient-text-tri">Sovereignty</span>
                </h2>
                <p className="text-[#8888A8] leading-relaxed mb-5">
                  Independence Day is celebrated every 15 August — the day India officially became independent from British colonialism in 1947, ending nearly 200 years of foreign rule. The day is marked by flag hoisting, parades, and cultural programs from the Red Fort to every corner of the nation.
                </p>
                <p className="text-[#8888A8] leading-relaxed mb-8">
                  KL University&apos;s Student Activity Centre (SAC) celebrates this milestone with a week-long series of competitions, performances, and events — uniting students in the spirit of Unity, Patriotism, Leadership, Creativity, and Nation Building.
                </p>
                <div className="space-y-3">
                  {[
                    { c: "#FF9933", text: "Saffron — Courage, Sacrifice & the Spirit of Renunciation" },
                    { c: "#FAFAFA", text: "White — Peace, Truth & Purity of thought" },
                    { c: "#138808", text: "Green — Faith, Fertility & Prosperity of the Nation" },
                  ].map(({ c, text }) => (
                    <div key={c} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20" style={{ background: c }} />
                      <p className="text-sm text-[#A0A0B8]">{text}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2}>
              <div className="relative flex justify-center px-6 sm:px-0">
                {/* Glow behind flag */}
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,153,51,0.1)] to-[rgba(19,136,8,0.1)] blur-3xl -z-10 scale-125" />

                <div className="relative w-full max-w-[420px] sm:max-w-[480px]">
                  <WavingFlag className="w-full" />

                  {/* Floating badge — 80 Years of Pride */}
                  <motion.div
                    animate={{ rotate: [0, 4, -4, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -right-4 sm:-right-8 bg-[#0F0F1A] border border-[#FF9933]/30 rounded-xl p-3.5 shadow-2xl hidden sm:block z-20"
                  >
                    <p className="font-[family-name:var(--font-cinzel)] text-2xl font-black gradient-text-saffron">80</p>
                    <p className="text-[10px] text-white/50">Years of Pride</p>
                  </motion.div>

                  {/* Floating badge — Jai Hind */}
                  <motion.div
                    animate={{ rotate: [0, -4, 4, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-6 -left-4 sm:-left-8 bg-[#0F0F1A] border border-[#138808]/30 rounded-xl p-3.5 shadow-2xl hidden sm:block z-20"
                  >
                    <p className="font-[family-name:var(--font-cinzel)] text-base font-black text-[#138808]">JAI HIND</p>
                    <p className="text-[10px] text-white/50">Forever & Always</p>
                  </motion.div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="py-14 bg-gradient-to-b from-[#0A0A15] to-[#07070E]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1}>
                <div className="card-glass rounded-2xl p-6 text-center hover:scale-105 hover:border-[rgba(255,153,51,0.3)] transition-all duration-300 cursor-default">
                  <div className="font-[family-name:var(--font-cinzel)] text-4xl font-black gradient-text-saffron mb-1">
                    {s.value}<span className="text-xl">{s.suffix}</span>
                  </div>
                  <div className="text-xs text-[#8888A8] tracking-wide">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ══ */}
      <section className="relative py-16 sm:py-28 bg-[#07070E] overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        <div className="max-w-6xl mx-auto px-6">
          {/* ── Header ── */}
          <FadeIn>
            <div className="text-center mb-12 sm:mb-24 relative">
              {/* Giant watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden -top-8">
                <span className="font-[family-name:var(--font-cinzel)] font-black text-[clamp(4rem,18vw,14rem)] text-white opacity-[0.025] select-none leading-none">
                  FREEDOM
                </span>
              </div>
              <p className="relative text-[10px] tracking-[0.5em] text-[#FF9933] uppercase font-semibold mb-5 font-[family-name:var(--font-cinzel)]">
                ✦ Road to Freedom ✦
              </p>
              <h2 className="relative font-[family-name:var(--font-cinzel)] font-black leading-[0.9]">
                <span className="block text-4xl sm:text-6xl lg:text-8xl mb-1 text-[#FF9933]">India&apos;s</span>
                <span className="block text-5xl sm:text-7xl lg:text-9xl text-white">Historic</span>
                <span className="block text-4xl sm:text-6xl lg:text-8xl text-[#138808]">Journey</span>
              </h2>
              <div className="flex items-center justify-center gap-3 mt-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#FF9933]" />
                <AshokaCss size={28} className="opacity-70" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#138808]" />
              </div>
            </div>
          </FadeIn>

          {/* ── Timeline entries ── */}
          <div className="relative">
            {/* Spine */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px hidden sm:block" style={{ background: "linear-gradient(180deg, #FF9933 0%, rgba(255,255,255,0.08) 50%, #138808 100%)" }} />

            <div className="space-y-6">
              {timeline.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <FadeIn key={item.year} delay={i * 0.06}>
                    <div className={`relative flex flex-col sm:items-center gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>

                      {/* ── Card ── */}
                      <div className={`flex-1 ${isLeft ? "md:pr-14" : "md:pl-14"} pl-12 sm:pl-0`}>
                        <div className="relative group overflow-hidden rounded-2xl border border-white/6 bg-gradient-to-br from-[#0F0F1A] to-[#0A0A12] hover:border-white/15 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                          {/* Giant year watermark inside card */}
                          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                            <span className="font-[family-name:var(--font-cinzel)] font-black select-none leading-none" style={{ fontSize: "clamp(5rem,14vw,9rem)", color: item.color, opacity: 0.055 }}>
                              {item.year}
                            </span>
                          </div>
                          {/* Colored top bar */}
                          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }} />

                          <div className="relative p-6 sm:p-8">
                            <div className="flex items-start gap-5">
                              {/* Icon circle */}
                              <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg" style={{ background: `${item.color}18`, border: `1px solid ${item.color}35` }}>
                                {item.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-[family-name:var(--font-cinzel)] font-black text-3xl sm:text-4xl mb-1 leading-none" style={{ color: item.color }}>
                                  {item.year}
                                </div>
                                <h3 className="text-white font-bold text-base sm:text-lg mb-3 leading-snug">{item.title}</h3>
                                <p className="text-[#8888A8] text-sm leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── Center node ── */}
                      <div className="hidden md:flex shrink-0 w-16 items-center justify-center z-10">
                        <div className="w-5 h-5 rounded-full border-2 shadow-lg" style={{ background: `${item.color}30`, borderColor: item.color, boxShadow: `0 0 16px ${item.color}50` }} />
                      </div>

                      {/* Mobile left dot */}
                      <div className="absolute left-4 top-6 sm:hidden w-4 h-4 rounded-full border-2" style={{ background: `${item.color}30`, borderColor: item.color }} />

                      {/* Spacer */}
                      <div className="flex-1 hidden md:block" />
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="relative py-16 sm:py-28 overflow-hidden bg-gradient-to-b from-[#07070E] to-[#0A0A15]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/8 via-transparent to-[#138808]/8" />
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <ParticleCanvas />
        </div>
        <FadeIn>
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <div className="mb-8 flex justify-center chakra-spin-slow">
              <AshokaCss size={56} />
            </div>
            <h2 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-6xl font-black text-white mb-6">
              Celebrate with <span className="gradient-text-tri">Us</span>
            </h2>
            <p className="text-[#8888A8] text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Join competitions, showcase your talent, and earn certificates. Let&apos;s celebrate 80 years of freedom together as one!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="px-10 py-4 rounded-full bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black font-bold tracking-wide hover:shadow-[0_0_35px_rgba(255,153,51,0.4)] hover:-translate-y-1 transition-all duration-300 text-center">
                Register for a Competition
              </Link>
              <Link href="/competitions" className="px-10 py-4 rounded-full border border-[#138808]/50 text-[#138808] font-semibold hover:bg-[#138808]/10 transition-all duration-300 text-center">
                View All Events
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-12 border-t border-white/8 bg-[#07070E] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(255,153,51,0.03)] to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {/* Tricolor divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[#FF9933]/40" />
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
              <span className="w-2 h-2 rounded-full bg-white/60" />
              <span className="w-2 h-2 rounded-full bg-[#138808]" />
            </div>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[#138808]/40" />
          </div>

          {/* Main footer text */}
          <p className="text-[#8888A8] text-sm mb-1 tracking-wide">
            © 2026 KL University · Student Activity Centre
          </p>
          <p className="text-[#8888A8]/50 text-xs mb-8">
            Celebrating 80 Years of Independence · Jai Hind 🇮🇳
          </p>

          {/* Credits */}
          <div className="border-t border-white/5 pt-6">
            <p className="text-[#8888A8]/70 text-xs tracking-wide">
              Designed &amp; Developed by{" "}
              <a
                href="https://www.linkedin.com/in/singananischal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium hover:text-white/80 transition-colors duration-200 underline underline-offset-2 decoration-white/20 hover:decoration-white/50"
              >
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

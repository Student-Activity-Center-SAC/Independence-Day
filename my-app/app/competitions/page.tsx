"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AshokaCss from "@/components/AshokaCss";

/* ─── data ─── */
const schedule = [
  { date: "09 Aug 2026", day: "Sunday", time: "05:30 AM – 06:30 AM", domain: "Marathon", competition: "Run for the Nation – 2K Independence Day Marathon", venue: "OAT (Open Air Theatre)", icon: "🏃", color: "#FF9933", id: "marathon" },
  { date: "10 Aug 2026", day: "Monday", time: "03:20 PM – 05:20 PM", domain: "Arts Club", competition: "Nation Builders Art Competition", venue: "Student Activity Centre (SAC Hall)", icon: "🎨", color: "#138808", id: "art" },
  { date: "10 Aug 2026", day: "Monday", time: "03:20 PM – 05:20 PM", domain: "Literature Club", competition: "Voice of Freedom – Essay Writing & Elocution Competition", venue: "Rose Hall & Jasmine Hall", icon: "✍️", color: "#138808", id: "literature" },
  { date: "11 Aug 2026", day: "Tuesday", time: "10:00 AM – 12:20 PM", domain: "Photography Club", competition: "Frames of Freedom – Patriotic Photography Outreach Competition", venue: "Off Campus", icon: "📷", color: "#FFB347", id: "photography" },
  { date: "11 Aug 2026", day: "Tuesday", time: "03:20 PM – 05:20 PM", domain: "Short Film Makers Club", competition: "Vande Bharat Patriotic Reels Challenge", venue: "Peacock Hall", icon: "🎬", color: "#FFB347", id: "film" },
  { date: "12 Aug 2026", day: "Wednesday", time: "03:20 PM – 05:20 PM", domain: "Music Club", competition: "Voices of India – Patriotic Singing Competition", venue: "R&D Theatre", icon: "🎤", color: "#FF9933", id: "music" },
  { date: "12 Aug 2026", day: "Wednesday", time: "03:20 PM – 05:20 PM", domain: "Fashion Club", competition: "Patriotic Attire Showcase – Unity in Diversity", venue: "New Seminar Hall", icon: "👘", color: "#FF9933", id: "fashion" },
  { date: "13 Aug 2026", day: "Thursday", time: "03:20 PM – 05:20 PM", domain: "Dance Club", competition: "Rhythms of Freedom – Patriotic Dance Competition", venue: "New Seminar Hall", icon: "💃", color: "#138808", id: "dance" },
  { date: "13 Aug 2026", day: "Thursday", time: "03:30 PM – 05:20 PM", domain: "Yoga Club", competition: "Yoga for the Nation – Patriotic Yoga Session", venue: "Open Air Theatre (OAT)", icon: "🧘", color: "#138808", id: "yoga" },
  { date: "15 Aug 2026", day: "Saturday", time: "During Independence Day Celebrations", domain: "—", competition: "Prize Distribution & Felicitation Ceremony", venue: "Open Air Theatre (OAT)", icon: "🏆", color: "#FFD700", id: "prize" },
];

const EVENT_SLOTS = ["11:00 AM – 1:00 PM", "3:30 PM – 5:30 PM"];
const SINGLE_SLOT_IDS = new Set(["marathon", "photography", "yoga"]);

const benefits = [
  "Automatically generated E-Certificate through the registration portal after successful verification.",
  "Winners and outstanding performers receive Awards, Certificates & Special Recognition.",
  "Felicitation at the 80th Independence Day Celebrations on 15 August 2026 at the Open Air Theatre.",
];

const attendance = [
  "Attendance is provided only to students who register and actively participate.",
  "Registered participants list will be communicated to departments before the event.",
  "Students must report to the venue on time and complete the competition.",
  "Students who register but fail to attend without prior permission will not receive attendance.",
  "Such students will be marked Absent for the corresponding academic session.",
  "Register only if you are committed to participating.",
];

/* ─── group schedule by date ─── */
const grouped = schedule.reduce<Record<string, typeof schedule>>((acc, item) => {
  (acc[item.date] ??= []).push(item);
  return acc;
}, {});

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function CompetitionsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data: session, status } = useSession();
  const [registeredSet, setRegisteredSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/my-activities")
      .then((r) => r.json())
      .then((d) => {
        const names = (d.registrations ?? []).map((r: { competition: string }) => r.competition);
        setRegisteredSet(new Set(names));
      })
      .catch(() => {});
  }, [status]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden bg-gradient-to-b from-[#0A0A15] to-[#07070E]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF9933]/4 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <div className="mb-6 flex justify-center chakra-spin-slow opacity-60 hero-enter-1">
            <AshokaCss size={52} />
          </div>
          <p className="text-[10px] tracking-[0.3em] text-[#FF9933] uppercase font-semibold mb-3 hero-enter-2">
            80th Independence Day 2026
          </p>
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 hero-enter-3">
            Competition <span className="gradient-text-tri">Schedule</span>
          </h1>
          <p className="text-[#8888A8] max-w-xl mx-auto leading-relaxed mb-8 hero-enter-4">
            Compete, create, and celebrate! All registered Arts Club members are invited to participate enthusiastically.
          </p>
          <div className="hero-enter-5">
            <Link href={session ? "/register" : "/login?from=/register"} className="inline-block px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black font-bold text-sm tracking-wide hover:shadow-[0_0_28px_rgba(255,153,51,0.45)] hover:-translate-y-0.5 transition-all duration-300">
              {session ? "Register Now →" : "Login to Register →"}
            </Link>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 bg-[#07070E]">
        <div className="max-w-4xl mx-auto px-6">
          {Object.entries(grouped).map(([date, events], gi) => (
            <FadeIn key={date} delay={gi * 0.1}>
              <div className="mb-12">
                {/* Date header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="shrink-0">
                    <div className="bg-gradient-to-br from-[#FF9933] to-[#e68000] rounded-xl p-3 text-center min-w-[64px]">
                      <div className="font-[family-name:var(--font-cinzel)] text-2xl font-black text-black leading-none">
                        {date.split(" ")[0]}
                      </div>
                      <div className="text-black/70 text-[9px] font-bold uppercase tracking-widest">{date.split(" ")[1]}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white">{date}</div>
                    <div className="text-[#8888A8] text-sm">{events[0].day}</div>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-[rgba(255,153,51,0.3)] to-transparent" />
                </div>

                {/* Event cards */}
                <div className="space-y-4 pl-0 sm:pl-20">
                  {events.map((ev, ei) => (
                    <motion.div
                      key={ev.id}
                      layout
                      className="card-glass rounded-2xl overflow-hidden hover:border-[rgba(255,153,51,0.3)] transition-all duration-300"
                    >
                      <button
                        className="w-full p-5 flex items-start gap-4 text-left"
                        onClick={() => setExpanded(expanded === gi * 100 + ei ? null : gi * 100 + ei)}
                      >
                        <div className="text-3xl shrink-0 mt-0.5">{ev.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${ev.color}22`, color: ev.color }}>
                              {ev.domain}
                            </span>
                            {SINGLE_SLOT_IDS.has(ev.id) ? (
                              <span className="text-xs text-[#8888A8]">{ev.time}</span>
                            ) : (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {EVENT_SLOTS.map((s, i) => (
                                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/6 border border-white/10 text-[#A0A0B8] font-medium">⏰ {s}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <h3 className="text-white font-bold text-base leading-snug">{ev.competition}</h3>
                          <p className="text-[#8888A8] text-xs mt-1 flex items-center gap-1">
                            <span>📍</span> {ev.venue}
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: expanded === gi * 100 + ei ? 180 : 0 }}
                          className="text-[#FF9933] shrink-0 mt-1"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {expanded === gi * 100 + ei && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 border-t border-white/6">
                              <div className="tricolor-line w-12 mb-3 rounded-full" />
                              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-[10px] text-[#8888A8] uppercase tracking-wider mb-1">Date & Time</p>
                                  <p className="text-white font-medium">{date}</p>
                                  {SINGLE_SLOT_IDS.has(ev.id) ? (
                                    <p className="text-[#8888A8] text-sm">{ev.time}</p>
                                  ) : (
                                    <div className="space-y-1 mt-1">
                                      {EVENT_SLOTS.map((s, i) => (
                                        <p key={i} className="text-[#8888A8] text-xs flex items-center gap-1">
                                          <span className="text-[#FF9933] font-bold text-[9px] uppercase">Slot {i + 1}</span>
                                          <span>{s}</span>
                                        </p>
                                      ))}
                                      <p className="text-[10px] text-[#138808] mt-1">Register for either slot</p>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-[10px] text-[#8888A8] uppercase tracking-wider mb-1">Venue</p>
                                  <p className="text-white font-medium">{ev.venue}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-[#8888A8] uppercase tracking-wider mb-1">Domain</p>
                                  <p className="font-bold" style={{ color: ev.color }}>{ev.domain}</p>
                                </div>
                              </div>
                              <div className="mt-4">
                                {session ? (
                                  registeredSet.has(ev.competition) ? (
                                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#138808]/15 border border-[#138808]/40 text-[#138808] text-xs font-bold cursor-default select-none">
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#138808" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                      Already Registered
                                    </div>
                                  ) : (
                                    <Link href={`/register?competition=${encodeURIComponent(ev.competition)}`} className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black text-xs font-bold hover:shadow-[0_0_18px_rgba(255,153,51,0.4)] transition-all duration-300">
                                      Register for this event →
                                    </Link>
                                  )
                                ) : (
                                  <Link href={`/login?from=${encodeURIComponent(`/register?competition=${encodeURIComponent(ev.competition)}`)}`} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-[#FF9933]/40 text-[#FF9933] text-xs font-bold hover:bg-[#FF9933]/10 transition-all duration-300">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="4.5" height="4.5" fill="#F25022"/><rect x="6.5" y="1" width="4.5" height="4.5" fill="#7FBA00"/><rect x="1" y="6.5" width="4.5" height="4.5" fill="#00A4EF"/><rect x="6.5" y="6.5" width="4.5" height="4.5" fill="#FFB900"/></svg>
                                    Login to Register
                                  </Link>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-b from-[#07070E] to-[#0A0A15]">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="mb-12">
              <p className="text-[10px] tracking-[0.3em] text-[#FF9933] uppercase font-semibold mb-3">What You Get</p>
              <h2 className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl font-black text-white">
                Participation <span className="gradient-text-saffron">Benefits</span>
              </h2>
            </div>
            <div className="space-y-4">
              {benefits.map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-glass rounded-xl p-5 flex gap-4 items-start">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#FF9933] to-[#e68000] flex items-center justify-center text-black text-xs font-bold">
                    {i + 1}
                  </div>
                  <p className="text-[#A0A0B8] text-sm leading-relaxed">{b}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Attendance */}
      <section className="py-20 bg-[#0A0A15]">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="mb-12">
              <p className="text-[10px] tracking-[0.3em] text-[#138808] uppercase font-semibold mb-3">Important Note</p>
              <h2 className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl font-black text-white">
                Attendance <span className="text-[#138808]">Guidelines</span>
              </h2>
            </div>
            <div className="card-glass rounded-2xl p-6 border border-[#138808]/20">
              <div className="space-y-4">
                {attendance.map((a, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-3 items-start">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-[#138808]/20 border border-[#138808]/40 flex items-center justify-center text-[#138808] text-[10px] font-bold mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-[#A0A0B8] text-sm leading-relaxed">{a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#07070E]">
        <FadeIn>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="text-[#8888A8] text-base leading-relaxed mb-8">
              Students are encouraged to actively participate and showcase their talent while celebrating the spirit of Unity, Patriotism, Leadership, Creativity, and Nation Building.
            </p>
            <Link href={session ? "/register" : "/login?from=/register"} className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black font-bold tracking-wide hover:shadow-[0_0_35px_rgba(255,153,51,0.45)] hover:-translate-y-1 transition-all duration-300">
              {session ? "Register Now — Free Entry" : "Login to Register — Free Entry"}
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
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

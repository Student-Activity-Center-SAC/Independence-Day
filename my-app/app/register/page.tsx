"use client";

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AshokaCss from "@/components/AshokaCss";

const competitions = [
  "Run for the Nation – 2K Independence Day Marathon",
  "Nation Builders Art Competition",
  "Voice of Freedom – Essay Writing & Elocution Competition",
  "Frames of Freedom – Patriotic Photography Outreach Competition",
  "Vande Bharat Patriotic Reels Challenge",
  "Voices of India – Patriotic Singing Competition",
  "Patriotic Attire Showcase – Unity in Diversity",
  "Rhythms of Freedom – Patriotic Dance Competition",
  "Yoga for the Nation – Patriotic Yoga Session",
];

const MARATHON = "Run for the Nation – 2K Independence Day Marathon";
const isMarathon = (c: string) => c === MARATHON;
const SLOTS = [
  { id: "morning", label: "Slot 1 – Morning", time: "11:00 AM – 1:00 PM" },
  { id: "afternoon", label: "Slot 2 – Afternoon", time: "3:30 PM – 5:30 PM" },
];

const benefits = [
  "Automatically generated E-Certificate through the registration portal after successful verification.",
  "Winners and outstanding performers receive Awards, Certificates & Special Recognition.",
  "Felicitation at the 80th Independence Day Celebrations on 15 August 2026 at the Open Air Theatre.",
];

const attendanceRules = [
  "Attendance is provided only to students who register and actively participate.",
  "Registered participants list will be communicated to departments before the event.",
  "Students must report to the venue on time and complete the competition.",
  "Students who register but fail to attend without prior permission will not receive attendance.",
  "Such students will be marked Absent for the corresponding academic session.",
  "Register only if you are committed to participating.",
];

// ── Fast-track view for logged-in users with a complete profile ──
function FastTrackRegister({
  session,
  profile,
  initialCompetition,
}: {
  session: { user?: { name?: string | null; email?: string | null } } | null;
  profile: Record<string, string>;
  initialCompetition: string;
}) {
  const [competition, setCompetition] = useState(initialCompetition);
  const [timeSlot, setTimeSlot] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function confirm() {
    if (!competition) return;
    if (!isMarathon(competition) && !timeSlot) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session?.user?.name ?? profile.name,
          email: session?.user?.email ?? profile.email,
          phone: profile.phone,
          roll_number: profile.id_number,
          gender: profile.gender,
          department: profile.department,
          year: profile.year,
          accommodation: profile.accommodation,
          competition,
          time_slot: isMarathon(competition) ? null : timeSlot,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Registration failed"); }
      setSubmitted(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12 bg-[#07070E]">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.7 }}
          className="max-w-md w-full text-center"
        >
          <div className="mb-8 flex justify-center chakra-spin"><AshokaCss size={80} /></div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 200 }} className="text-6xl mb-6">🎉</motion.div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl font-black text-white mb-3">Registration Successful!</h2>
          <div className="tricolor-line w-20 mx-auto my-4 rounded-full" />
          <p className="text-[#8888A8] mb-2">You&apos;re all set, <strong className="text-white">{session?.user?.name?.split(" ")[0]}</strong>!</p>
          <p className="text-[#8888A8] text-sm mb-8">Successfully registered for <strong className="text-[#FF9933]">{competition}</strong>.</p>
          <p className="text-[#8888A8] text-xs leading-relaxed mb-8 px-4 py-3 rounded-xl bg-[#0F0F1A] border border-[#138808]/20">
            Your E-Certificate will be automatically generated after successful verification of participation.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <button onClick={() => { setSubmitted(false); setCompetition(""); setAgreed(false); }} className="px-8 py-3 rounded-full border border-[#FF9933]/40 text-[#FF9933] text-sm font-semibold hover:bg-[#FF9933]/10 transition-colors">
              Register for another event
            </button>
            <Link href="/my-activities" className="px-8 py-3 rounded-full bg-gradient-to-r from-[#138808] to-[#0d6b06] text-white text-sm font-semibold hover:shadow-[0_0_18px_rgba(19,136,8,0.35)] transition-all">
              View My Activities →
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#07070E]">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="mb-6 flex justify-center">
            <div className="float-anim drop-shadow-[0_8px_30px_rgba(255,153,51,0.3)]">
              <div className="overflow-hidden rounded-[4px] border border-white/15" style={{ width: 90, height: 60 }}>
                <div style={{ height: "33.33%", background: "#FF9933" }} />
                <div style={{ height: "33.33%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div className="chakra-spin"><AshokaCss size={20} color="#000080" /></div>
                </div>
                <div style={{ height: "33.33%", background: "#138808" }} />
              </div>
            </div>
          </div>
          <p className="text-[10px] tracking-[0.3em] text-[#FF9933] uppercase font-semibold mb-2">80th Independence Day</p>
          <h1 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-4xl font-black text-white">Competition Registration</h1>
        </div>

        {/* Time slot notice — always visible for non-marathon context */}
        <div className="mb-5 px-4 py-3.5 rounded-xl bg-[#FF9933]/8 border border-[#FF9933]/30 flex items-start gap-3">
          <span className="text-[#FF9933] text-base mt-0.5 shrink-0">⏰</span>
          <div>
            <p className="text-[#FF9933] text-xs font-bold uppercase tracking-wide mb-1">Time Slots</p>
            <p className="text-[#A0A0B8] text-xs leading-relaxed">
              All competitions (except Marathon) are conducted in <strong className="text-white">2 time slots</strong>. Students can register in <strong className="text-white">either</strong> of the time slots:
            </p>
            <div className="flex gap-3 mt-2">
              <span className="px-2.5 py-1 rounded-full bg-white/8 text-white text-[10px] font-semibold border border-white/10">11:00 AM – 1:00 PM</span>
              <span className="px-2.5 py-1 rounded-full bg-white/8 text-white text-[10px] font-semibold border border-white/10">3:30 PM – 5:30 PM</span>
            </div>
          </div>
        </div>

        <div className="mb-6 px-4 py-3 rounded-xl bg-[#138808]/8 border border-[#138808]/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#138808]/20 border border-[#138808]/40 flex items-center justify-center text-[#138808] font-bold text-sm shrink-0">
            {session?.user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{session?.user?.name}</p>
            <p className="text-[#8888A8] text-[10px]">{session?.user?.email} · {profile.id_number}</p>
          </div>
          <Link href="/my-activities" className="shrink-0 text-[10px] text-[#138808] hover:underline">My Activities</Link>
        </div>

        <div className="card-glass rounded-2xl p-5 sm:p-6 mb-5">
          <h2 className="font-[family-name:var(--font-cinzel)] text-base font-bold text-white mb-4">
            {competition ? "Registering For" : "Choose Your Competition"}
          </h2>
          {competition ? (
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-[#FF9933]/8 border border-[#FF9933]/30">
              <span className="text-[#FF9933] text-lg mt-0.5">●</span>
              <p className="text-white text-sm font-medium leading-snug">{competition}</p>
              <button onClick={() => { setCompetition(""); setTimeSlot(""); }} className="ml-auto shrink-0 text-[10px] text-[#8888A8] hover:text-white transition-colors">Change</button>
            </div>
          ) : (
            <div className="space-y-2">
              {competitions.map((c) => (
                <button key={c} onClick={() => setCompetition(c)} className="w-full text-left px-4 py-3.5 rounded-xl border border-white/8 bg-[#07070E] text-[#8888A8] text-sm hover:border-[#FF9933]/40 hover:text-white transition-all duration-200">
                  <span className="mr-2 text-[#8888A8]">○</span>{c}
                </button>
              ))}
            </div>
          )}
        </div>

        {competition && !isMarathon(competition) && (
          <div className="card-glass rounded-2xl p-5 sm:p-6 mb-5">
            <h2 className="font-[family-name:var(--font-cinzel)] text-base font-bold text-white mb-1">Choose Your Time Slot</h2>
            <p className="text-[#8888A8] text-xs mb-4">Select either slot — both are equally valid</p>
            <div className="grid grid-cols-2 gap-3">
              {SLOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setTimeSlot(s.time)}
                  className={`flex flex-col items-center gap-1.5 px-4 py-4 rounded-xl border transition-all duration-200 ${timeSlot === s.time ? "border-[#FF9933]/70 bg-[#FF9933]/10 text-[#FF9933]" : "border-white/10 bg-[#07070E] text-[#8888A8] hover:border-white/25 hover:text-white"}`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                  <span className={`text-sm font-black ${timeSlot === s.time ? "text-white" : "text-[#A0A0B8]"}`}>{s.time}</span>
                </button>
              ))}
            </div>
            {!timeSlot && (
              <p className="mt-3 text-[10px] text-[#FF9933]/70 text-center">Please select a time slot to continue</p>
            )}
          </div>
        )}

        <div className="card-glass rounded-2xl p-5 sm:p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🏅</span>
            <h2 className="font-[family-name:var(--font-cinzel)] text-base font-bold text-white">What You Get</h2>
          </div>
          <p className="text-[10px] tracking-[0.2em] text-[#FF9933] uppercase font-semibold mb-3">Participation Benefits</p>
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#138808]/15 border border-[#138808]/30 flex items-center justify-center shrink-0 text-[#138808] text-[10px] font-bold mt-0.5">{i + 1}</div>
                <p className="text-[#A0A0B8] text-sm leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-glass rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⚠️</span>
            <h2 className="font-[family-name:var(--font-cinzel)] text-base font-bold text-white">Important Note</h2>
          </div>
          <p className="text-[10px] tracking-[0.2em] text-[#FF9933] uppercase font-semibold mb-3">Attendance Guidelines</p>
          <div className="space-y-3">
            {attendanceRules.map((r, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF9933]/10 border border-[#FF9933]/20 flex items-center justify-center shrink-0 text-[#FF9933] text-[10px] font-bold mt-0.5">{i + 1}</div>
                <p className="text-[#A0A0B8] text-sm leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-start gap-3 mb-5 cursor-pointer group">
          <div
            onClick={() => setAgreed(!agreed)}
            className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all duration-200 ${agreed ? "bg-[#138808] border-[#138808]" : "border-white/20 bg-[#07070E] group-hover:border-white/40"}`}
          >
            {agreed && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <p className="text-[#A0A0B8] text-sm leading-relaxed">
            I have read the attendance guidelines and confirm that I am committed to participating in the selected competition.
          </p>
        </label>

        {submitError && <div className="mb-4 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/30 text-sm text-red-400">{submitError}</div>}

        <button
          onClick={confirm}
          disabled={!competition || (!isMarathon(competition) && !timeSlot) || !agreed || submitting}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black text-sm font-black tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_28px_rgba(255,153,51,0.45)] transition-all duration-300"
        >
          {submitting ? "Registering…" : "Confirm Registration 🇮🇳"}
        </button>
      </div>
    </div>
  );
}

function RegisterInner() {
  const searchParams = useSearchParams();
  const preComp = searchParams.get("competition") ?? "";
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    if (authStatus !== "authenticated") { setProfileChecked(true); return; }
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => { if (d.user?.profile_complete) setProfile(d.user); })
      .catch(() => {})
      .finally(() => setProfileChecked(true));
  }, [authStatus]);

  useEffect(() => {
    if (!profileChecked || authStatus === "loading") return;
    if (authStatus === "unauthenticated") {
      const dest = preComp ? `/register?competition=${encodeURIComponent(preComp)}` : "/register";
      router.replace(`/login?from=${encodeURIComponent(dest)}`);
    } else if (authStatus === "authenticated" && profileChecked && !profile) {
      router.replace("/profile");
    }
  }, [profileChecked, authStatus, profile, router, preComp]);

  const spinner = (
    <div className="min-h-screen bg-[#07070E] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#FF9933] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profileChecked || authStatus === "loading") return spinner;
  if (authStatus === "authenticated" && profile) {
    return <FastTrackRegister session={session} profile={profile} initialCompetition={preComp} />;
  }
  return spinner;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07070E] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF9933] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RegisterInner />
    </Suspense>
  );
}

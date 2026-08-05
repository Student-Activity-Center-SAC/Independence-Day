"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
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

const departments = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Information Technology",
  "Biotechnology",
  "Business Administration",
  "Commerce",
  "Pharmacy",
  "Agriculture",
  "Other",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG – 1st Year", "PG – 2nd Year"];

type Step = 1 | 2 | 3 | 4;

interface FormData {
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  department: string;
  year: string;
  competition: string;
}

const EMPTY: FormData = { name: "", email: "", phone: "", rollNumber: "", department: "", year: "", competition: "" };

function RegisterInner() {
  const searchParams = useSearchParams();
  const preComp = searchParams.get("competition") ?? "";

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({ ...EMPTY, competition: preComp });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const canStep1 = form.name.trim() && form.email.trim() && form.phone.trim() && form.rollNumber.trim();
  const canStep2 = form.department && form.year;
  const canStep3 = !!form.competition;

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          roll_number: form.rollNumber,
          department: form.department,
          year: form.year,
          competition: form.competition,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Registration failed");
      }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const steps = ["Personal Info", "Academic Info", "Choose Event", "Confirm"];

  const variants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12 bg-[#07070E]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.7 }} className="max-w-md w-full text-center">
          <div className="mb-8 flex justify-center chakra-spin">
            <AshokaCss size={80} />
          </div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 200 }} className="text-6xl mb-6">🎉</motion.div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl font-black text-white mb-3">Registration Successful!</h2>
          <div className="tricolor-line w-20 mx-auto my-4 rounded-full" />
          <p className="text-[#8888A8] mb-2">Thank you, <strong className="text-white">{form.name}</strong>!</p>
          <p className="text-[#8888A8] text-sm mb-8">
            You have successfully registered for <strong className="text-[#FF9933]">{form.competition}</strong>. A confirmation will be sent to <strong className="text-white">{form.email}</strong>.
          </p>
          <p className="text-[#8888A8] text-xs leading-relaxed mb-8 px-4 py-3 rounded-xl bg-[#0F0F1A] border border-[#138808]/20">
            Your E-Certificate will be automatically generated after successful verification of participation.
          </p>
          <button onClick={() => { setSubmitted(false); setForm({ ...EMPTY }); setStep(1); }} className="px-8 py-3 rounded-full border border-[#FF9933]/40 text-[#FF9933] text-sm font-semibold hover:bg-[#FF9933]/10 transition-colors">
            Register for another event
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-[#07070E]">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 hero-enter-2">
          <div className="mb-4 flex justify-center chakra-spin-slow opacity-60 hero-enter-1">
            <AshokaCss size={44} />
          </div>
          <p className="text-[10px] tracking-[0.3em] text-[#FF9933] uppercase font-semibold mb-2">80th Independence Day</p>
          <h1 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-4xl font-black text-white">Competition Registration</h1>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center gap-0">
            {steps.map((label, i) => {
              const s = (i + 1) as Step;
              const done = step > s;
              const active = step === s;
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400 ${done ? "bg-[#138808] text-white" : active ? "bg-gradient-to-br from-[#FF9933] to-[#e68000] text-black shadow-[0_0_18px_rgba(255,153,51,0.35)]" : "bg-[#0F0F1A] text-[#8888A8] border border-white/10"}`}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span className={`hidden sm:block text-[9px] tracking-wide text-center whitespace-nowrap ${active ? "text-[#FF9933]" : done ? "text-[#138808]" : "text-[#8888A8]"}`}>{label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-1 mb-4 transition-colors duration-400 ${done ? "bg-[#138808]/60" : "bg-white/8"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form card */}
        <div className="card-glass rounded-3xl p-5 sm:p-7 lg:p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <Field label="Full Name" id="name" value={form.name} onChange={set("name")} placeholder="Enter your full name" />
                  <Field label="Email Address" id="email" type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" />
                  <Field label="Phone Number" id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 XXXXXXXXXX" />
                  <Field label="Roll Number" id="roll" value={form.rollNumber} onChange={set("rollNumber")} placeholder="e.g. 2200030000" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-6">Academic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">Department</label>
                    <select value={form.department} onChange={set("department")} className="w-full bg-[#07070E] border border-white/12 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF9933]/60 transition-colors">
                      <option value="">Select department</option>
                      {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">Year of Study</label>
                    <select value={form.year} onChange={set("year")} className="w-full bg-[#07070E] border border-white/12 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF9933]/60 transition-colors">
                      <option value="">Select year</option>
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-6">Choose Your Competition</h2>
                <div className="space-y-2.5">
                  {competitions.map((c) => (
                    <button
                      key={c}
                      onClick={() => setForm((f) => ({ ...f, competition: c }))}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-250 ${
                        form.competition === c
                          ? "border-[#FF9933]/60 bg-[#FF9933]/8 text-white"
                          : "border-white/8 bg-[#07070E] text-[#8888A8] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span className={`mr-2 ${form.competition === c ? "text-[#FF9933]" : "text-[#8888A8]"}`}>{form.competition === c ? "●" : "○"}</span>
                      {c}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-6">Review & Confirm</h2>
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Name", value: form.name },
                    { label: "Email", value: form.email },
                    { label: "Phone", value: form.phone },
                    { label: "Roll No.", value: form.rollNumber },
                    { label: "Department", value: form.department },
                    { label: "Year", value: form.year },
                    { label: "Competition", value: form.competition },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3 bg-[#07070E] rounded-xl px-4 py-3">
                      <span className="text-[#8888A8] text-xs font-semibold uppercase tracking-wide w-20 sm:w-24 shrink-0 pt-0.5">{label}</span>
                      <span className="text-white text-sm min-w-0 break-words">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#FF9933]/6 border border-[#FF9933]/20 rounded-xl px-4 py-3 text-xs text-[#A0A0B8] leading-relaxed mb-4">
                  By registering, you confirm that you are committed to participating in the competition. Students who register but fail to attend without prior permission may be marked absent.
                </div>
                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 mb-4">
                    {error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep((s) => (s - 1) as Step)} className="flex-1 py-3 rounded-xl border border-white/12 text-[#8888A8] text-sm font-semibold hover:border-white/25 hover:text-white transition-colors">
                ← Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep((s) => (s + 1) as Step)}
                disabled={step === 1 ? !canStep1 : step === 2 ? !canStep2 : !canStep3}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(255,153,51,0.35)] transition-all duration-300"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black text-sm font-bold disabled:opacity-60 hover:shadow-[0_0_22px_rgba(255,153,51,0.4)] transition-all duration-300"
              >
                {submitting ? "Submitting…" : "Submit Registration 🇮🇳"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, id, value, onChange, placeholder, type = "text" }: { label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">{label}</label>
      <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-[#07070E] border border-white/12 rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#8888A8]/50 focus:outline-none focus:border-[#FF9933]/60 transition-colors" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07070E] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#FF9933] border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterInner />
    </Suspense>
  );
}

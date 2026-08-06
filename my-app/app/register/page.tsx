"use client";

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
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

const departments = [
  "B.Tech AI&DS",
  "B.Tech CS&IT",
  "B.Tech ECS",
  "B.Tech IOT",
  "B.Tech ECE",
  "B.Tech CSE",
  "B.Tech CSE - 1",
  "B.Tech CSE - 2",
  "B.Tech CSE - 3",
  "B.Tech CSE - 4",
  "B.Tech CSE (AI & ML)",
  "B.Tech ECE (VLSI)",
  "B.Tech BT",
  "B.Tech Food Technology",
  "B.Tech CE",
  "B.Tech EEE",
  "B.Tech ME",
  "B.Sc - VC",
  "B.Sc (Animation & Gaming)",
  "B.Sc (Hons.) Agriculture",
  "M.Tech - EVT",
  "M.Tech - PE & PS",
  "M.Tech - CTM",
  "M.Tech - Machine Design",
  "M.Tech - SE",
  "M.Tech - Thermal Engineering",
  "M.Tech - CSE",
  "M.Sc Computational Mathematics",
  "M.Sc Nano Science and Technology",
  "M.Sc Chemistry",
  "M.Sc Physics",
  "M.Sc - F&C",
  "B.Com",
  "B.Com. (Hons.)",
  "B.A",
  "B.Arch",
  "B.Pharmacy",
  "LLB",
  "BBA",
  "BBA-BA",
  "BBA-LLB",
  "BCA",
  "M.Pharmacy",
  "MA DH&LS",
  "MA - English",
  "MBA",
  "MCA",
  "Pharma D",
  "KL CDOE Management (OL) BBA",
  "KL CDOE Humanities (OL) BCA",
  "Other",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG – 1st Year", "PG – 2nd Year"];

type Step = 1 | 2 | 3 | 4;

interface FormData {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  idNumber: string;
  gender: string;
  department: string;
  year: string;
  accommodation: string;
  competition: string;
}

const EMPTY: FormData = {
  name: "",
  email: "",
  countryCode: "+91",
  phone: "",
  idNumber: "",
  gender: "",
  department: "",
  year: "",
  accommodation: "",
  competition: "",
};

type ErrMap = Partial<Record<keyof FormData, string>>;

function validate(form: FormData): ErrMap {
  const e: ErrMap = {};
  if (!form.name.trim()) e.name = "Name is required";
  else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) e.name = "Name must contain only alphabets";

  if (!form.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address";

  if (!form.phone) e.phone = "Phone number is required";
  else if (!/^\d{10}$/.test(form.phone)) e.phone = "Must be exactly 10 digits";

  if (!form.idNumber) e.idNumber = "ID Number is required";
  else if (!/^\d{10,11}$/.test(form.idNumber)) e.idNumber = "Must be 10 or 11 digits";

  if (!form.gender) e.gender = "Please select your gender";

  return e;
}

const inputCls = (err: boolean) =>
  `w-full bg-[#07070E] border rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#8888A8]/50 focus:outline-none transition-colors ${
    err ? "border-red-500/60 focus:border-red-500/80" : "border-white/12 focus:border-[#FF9933]/60"
  }`;

function RegisterInner() {
  const searchParams = useSearchParams();
  const preComp = searchParams.get("competition") ?? "";
  const { data: session, status: authStatus } = useSession();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({ ...EMPTY, competition: preComp });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deptOther, setDeptOther] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        const u = d.user;
        if (u?.profile_complete) {
          const [cc, ...rest] = (u.phone ?? "+91 ").split(" ");
          setForm((f) => ({
            ...f,
            name: session?.user?.name ?? f.name,
            email: session?.user?.email ?? f.email,
            idNumber: u.id_number ?? f.idNumber,
            countryCode: cc ?? "+91",
            phone: rest.join("") ?? f.phone,
            department: u.department ?? f.department,
            year: u.year ?? f.year,
            gender: u.gender ?? f.gender,
            accommodation: u.accommodation ?? f.accommodation,
          }));
          setProfileLoaded(true);
        }
      })
      .catch(() => {});
  }, [authStatus, session]);

  const touch = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));

  const errs = validate(form);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, name: e.target.value.replace(/[^a-zA-Z\s]/g, "") }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }));
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^\d+]/g, "");
    if (v && !v.startsWith("+")) v = "+" + v;
    setForm((f) => ({ ...f, countryCode: v }));
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 11);
    setForm((f) => ({ ...f, idNumber: val, email: val ? `${val}@kluniversity.in` : "" }));
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "Other") {
      setDeptOther(true);
      setForm((f) => ({ ...f, department: "" }));
    } else {
      setDeptOther(false);
      setForm((f) => ({ ...f, department: e.target.value }));
    }
  };

  const canStep2 = !!form.department && !!form.year && !!form.accommodation;
  const canStep3 = !!form.competition;

  function tryNext() {
    if (step === 1) {
      const e = validate(form);
      if (Object.keys(e).length > 0) {
        setTouched({ name: true, email: true, phone: true, idNumber: true, gender: true });
        return;
      }
    }
    setStep((s) => (s + 1) as Step);
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: `${form.countryCode} ${form.phone}`,
          roll_number: form.idNumber,
          gender: form.gender,
          department: form.department,
          year: form.year,
          accommodation: form.accommodation,
          competition: form.competition,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Registration failed");
      }
      setSubmitted(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
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
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.7 }}
          className="max-w-md w-full text-center"
        >
          <div className="mb-8 flex justify-center chakra-spin">
            <AshokaCss size={80} />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="text-6xl mb-6"
          >
            🎉
          </motion.div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl font-black text-white mb-3">
            Registration Successful!
          </h2>
          <div className="tricolor-line w-20 mx-auto my-4 rounded-full" />
          <p className="text-[#8888A8] mb-2">
            Thank you, <strong className="text-white">{form.name}</strong>!
          </p>
          <p className="text-[#8888A8] text-sm mb-8">
            You have successfully registered for{" "}
            <strong className="text-[#FF9933]">{form.competition}</strong>. A confirmation will be
            sent to <strong className="text-white">{form.email}</strong>.
          </p>
          <p className="text-[#8888A8] text-xs leading-relaxed mb-8 px-4 py-3 rounded-xl bg-[#0F0F1A] border border-[#138808]/20">
            Your E-Certificate will be automatically generated after successful verification of
            participation.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({ ...EMPTY });
                setStep(1);
                setTouched({});
                setDeptOther(false);
              }}
              className="px-8 py-3 rounded-full border border-[#FF9933]/40 text-[#FF9933] text-sm font-semibold hover:bg-[#FF9933]/10 transition-colors"
            >
              Register for another event
            </button>
            {authStatus === "authenticated" && (
              <Link
                href="/my-activities"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#138808] to-[#0d6b06] text-white text-sm font-semibold hover:shadow-[0_0_18px_rgba(19,136,8,0.35)] transition-all"
              >
                View My Activities →
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-[#07070E]">
      <div className="max-w-xl mx-auto">
        {/* Auth banner */}
        {authStatus === "unauthenticated" && (
          <div className="mb-6 px-4 py-3.5 rounded-xl bg-[#FF9933]/8 border border-[#FF9933]/20 flex items-center justify-between gap-3">
            <p className="text-[#A0A0B8] text-xs leading-relaxed">
              <span className="text-[#FF9933] font-semibold">Login faster</span> — sign in with your KLU email to auto-fill your details.
            </p>
            <Link href="/login?from=/register" className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-[#FF9933] text-black font-bold hover:bg-[#e68000] transition-colors">
              Login
            </Link>
          </div>
        )}
        {authStatus === "authenticated" && profileLoaded && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-[#138808]/8 border border-[#138808]/20 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#138808]/20 border border-[#138808]/40 flex items-center justify-center text-[#138808] font-bold text-xs shrink-0">
              {session?.user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{session?.user?.name}</p>
              <p className="text-[#8888A8] text-[10px]">Details pre-filled from your profile</p>
            </div>
            <Link href="/my-activities" className="shrink-0 text-[10px] text-[#138808] hover:underline">My Activities</Link>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10 hero-enter-2">
          {/* Animated India Flag */}
          <div className="mb-6 flex justify-center hero-enter-1">
            <div className="float-anim drop-shadow-[0_8px_30px_rgba(255,153,51,0.3)]">
              <div
                className="overflow-hidden rounded-[4px] border border-white/15"
                style={{ width: 90, height: 60 }}
              >
                <div style={{ height: "33.33%", background: "#FF9933" }} />
                <div
                  style={{
                    height: "33.33%",
                    background: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className="chakra-spin">
                    <AshokaCss size={20} color="#000080" />
                  </div>
                </div>
                <div style={{ height: "33.33%", background: "#138808" }} />
              </div>
            </div>
          </div>
          <p className="text-[10px] tracking-[0.3em] text-[#FF9933] uppercase font-semibold mb-2">
            80th Independence Day
          </p>
          <h1 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-4xl font-black text-white">
            Competition Registration
          </h1>
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
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400 ${
                        done
                          ? "bg-[#138808] text-white"
                          : active
                          ? "bg-gradient-to-br from-[#FF9933] to-[#e68000] text-black shadow-[0_0_18px_rgba(255,153,51,0.35)]"
                          : "bg-[#0F0F1A] text-[#8888A8] border border-white/10"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    <span
                      className={`hidden sm:block text-[9px] tracking-wide text-center whitespace-nowrap ${
                        active ? "text-[#FF9933]" : done ? "text-[#138808]" : "text-[#8888A8]"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-1 mb-4 transition-colors duration-400 ${
                        done ? "bg-[#138808]/60" : "bg-white/8"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form card */}
        <div className="card-glass rounded-3xl p-5 sm:p-7 lg:p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* ── Step 1: Personal Info ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-1">
                  Personal Information
                </h2>
                <p className="text-[10px] text-[#8888A8]/60 mb-6 tracking-wide">
                  All fields marked <span className="text-[#FF9933]">*</span> are mandatory
                </p>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">
                      Full Name <span className="text-[#FF9933]">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleNameChange}
                      onBlur={touch("name")}
                      placeholder="Enter your full name"
                      className={inputCls(!!(touched.name && errs.name))}
                    />
                    {touched.name && errs.name && (
                      <p className="mt-1 text-xs text-red-400">{errs.name}</p>
                    )}
                  </div>

                  {/* ID Number — placed here so it auto-fills email below */}
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">
                      ID Number <span className="text-[#FF9933]">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.idNumber}
                      onChange={handleIdChange}
                      onBlur={touch("idNumber")}
                      placeholder="e.g. 2400030188"
                      maxLength={11}
                      className={inputCls(!!(touched.idNumber && errs.idNumber))}
                    />
                    {touched.idNumber && errs.idNumber && (
                      <p className="mt-1 text-xs text-red-400">{errs.idNumber}</p>
                    )}
                  </div>

                  {/* Email — auto-filled from ID Number */}
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">
                      Email Address <span className="text-[#FF9933]">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      onBlur={touch("email")}
                      placeholder="Auto-filled from ID Number"
                      className={inputCls(!!(touched.email && errs.email))}
                    />
                    {touched.email && errs.email && (
                      <p className="mt-1 text-xs text-red-400">{errs.email}</p>
                    )}
                  </div>

                  {/* Phone — split country code + number */}
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">
                      Phone Number <span className="text-[#FF9933]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.countryCode}
                        onChange={handleCountryCodeChange}
                        placeholder="+91"
                        className="w-[72px] shrink-0 bg-[#07070E] border border-white/12 rounded-xl px-3 py-3 text-white text-sm text-center focus:outline-none focus:border-[#FF9933]/60 transition-colors"
                      />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        onBlur={touch("phone")}
                        placeholder="XXXXXXXXXX"
                        maxLength={10}
                        className={inputCls(!!(touched.phone && errs.phone))}
                      />
                    </div>
                    {touched.phone && errs.phone && (
                      <p className="mt-1 text-xs text-red-400">{errs.phone}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-2 tracking-wide uppercase font-semibold">
                      Gender <span className="text-[#FF9933]">*</span>
                    </label>
                    <div className="flex gap-2">
                      {["Male", "Female", "Other"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, gender: g }))}
                          className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                            form.gender === g
                              ? "border-[#FF9933]/70 bg-[#FF9933]/10 text-[#FF9933]"
                              : "border-white/10 bg-[#07070E] text-[#8888A8] hover:border-white/25 hover:text-white"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    {touched.gender && errs.gender && (
                      <p className="mt-1 text-xs text-red-400">{errs.gender}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Academic Info ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-6">
                  Academic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">
                      Department <span className="text-[#FF9933]">*</span>
                    </label>
                    <select
                      value={deptOther ? "Other" : form.department}
                      onChange={handleDeptChange}
                      className="w-full bg-[#07070E] border border-white/12 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF9933]/60 transition-colors"
                    >
                      <option value="">Select department</option>
                      {departments.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {deptOther && (
                      <input
                        type="text"
                        placeholder="Type your department"
                        value={form.department}
                        onChange={set("department")}
                        autoFocus
                        className="mt-2 w-full bg-[#07070E] border border-[#FF9933]/40 rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#8888A8]/50 focus:outline-none focus:border-[#FF9933]/70 transition-colors"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">
                      Year of Study <span className="text-[#FF9933]">*</span>
                    </label>
                    <select
                      value={form.year}
                      onChange={set("year")}
                      className="w-full bg-[#07070E] border border-white/12 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF9933]/60 transition-colors"
                    >
                      <option value="">Select year</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hosteller / Day Scholar */}
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-2 tracking-wide uppercase font-semibold">
                      Accommodation <span className="text-[#FF9933]">*</span>
                    </label>
                    <div className="flex gap-2">
                      {["Hosteller", "Day Scholar"].map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, accommodation: a }))}
                          className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                            form.accommodation === a
                              ? "border-[#FF9933]/70 bg-[#FF9933]/10 text-[#FF9933]"
                              : "border-white/10 bg-[#07070E] text-[#8888A8] hover:border-white/25 hover:text-white"
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Choose Competition ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-6">
                  Choose Your Competition
                </h2>
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
                      <span
                        className={`mr-2 ${
                          form.competition === c ? "text-[#FF9933]" : "text-[#8888A8]"
                        }`}
                      >
                        {form.competition === c ? "●" : "○"}
                      </span>
                      {c}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Review & Confirm ── */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-6">
                  Review & Confirm
                </h2>
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Name", value: form.name },
                    { label: "Email", value: form.email },
                    { label: "Phone", value: `${form.countryCode} ${form.phone}` },
                    { label: "ID No.", value: form.idNumber },
                    { label: "Gender", value: form.gender },
                    { label: "Department", value: form.department },
                    { label: "Year", value: form.year },
                    { label: "Stay", value: form.accommodation },
                    { label: "Competition", value: form.competition },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3 bg-[#07070E] rounded-xl px-4 py-3">
                      <span className="text-[#8888A8] text-xs font-semibold uppercase tracking-wide w-20 sm:w-24 shrink-0 pt-0.5">
                        {label}
                      </span>
                      <span className="text-white text-sm min-w-0 break-words">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#FF9933]/6 border border-[#FF9933]/20 rounded-xl px-4 py-3 text-xs text-[#A0A0B8] leading-relaxed mb-4">
                  By registering, you confirm that you are committed to participating in the
                  competition. Students who register but fail to attend without prior permission may
                  be marked absent.
                </div>
                {submitError && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 mb-4">
                    {submitError}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="flex-1 py-3 rounded-xl border border-white/12 text-[#8888A8] text-sm font-semibold hover:border-white/25 hover:text-white transition-colors"
              >
                ← Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={tryNext}
                disabled={step === 2 ? !canStep2 : step === 3 ? !canStep3 : false}
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07070E] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#FF9933] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterInner />
    </Suspense>
  );
}

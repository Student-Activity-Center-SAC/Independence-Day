"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AshokaCss from "@/components/AshokaCss";

const departments = [
  "B.Tech AI&DS","B.Tech CS&IT","B.Tech ECS","B.Tech IOT","B.Tech ECE","B.Tech CSE",
  "B.Tech CSE - 1","B.Tech CSE - 2","B.Tech CSE - 3","B.Tech CSE - 4",
  "B.Tech CSE (AI & ML)","B.Tech ECE (VLSI)","B.Tech BT","B.Tech Food Technology",
  "B.Tech CE","B.Tech EEE","B.Tech ME","B.Sc - VC","B.Sc (Animation & Gaming)",
  "B.Sc (Hons.) Agriculture","M.Tech - EVT","M.Tech - PE & PS","M.Tech - CTM",
  "M.Tech - Machine Design","M.Tech - SE","M.Tech - Thermal Engineering","M.Tech - CSE",
  "M.Sc Computational Mathematics","M.Sc Nano Science and Technology","M.Sc Chemistry",
  "M.Sc Physics","M.Sc Bio Technology","M.Sc Microbiology","B.Com",
  "B.A (English Language & Literature)","B.Arch","B.Pharmacy","LLB","BBA",
  "BBA (Business Analytics)","BCA","M.Pharmacy","MA (English)","MA (Economics)",
  "MBA","MCA","Pharma D","KL CDOE - B.Tech CSE","KL CDOE - B.Tech AI",
  "KL CDOE - BCA","KL CDOE - MBA","KL CDOE - MCA","Other",
];

const years = ["1st Year","2nd Year","3rd Year","4th Year","PG 1st Year","PG 2nd Year","PhD"];
const countryCodes = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1",  label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+971",label: "🇦🇪 +971" },
  { code: "+65", label: "🇸🇬 +65" },
];

interface ProfileForm {
  idNumber: string;
  countryCode: string;
  phone: string;
  department: string;
  otherDept: string;
  year: string;
  gender: string;
  accommodation: string;
}

const EMPTY: ProfileForm = {
  idNumber: "", countryCode: "+91", phone: "",
  department: "", otherDept: "", year: "",
  gender: "", accommodation: "",
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/login?from=/profile"); return; }
    if (status !== "authenticated") return;

    // Check if profile already complete
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.profile_complete) {
          router.replace("/my-activities");
        } else if (d.user) {
          // Pre-fill existing partial data
          const u = d.user;
          setForm((f) => ({
            ...f,
            idNumber: u.id_number ?? "",
            phone: u.phone?.split(" ").slice(1).join("") ?? "",
            countryCode: u.phone?.split(" ")[0] ?? "+91",
            department: u.department ?? "",
            year: u.year ?? "",
            gender: u.gender ?? "",
            accommodation: u.accommodation ?? "",
          }));
        }
      })
      .finally(() => setChecking(false));
  }, [status, router]);

  const set = (key: keyof ProfileForm, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    if (!/^\d{10,11}$/.test(form.idNumber)) return "ID Number must be 10–11 digits.";
    if (!/^\d{10}$/.test(form.phone)) return "Phone number must be exactly 10 digits.";
    if (!form.department) return "Select your department.";
    if (form.department === "Other" && !form.otherDept.trim()) return "Enter your department name.";
    if (!form.year) return "Select your year.";
    if (!form.gender) return "Select your gender.";
    if (!form.accommodation) return "Select Hosteller or Day Scholar.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSaving(true);

    const dept = form.department === "Other" ? form.otherDept.trim() : form.department;
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_number: form.idNumber,
        phone: `${form.countryCode} ${form.phone}`,
        department: dept,
        year: form.year,
        gender: form.gender,
        accommodation: form.accommodation,
      }),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/my-activities");
    } else {
      const d = await res.json();
      setError(d.error ?? "Failed to save profile.");
    }
  };

  if (status === "loading" || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070E]">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF9933] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A15] to-[#07070E] py-20 px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF9933]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="float-anim drop-shadow-[0_8px_30px_rgba(255,153,51,0.3)]">
            <div className="overflow-hidden rounded-[4px] border border-white/15" style={{ width: 72, height: 48 }}>
              <div style={{ height: "33.33%", background: "#FF9933" }} />
              <div style={{ height: "33.33%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="chakra-spin"><AshokaCss size={16} color="#000080" /></div>
              </div>
              <div style={{ height: "33.33%", background: "#138808" }} />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.3em] text-[#FF9933] uppercase font-semibold mb-2">
            Complete Your Profile
          </p>
          <h1 className="font-[family-name:var(--font-cinzel)] text-2xl font-black text-white mb-1">
            Welcome, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-[#8888A8] text-sm">Fill in your details to start registering for events.</p>
        </div>

        {/* Microsoft account info */}
        <div className="card-glass rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FF9933]/15 border border-[#FF9933]/30 flex items-center justify-center text-sm font-bold text-[#FF9933] shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{session?.user?.name}</p>
            <p className="text-[#8888A8] text-xs truncate">{session?.user?.email}</p>
          </div>
          <div className="ml-auto shrink-0">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#138808]/15 border border-[#138808]/30 text-[#138808] font-semibold">Verified</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-glass rounded-2xl p-6 space-y-5">
          {/* ID Number */}
          <div>
            <label className="block text-[10px] text-[#8888A8] uppercase tracking-wider mb-1.5">
              ID Number <span className="text-[#FF9933]">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 2400030188"
              value={form.idNumber}
              onChange={(e) => set("idNumber", e.target.value.replace(/\D/g, "").slice(0, 11))}
              className="w-full bg-[#0D0D1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#555577] text-sm focus:outline-none focus:border-[#FF9933]/50 transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] text-[#8888A8] uppercase tracking-wider mb-1.5">
              Phone Number <span className="text-[#FF9933]">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={form.countryCode}
                onChange={(e) => set("countryCode", e.target.value)}
                className="bg-[#0D0D1A] border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#FF9933]/50 transition-colors shrink-0"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <input
                type="text"
                inputMode="numeric"
                placeholder="10-digit number"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 bg-[#0D0D1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#555577] text-sm focus:outline-none focus:border-[#FF9933]/50 transition-colors"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-[10px] text-[#8888A8] uppercase tracking-wider mb-1.5">
              Department <span className="text-[#FF9933]">*</span>
            </label>
            <select
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
              className="w-full bg-[#0D0D1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF9933]/50 transition-colors"
            >
              <option value="" disabled>Select department</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {form.department === "Other" && (
              <input
                type="text"
                placeholder="Enter your department"
                value={form.otherDept}
                onChange={(e) => set("otherDept", e.target.value)}
                className="mt-2 w-full bg-[#0D0D1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#555577] text-sm focus:outline-none focus:border-[#FF9933]/50 transition-colors"
              />
            )}
          </div>

          {/* Year */}
          <div>
            <label className="block text-[10px] text-[#8888A8] uppercase tracking-wider mb-1.5">
              Year <span className="text-[#FF9933]">*</span>
            </label>
            <select
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              className="w-full bg-[#0D0D1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF9933]/50 transition-colors"
            >
              <option value="" disabled>Select year</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[10px] text-[#8888A8] uppercase tracking-wider mb-1.5">
              Gender <span className="text-[#FF9933]">*</span>
            </label>
            <div className="flex gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g} type="button"
                  onClick={() => set("gender", g)}
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
          </div>

          {/* Accommodation */}
          <div>
            <label className="block text-[10px] text-[#8888A8] uppercase tracking-wider mb-1.5">
              Stay <span className="text-[#FF9933]">*</span>
            </label>
            <div className="flex gap-2">
              {["Hosteller", "Day Scholar"].map((a) => (
                <button
                  key={a} type="button"
                  onClick={() => set("accommodation", a)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    form.accommodation === a
                      ? "border-[#138808]/70 bg-[#138808]/10 text-[#138808]"
                      : "border-white/10 bg-[#07070E] text-[#8888A8] hover:border-white/25 hover:text-white"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black font-bold text-sm tracking-wide hover:shadow-[0_0_28px_rgba(255,153,51,0.4)] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <><div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-transparent animate-spin" /> Saving…</>
            ) : (
              "Save & Continue →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { Suspense, useState, useEffect, useRef } from "react";
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
  "B.Tech AI&DS","B.Tech CS&IT","B.Tech ECS","B.Tech IOT","B.Tech ECE","B.Tech CSE",
  "B.Tech CSE - 1","B.Tech CSE - 2","B.Tech CSE - 3","B.Tech CSE - 4","B.Tech CSE (AI & ML)",
  "B.Tech ECE (VLSI)","B.Tech BT","B.Tech Food Technology","B.Tech CE","B.Tech EEE","B.Tech ME",
  "B.Sc - VC","B.Sc (Animation & Gaming)","B.Sc (Hons.) Agriculture","M.Tech - EVT",
  "M.Tech - PE & PS","M.Tech - CTM","M.Tech - Machine Design","M.Tech - SE",
  "M.Tech - Thermal Engineering","M.Tech - CSE","M.Sc Computational Mathematics",
  "M.Sc Nano Science and Technology","M.Sc Chemistry","M.Sc Physics","M.Sc - F&C",
  "B.Com","B.Com. (Hons.)","B.A","B.Arch","B.Pharmacy","LLB","BBA","BBA-BA","BBA-LLB",
  "BCA","M.Pharmacy","MA DH&LS","MA - English","MBA","MCA","Pharma D",
  "KL CDOE Management (OL) BBA","KL CDOE Humanities (OL) BCA","Other",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG – 1st Year", "PG – 2nd Year"];

interface Country { code: string; flag: string; name: string; }

const COUNTRIES: Country[] = [
  { code: "+93", flag: "🇦🇫", name: "Afghanistan" },
  { code: "+355", flag: "🇦🇱", name: "Albania" },
  { code: "+213", flag: "🇩🇿", name: "Algeria" },
  { code: "+376", flag: "🇦🇩", name: "Andorra" },
  { code: "+244", flag: "🇦🇴", name: "Angola" },
  { code: "+1268", flag: "🇦🇬", name: "Antigua and Barbuda" },
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+374", flag: "🇦🇲", name: "Armenia" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+43", flag: "🇦🇹", name: "Austria" },
  { code: "+994", flag: "🇦🇿", name: "Azerbaijan" },
  { code: "+1242", flag: "🇧🇸", name: "Bahamas" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+1246", flag: "🇧🇧", name: "Barbados" },
  { code: "+375", flag: "🇧🇾", name: "Belarus" },
  { code: "+32", flag: "🇧🇪", name: "Belgium" },
  { code: "+501", flag: "🇧🇿", name: "Belize" },
  { code: "+229", flag: "🇧🇯", name: "Benin" },
  { code: "+975", flag: "🇧🇹", name: "Bhutan" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia" },
  { code: "+387", flag: "🇧🇦", name: "Bosnia and Herzegovina" },
  { code: "+267", flag: "🇧🇼", name: "Botswana" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+673", flag: "🇧🇳", name: "Brunei" },
  { code: "+359", flag: "🇧🇬", name: "Bulgaria" },
  { code: "+226", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+257", flag: "🇧🇮", name: "Burundi" },
  { code: "+855", flag: "🇰🇭", name: "Cambodia" },
  { code: "+237", flag: "🇨🇲", name: "Cameroon" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+238", flag: "🇨🇻", name: "Cape Verde" },
  { code: "+236", flag: "🇨🇫", name: "Central African Republic" },
  { code: "+235", flag: "🇹🇩", name: "Chad" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+269", flag: "🇰🇲", name: "Comoros" },
  { code: "+242", flag: "🇨🇬", name: "Congo" },
  { code: "+243", flag: "🇨🇩", name: "DR Congo" },
  { code: "+506", flag: "🇨🇷", name: "Costa Rica" },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "+385", flag: "🇭🇷", name: "Croatia" },
  { code: "+53", flag: "🇨🇺", name: "Cuba" },
  { code: "+357", flag: "🇨🇾", name: "Cyprus" },
  { code: "+420", flag: "🇨🇿", name: "Czech Republic" },
  { code: "+45", flag: "🇩🇰", name: "Denmark" },
  { code: "+253", flag: "🇩🇯", name: "Djibouti" },
  { code: "+1767", flag: "🇩🇲", name: "Dominica" },
  { code: "+1809", flag: "🇩🇴", name: "Dominican Republic" },
  { code: "+593", flag: "🇪🇨", name: "Ecuador" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+503", flag: "🇸🇻", name: "El Salvador" },
  { code: "+240", flag: "🇬🇶", name: "Equatorial Guinea" },
  { code: "+291", flag: "🇪🇷", name: "Eritrea" },
  { code: "+372", flag: "🇪🇪", name: "Estonia" },
  { code: "+268", flag: "🇸🇿", name: "Eswatini" },
  { code: "+251", flag: "🇪🇹", name: "Ethiopia" },
  { code: "+679", flag: "🇫🇯", name: "Fiji" },
  { code: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+241", flag: "🇬🇦", name: "Gabon" },
  { code: "+220", flag: "🇬🇲", name: "Gambia" },
  { code: "+995", flag: "🇬🇪", name: "Georgia" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+30", flag: "🇬🇷", name: "Greece" },
  { code: "+1473", flag: "🇬🇩", name: "Grenada" },
  { code: "+502", flag: "🇬🇹", name: "Guatemala" },
  { code: "+224", flag: "🇬🇳", name: "Guinea" },
  { code: "+245", flag: "🇬🇼", name: "Guinea-Bissau" },
  { code: "+592", flag: "🇬🇾", name: "Guyana" },
  { code: "+509", flag: "🇭🇹", name: "Haiti" },
  { code: "+504", flag: "🇭🇳", name: "Honduras" },
  { code: "+36", flag: "🇭🇺", name: "Hungary" },
  { code: "+354", flag: "🇮🇸", name: "Iceland" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+98", flag: "🇮🇷", name: "Iran" },
  { code: "+964", flag: "🇮🇶", name: "Iraq" },
  { code: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "+972", flag: "🇮🇱", name: "Israel" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+1876", flag: "🇯🇲", name: "Jamaica" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "+7", flag: "🇰🇿", name: "Kazakhstan" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+686", flag: "🇰🇮", name: "Kiribati" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+996", flag: "🇰🇬", name: "Kyrgyzstan" },
  { code: "+856", flag: "🇱🇦", name: "Laos" },
  { code: "+371", flag: "🇱🇻", name: "Latvia" },
  { code: "+961", flag: "🇱🇧", name: "Lebanon" },
  { code: "+266", flag: "🇱🇸", name: "Lesotho" },
  { code: "+231", flag: "🇱🇷", name: "Liberia" },
  { code: "+218", flag: "🇱🇾", name: "Libya" },
  { code: "+423", flag: "🇱🇮", name: "Liechtenstein" },
  { code: "+370", flag: "🇱🇹", name: "Lithuania" },
  { code: "+352", flag: "🇱🇺", name: "Luxembourg" },
  { code: "+261", flag: "🇲🇬", name: "Madagascar" },
  { code: "+265", flag: "🇲🇼", name: "Malawi" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+960", flag: "🇲🇻", name: "Maldives" },
  { code: "+223", flag: "🇲🇱", name: "Mali" },
  { code: "+356", flag: "🇲🇹", name: "Malta" },
  { code: "+692", flag: "🇲🇭", name: "Marshall Islands" },
  { code: "+222", flag: "🇲🇷", name: "Mauritania" },
  { code: "+230", flag: "🇲🇺", name: "Mauritius" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "+691", flag: "🇫🇲", name: "Micronesia" },
  { code: "+373", flag: "🇲🇩", name: "Moldova" },
  { code: "+377", flag: "🇲🇨", name: "Monaco" },
  { code: "+976", flag: "🇲🇳", name: "Mongolia" },
  { code: "+382", flag: "🇲🇪", name: "Montenegro" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+258", flag: "🇲🇿", name: "Mozambique" },
  { code: "+95", flag: "🇲🇲", name: "Myanmar" },
  { code: "+264", flag: "🇳🇦", name: "Namibia" },
  { code: "+674", flag: "🇳🇷", name: "Nauru" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+64", flag: "🇳🇿", name: "New Zealand" },
  { code: "+505", flag: "🇳🇮", name: "Nicaragua" },
  { code: "+227", flag: "🇳🇪", name: "Niger" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+850", flag: "🇰🇵", name: "North Korea" },
  { code: "+389", flag: "🇲🇰", name: "North Macedonia" },
  { code: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+680", flag: "🇵🇼", name: "Palau" },
  { code: "+970", flag: "🇵🇸", name: "Palestine" },
  { code: "+507", flag: "🇵🇦", name: "Panama" },
  { code: "+675", flag: "🇵🇬", name: "Papua New Guinea" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "+51", flag: "🇵🇪", name: "Peru" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+48", flag: "🇵🇱", name: "Poland" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+40", flag: "🇷🇴", name: "Romania" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
  { code: "+250", flag: "🇷🇼", name: "Rwanda" },
  { code: "+1869", flag: "🇰🇳", name: "Saint Kitts and Nevis" },
  { code: "+1758", flag: "🇱🇨", name: "Saint Lucia" },
  { code: "+1784", flag: "🇻🇨", name: "Saint Vincent" },
  { code: "+685", flag: "🇼🇸", name: "Samoa" },
  { code: "+378", flag: "🇸🇲", name: "San Marino" },
  { code: "+239", flag: "🇸🇹", name: "São Tomé and Príncipe" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+221", flag: "🇸🇳", name: "Senegal" },
  { code: "+381", flag: "🇷🇸", name: "Serbia" },
  { code: "+248", flag: "🇸🇨", name: "Seychelles" },
  { code: "+232", flag: "🇸🇱", name: "Sierra Leone" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+421", flag: "🇸🇰", name: "Slovakia" },
  { code: "+386", flag: "🇸🇮", name: "Slovenia" },
  { code: "+677", flag: "🇸🇧", name: "Solomon Islands" },
  { code: "+252", flag: "🇸🇴", name: "Somalia" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+211", flag: "🇸🇸", name: "South Sudan" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+249", flag: "🇸🇩", name: "Sudan" },
  { code: "+597", flag: "🇸🇷", name: "Suriname" },
  { code: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "+41", flag: "🇨🇭", name: "Switzerland" },
  { code: "+963", flag: "🇸🇾", name: "Syria" },
  { code: "+886", flag: "🇹🇼", name: "Taiwan" },
  { code: "+992", flag: "🇹🇯", name: "Tajikistan" },
  { code: "+255", flag: "🇹🇿", name: "Tanzania" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+670", flag: "🇹🇱", name: "Timor-Leste" },
  { code: "+228", flag: "🇹🇬", name: "Togo" },
  { code: "+676", flag: "🇹🇴", name: "Tonga" },
  { code: "+1868", flag: "🇹🇹", name: "Trinidad and Tobago" },
  { code: "+216", flag: "🇹🇳", name: "Tunisia" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
  { code: "+993", flag: "🇹🇲", name: "Turkmenistan" },
  { code: "+688", flag: "🇹🇻", name: "Tuvalu" },
  { code: "+256", flag: "🇺🇬", name: "Uganda" },
  { code: "+380", flag: "🇺🇦", name: "Ukraine" },
  { code: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "+998", flag: "🇺🇿", name: "Uzbekistan" },
  { code: "+678", flag: "🇻🇺", name: "Vanuatu" },
  { code: "+379", flag: "🇻🇦", name: "Vatican" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "+967", flag: "🇾🇪", name: "Yemen" },
  { code: "+260", flag: "🇿🇲", name: "Zambia" },
  { code: "+263", flag: "🇿🇼", name: "Zimbabwe" },
];

function CountryPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find((c) => c.code === value) ?? { flag: "🌐", code: value, name: "" };

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="flex items-center gap-1.5 h-[46px] px-3 bg-[#07070E] border border-white/12 rounded-xl text-white text-sm focus:outline-none hover:border-white/25 transition-colors min-w-[90px]"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="font-medium">{selected.code}</span>
        <svg className="ml-auto opacity-40" width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-1.5 left-0 w-64 bg-[#0F0F1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-white/8">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#07070E] border border-white/10">
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none" className="opacity-40 shrink-0">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15 15l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country or code…"
                  className="flex-1 bg-transparent text-white text-xs placeholder:text-[#8888A8]/60 focus:outline-none"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-[#8888A8] hover:text-white text-xs">×</button>
                )}
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-[#8888A8] text-xs text-center py-4">No results</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={`${c.code}-${c.name}`}
                    type="button"
                    onClick={() => { onChange(c.code); setOpen(false); setSearch(""); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/5 transition-colors ${
                      c.code === value && c.name === selected.name ? "bg-[#FF9933]/8" : ""
                    }`}
                  >
                    <span className="text-base shrink-0">{c.flag}</span>
                    <span className="text-white text-xs flex-1 truncate">{c.name}</span>
                    <span className="text-[#8888A8] text-xs shrink-0">{c.code}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type Step = 1 | 2 | 3 | 4;

interface FormData {
  name: string; email: string; countryCode: string; phone: string;
  idNumber: string; gender: string; department: string;
  year: string; accommodation: string; competition: string; timeSlot: string;
}

const EMPTY: FormData = {
  name: "", email: "", countryCode: "+91", phone: "", idNumber: "",
  gender: "", department: "", year: "", accommodation: "", competition: "", timeSlot: "",
};

const MARATHON = "Run for the Nation – 2K Independence Day Marathon";
const isMarathon = (c: string) => c === MARATHON;
const SLOTS = [
  { id: "morning", label: "Slot 1 – Morning", time: "11:00 AM – 1:00 PM" },
  { id: "afternoon", label: "Slot 2 – Afternoon", time: "3:30 PM – 5:30 PM" },
];

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

// ── Original multi-step form for guests ──
function MultiStepRegister({ preComp, session, authStatus }: {
  preComp: string;
  session: { user?: { name?: string | null; email?: string | null } } | null;
  authStatus: string;
}) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({ ...EMPTY, competition: preComp });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deptOther, setDeptOther] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const touch = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));
  const errs = validate(form);
  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, name: e.target.value.replace(/[^a-zA-Z\s]/g, "") }));

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }));

  // ID → auto-fills email
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 11);
    setForm((f) => ({ ...f, idNumber: val, email: val ? `${val}@kluniversity.in` : "" }));
  };

  // KLU email → auto-fills ID
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const match = val.match(/^(\d{10,11})@kluniversity\.in$/i);
    setForm((f) => ({ ...f, email: val, ...(match ? { idNumber: match[1] } : {}) }));
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "Other") { setDeptOther(true); setForm((f) => ({ ...f, department: "" })); }
    else { setDeptOther(false); setForm((f) => ({ ...f, department: e.target.value })); }
  };

  const canStep2 = !!form.department && !!form.year && !!form.accommodation;
  const canStep3 = !!form.competition && (isMarathon(form.competition) || !!form.timeSlot);

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
          name: form.name, email: form.email,
          phone: `${form.countryCode} ${form.phone}`,
          roll_number: form.idNumber, gender: form.gender,
          department: form.department, year: form.year,
          accommodation: form.accommodation, competition: form.competition,
          time_slot: form.timeSlot || null,
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

  const steps = ["Personal Info", "Academic Info", "Choose Event", "Confirm"];
  const variants = { enter: { x: 40, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: -40, opacity: 0 } };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12 bg-[#07070E]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.7 }}
          className="max-w-md w-full text-center"
        >
          <div className="mb-8 flex justify-center chakra-spin"><AshokaCss size={80} /></div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 200 }} className="text-6xl mb-6">🎉</motion.div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl font-black text-white mb-3">Registration Successful!</h2>
          <div className="tricolor-line w-20 mx-auto my-4 rounded-full" />
          <p className="text-[#8888A8] mb-2">Thank you, <strong className="text-white">{form.name}</strong>!</p>
          <p className="text-[#8888A8] text-sm mb-8">
            Registered for <strong className="text-[#FF9933]">{form.competition}</strong>. Confirmation sent to <strong className="text-white">{form.email}</strong>.
          </p>
          <p className="text-[#8888A8] text-xs leading-relaxed mb-8 px-4 py-3 rounded-xl bg-[#0F0F1A] border border-[#138808]/20">
            Your E-Certificate will be automatically generated after successful verification of participation.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setForm({ ...EMPTY }); setStep(1); setTouched({}); setDeptOther(false); }}
              className="px-8 py-3 rounded-full border border-[#FF9933]/40 text-[#FF9933] text-sm font-semibold hover:bg-[#FF9933]/10 transition-colors"
            >Register for another event</button>
            {authStatus === "authenticated" && (
              <Link href="/my-activities" className="px-8 py-3 rounded-full bg-gradient-to-r from-[#138808] to-[#0d6b06] text-white text-sm font-semibold hover:shadow-[0_0_18px_rgba(19,136,8,0.35)] transition-all">
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
        {authStatus === "unauthenticated" && (
          <div className="mb-6 px-4 py-3.5 rounded-xl bg-[#FF9933]/8 border border-[#FF9933]/20 flex items-center justify-between gap-3">
            <p className="text-[#A0A0B8] text-xs leading-relaxed">
              <span className="text-[#FF9933] font-semibold">Login faster</span> — sign in with your KLU email to skip this form.
            </p>
            <Link href="/login?from=/register" className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-[#FF9933] text-black font-bold hover:bg-[#e68000] transition-colors">Login</Link>
          </div>
        )}

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

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center gap-0">
            {steps.map((label, i) => {
              const s = (i + 1) as Step;
              const done = step > s; const active = step === s;
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400 ${done ? "bg-[#138808] text-white" : active ? "bg-gradient-to-br from-[#FF9933] to-[#e68000] text-black shadow-[0_0_18px_rgba(255,153,51,0.35)]" : "bg-[#0F0F1A] text-[#8888A8] border border-white/10"}`}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span className={`hidden sm:block text-[9px] tracking-wide text-center whitespace-nowrap ${active ? "text-[#FF9933]" : done ? "text-[#138808]" : "text-[#8888A8]"}`}>{label}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`flex-1 h-px mx-1 mb-4 transition-colors duration-400 ${done ? "bg-[#138808]/60" : "bg-white/8"}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-glass rounded-3xl p-5 sm:p-7 lg:p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-1">Personal Information</h2>
                <p className="text-[10px] text-[#8888A8]/60 mb-6 tracking-wide">All fields marked <span className="text-[#FF9933]">*</span> are mandatory</p>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">Full Name <span className="text-[#FF9933]">*</span></label>
                    <input type="text" value={form.name} onChange={handleNameChange} onBlur={touch("name")} placeholder="Enter your full name" className={inputCls(!!(touched.name && errs.name))} />
                    {touched.name && errs.name && <p className="mt-1 text-xs text-red-400">{errs.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">Email Address <span className="text-[#FF9933]">*</span></label>
                    <input type="email" value={form.email} onChange={handleEmailChange} onBlur={touch("email")} placeholder="e.g. 2400030188@kluniversity.in" className={inputCls(!!(touched.email && errs.email))} />
                    {touched.email && errs.email && <p className="mt-1 text-xs text-red-400">{errs.email}</p>}
                  </div>

                  {/* ID Number — auto-filled from KLU email */}
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">ID Number <span className="text-[#FF9933]">*</span></label>
                    <input
                      type="text"
                      value={form.idNumber}
                      onChange={handleIdChange}
                      onBlur={touch("idNumber")}
                      placeholder="Auto-filled from your KLU email"
                      maxLength={11}
                      className={inputCls(!!(touched.idNumber && errs.idNumber))}
                    />
                    {touched.idNumber && errs.idNumber && <p className="mt-1 text-xs text-red-400">{errs.idNumber}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">Phone Number <span className="text-[#FF9933]">*</span></label>
                    <div className="flex gap-2">
                      <CountryPicker
                        value={form.countryCode}
                        onChange={(code) => setForm((f) => ({ ...f, countryCode: code }))}
                      />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        onBlur={touch("phone")}
                        placeholder="Phone number"
                        maxLength={10}
                        className={inputCls(!!(touched.phone && errs.phone))}
                      />
                    </div>
                    {touched.phone && errs.phone && <p className="mt-1 text-xs text-red-400">{errs.phone}</p>}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-2 tracking-wide uppercase font-semibold">Gender <span className="text-[#FF9933]">*</span></label>
                    <div className="flex gap-2">
                      {["Male", "Female", "Other"].map((g) => (
                        <button key={g} type="button" onClick={() => setForm((f) => ({ ...f, gender: g }))} className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${form.gender === g ? "border-[#FF9933]/70 bg-[#FF9933]/10 text-[#FF9933]" : "border-white/10 bg-[#07070E] text-[#8888A8] hover:border-white/25 hover:text-white"}`}>{g}</button>
                      ))}
                    </div>
                    {touched.gender && errs.gender && <p className="mt-1 text-xs text-red-400">{errs.gender}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-6">Academic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">Department <span className="text-[#FF9933]">*</span></label>
                    <select value={deptOther ? "Other" : form.department} onChange={handleDeptChange} className="w-full bg-[#07070E] border border-white/12 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF9933]/60 transition-colors">
                      <option value="">Select department</option>
                      {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {deptOther && <input type="text" placeholder="Type your department" value={form.department} onChange={set("department")} autoFocus className="mt-2 w-full bg-[#07070E] border border-[#FF9933]/40 rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#8888A8]/50 focus:outline-none focus:border-[#FF9933]/70 transition-colors" />}
                  </div>
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-1.5 tracking-wide uppercase font-semibold">Year of Study <span className="text-[#FF9933]">*</span></label>
                    <select value={form.year} onChange={set("year")} className="w-full bg-[#07070E] border border-white/12 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF9933]/60 transition-colors">
                      <option value="">Select year</option>
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#8888A8] mb-2 tracking-wide uppercase font-semibold">Accommodation <span className="text-[#FF9933]">*</span></label>
                    <div className="flex gap-2">
                      {["Hosteller", "Day Scholar"].map((a) => (
                        <button key={a} type="button" onClick={() => setForm((f) => ({ ...f, accommodation: a }))} className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${form.accommodation === a ? "border-[#FF9933]/70 bg-[#FF9933]/10 text-[#FF9933]" : "border-white/10 bg-[#07070E] text-[#8888A8] hover:border-white/25 hover:text-white"}`}>{a}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-2">Choose Your Competition</h2>
                <div className="mb-4 px-3 py-3 rounded-xl bg-[#FF9933]/8 border border-[#FF9933]/25 flex items-start gap-2">
                  <span className="text-[#FF9933] text-sm shrink-0 mt-0.5">⏰</span>
                  <p className="text-[#A0A0B8] text-xs leading-relaxed">
                    Competitions run in <strong className="text-white">2 time slots</strong> — students can register in <strong className="text-white">either</strong>: <span className="text-white font-semibold">11:00 AM–1:00 PM</span> or <span className="text-white font-semibold">3:30 PM–5:30 PM</span>
                  </p>
                </div>
                <div className="space-y-2.5 mb-5">
                  {competitions.map((c) => (
                    <button key={c} onClick={() => setForm((f) => ({ ...f, competition: c, timeSlot: "" }))} className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-250 ${form.competition === c ? "border-[#FF9933]/60 bg-[#FF9933]/8 text-white" : "border-white/8 bg-[#07070E] text-[#8888A8] hover:border-white/20 hover:text-white"}`}>
                      <span className={`mr-2 ${form.competition === c ? "text-[#FF9933]" : "text-[#8888A8]"}`}>{form.competition === c ? "●" : "○"}</span>{c}
                    </button>
                  ))}
                </div>
                {form.competition && !isMarathon(form.competition) && (
                  <div className="mt-4 pt-4 border-t border-white/8">
                    <p className="text-sm font-semibold text-white mb-1">Choose Your Time Slot</p>
                    <p className="text-[#8888A8] text-xs mb-3">Both slots are equally valid — pick what suits you</p>
                    <div className="grid grid-cols-2 gap-3">
                      {SLOTS.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, timeSlot: s.time }))}
                          className={`flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl border transition-all duration-200 ${form.timeSlot === s.time ? "border-[#FF9933]/70 bg-[#FF9933]/10 text-[#FF9933]" : "border-white/10 bg-[#07070E] text-[#8888A8] hover:border-white/25 hover:text-white"}`}
                        >
                          <span className="text-[9px] font-bold uppercase tracking-widest">{s.label}</span>
                          <span className={`text-xs font-black ${form.timeSlot === s.time ? "text-white" : "text-[#A0A0B8]"}`}>{s.time}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white mb-6">Review & Confirm</h2>
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Name", value: form.name }, { label: "Email", value: form.email },
                    { label: "Phone", value: `${form.countryCode} ${form.phone}` },
                    { label: "ID No.", value: form.idNumber }, { label: "Gender", value: form.gender },
                    { label: "Department", value: form.department }, { label: "Year", value: form.year },
                    { label: "Stay", value: form.accommodation }, { label: "Competition", value: form.competition },
                    ...(form.timeSlot ? [{ label: "Time Slot", value: form.timeSlot }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3 bg-[#07070E] rounded-xl px-4 py-3">
                      <span className="text-[#8888A8] text-xs font-semibold uppercase tracking-wide w-20 sm:w-24 shrink-0 pt-0.5">{label}</span>
                      <span className="text-white text-sm min-w-0 break-words">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#FF9933]/6 border border-[#FF9933]/20 rounded-xl px-4 py-3 text-xs text-[#A0A0B8] leading-relaxed mb-4">
                  By registering, you confirm that you are committed to participating. Students who register but fail to attend without prior permission may be marked absent.
                </div>
                {submitError && <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 mb-4">{submitError}</div>}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep((s) => (s - 1) as Step)} className="flex-1 py-3 rounded-xl border border-white/12 text-[#8888A8] text-sm font-semibold hover:border-white/25 hover:text-white transition-colors">← Back</button>
            )}
            {step < 4 ? (
              <button onClick={tryNext} disabled={step === 2 ? !canStep2 : step === 3 ? !canStep3 : false} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(255,153,51,0.35)] transition-all duration-300">Continue →</button>
            ) : (
              <button onClick={submit} disabled={submitting} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black text-sm font-bold disabled:opacity-60 hover:shadow-[0_0_22px_rgba(255,153,51,0.4)] transition-all duration-300">{submitting ? "Submitting…" : "Submit Registration 🇮🇳"}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterInner() {
  const searchParams = useSearchParams();
  const preComp = searchParams.get("competition") ?? "";
  const { data: session, status: authStatus } = useSession();
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

  if (!profileChecked || authStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#07070E] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF9933] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authStatus === "authenticated" && profile) {
    return <FastTrackRegister session={session} profile={profile} initialCompetition={preComp} />;
  }

  return <MultiStepRegister preComp={preComp} session={session} authStatus={authStatus} />;
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

"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const schedule: Record<string, { date: string; time: string; venue: string; icon: string }> = {
  "Run for the Nation – 2K Independence Day Marathon":     { date: "09 Aug 2026", time: "05:30 AM – 06:30 AM", venue: "Off Campus", icon: "🏃" },
  "Nation Builders Art Competition":                        { date: "10 Aug 2026", time: "03:20 PM – 05:20 PM", venue: "SAC Hall", icon: "🎨" },
  "Voice of Freedom – Essay Writing & Elocution Competition": { date: "10 Aug 2026", time: "03:20 PM – 05:20 PM", venue: "Rose Hall & Jasmine Hall", icon: "✍️" },
  "Frames of Freedom – Patriotic Photography Outreach Competition": { date: "11 Aug 2026", time: "10:00 AM – 12:20 PM", venue: "Off Campus", icon: "📷" },
  "Vande Bharat Patriotic Reels Challenge":                { date: "11 Aug 2026", time: "03:20 PM – 05:20 PM", venue: "Peacock Hall", icon: "🎬" },
  "Voices of India – Patriotic Singing Competition":       { date: "12 Aug 2026", time: "03:20 PM – 05:20 PM", venue: "R&D Theatre", icon: "🎤" },
  "Patriotic Attire Showcase – Unity in Diversity":        { date: "12 Aug 2026", time: "03:20 PM – 05:20 PM", venue: "New Seminar Hall", icon: "👘" },
  "Rhythms of Freedom – Patriotic Dance Competition":      { date: "13 Aug 2026", time: "03:20 PM – 05:20 PM", venue: "New Seminar Hall", icon: "💃" },
  "Yoga for the Nation – Patriotic Yoga Session":          { date: "13 Aug 2026", time: "03:20 PM – 05:20 PM", venue: "Open Air Theatre (OAT)", icon: "🧘" },
};

interface Registration {
  id: number;
  competition: string;
  created_at: string;
  department: string;
  year: string;
}

interface UserProfile {
  name: string;
  id_number: string;
  department: string;
  year: string;
  gender: string;
  accommodation: string;
  profile_complete: boolean;
}

export default function MyActivitiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/login?from=/my-activities"); return; }
    if (status !== "authenticated") return;

    fetch("/api/my-activities")
      .then((r) => r.json())
      .then((d) => {
        setRegistrations(d.registrations ?? []);
        setProfile(d.profile ?? null);
        if (d.profile && !d.profile.profile_complete) {
          router.replace("/profile");
        }
      })
      .finally(() => setLoading(false));
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070E]">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF9933] border-t-transparent animate-spin" />
      </div>
    );
  }

  const firstName = session?.user?.name?.split(" ")[0] ?? "Student";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A15] to-[#07070E] pt-20 pb-16 px-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#138808]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#FF9933] uppercase font-semibold mb-1">My Dashboard</p>
            <h1 className="font-[family-name:var(--font-cinzel)] text-2xl font-black text-white">
              Welcome, {firstName}!
            </h1>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-xs px-4 py-2 rounded-lg border border-white/10 text-[#8888A8] hover:text-white hover:border-white/25 transition-all"
          >
            Sign Out
          </button>
        </div>

        {/* Profile card */}
        {profile && (
          <div className="card-glass rounded-2xl p-5 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FF9933]/15 border border-[#FF9933]/30 flex items-center justify-center text-lg font-black text-[#FF9933] shrink-0 font-[family-name:var(--font-cinzel)]">
                {session?.user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base">{session?.user?.name}</p>
                <p className="text-[#8888A8] text-xs mb-3">{session?.user?.email}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: "ID No.", value: profile.id_number },
                    { label: "Department", value: profile.department },
                    { label: "Year", value: profile.year },
                    { label: "Gender", value: profile.gender },
                    { label: "Stay", value: profile.accommodation },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[9px] text-[#8888A8] uppercase tracking-wider">{label}</p>
                      <p className="text-white text-xs font-medium truncate">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                href="/profile"
                className="shrink-0 text-[10px] px-3 py-1.5 rounded-lg border border-white/10 text-[#8888A8] hover:text-white hover:border-white/25 transition-all"
              >
                Edit
              </Link>
            </div>
          </div>
        )}

        {/* Registrations */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-white">
            My Registrations
            <span className="ml-2 text-sm font-normal text-[#8888A8]">({registrations.length})</span>
          </h2>
          <Link
            href="/register"
            className="text-xs px-4 py-2 rounded-full bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black font-bold hover:shadow-[0_0_18px_rgba(255,153,51,0.35)] transition-all duration-300"
          >
            + Register
          </Link>
        </div>

        {registrations.length === 0 ? (
          <div className="card-glass rounded-2xl p-10 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-white font-semibold mb-1">No registrations yet</p>
            <p className="text-[#8888A8] text-sm mb-6">Register for competitions and showcase your talent!</p>
            <Link
              href="/register"
              className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black font-bold text-sm hover:shadow-[0_0_18px_rgba(255,153,51,0.35)] transition-all duration-300"
            >
              Browse Events →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => {
              const info = schedule[reg.competition];
              return (
                <div key={reg.id} className="card-glass rounded-2xl p-5 flex items-start gap-4 hover:border-[rgba(255,153,51,0.2)] transition-all duration-300">
                  <div className="text-3xl shrink-0">{info?.icon ?? "🎉"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm leading-snug mb-1">{reg.competition}</p>
                    {info && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8888A8]">
                        <span>📅 {info.date}</span>
                        <span>🕐 {info.time}</span>
                        <span>📍 {info.venue}</span>
                      </div>
                    )}
                    <div className="mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#138808]/15 border border-[#138808]/30 text-[#138808] font-semibold">
                        Registered
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-[#8888A8]/50 text-xs">
            E-Certificates will be issued after the event. Felicitation on 15 Aug 2026 at OAT.
          </p>
        </div>
      </div>
    </div>
  );
}

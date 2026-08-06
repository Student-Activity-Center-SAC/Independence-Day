"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import AshokaCss from "@/components/AshokaCss";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const from = encodeURI(params.get("from") ?? "/profile");
  const [loading, setLoading] = useState(false);
  const error = params.get("error");

  useEffect(() => {
    if (status === "authenticated") router.replace(from);
  }, [status, router, from]);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("microsoft", { callbackUrl: from });
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070E]">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF9933] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A15] to-[#07070E] flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF9933]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* India flag animation */}
        <div className="flex justify-center mb-8">
          <div className="float-anim drop-shadow-[0_8px_30px_rgba(255,153,51,0.35)]">
            <div className="overflow-hidden rounded-[4px] border border-white/15" style={{ width: 90, height: 60 }}>
              <div style={{ height: "33.33%", background: "#FF9933" }} />
              <div style={{ height: "33.33%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="chakra-spin"><AshokaCss size={20} color="#000080" /></div>
              </div>
              <div style={{ height: "33.33%", background: "#138808" }} />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.3em] text-[#FF9933] uppercase font-semibold mb-2">
            KL University · SAC
          </p>
          <h1 className="font-[family-name:var(--font-cinzel)] text-3xl font-black text-white mb-2">
            80th Independence Day
          </h1>
          <p className="text-[#8888A8] text-sm">
            Sign in with your KL University email to register for events
          </p>
        </div>

        {/* Card */}
        <div className="card-glass rounded-2xl p-8">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error === "AccessDenied"
                ? "Only @kluniversity.in email addresses are allowed."
                : "Sign-in failed. Please try again."}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-all duration-200 disabled:opacity-60 shadow-lg"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
            )}
            Continue with Microsoft
          </button>

          <div className="mt-5 text-center">
            <p className="text-[#8888A8] text-xs leading-relaxed">
              Use your{" "}
              <span className="text-white font-medium">@kluniversity.in</span>{" "}
              Microsoft account only.
              <br />
              Personal accounts will be denied access.
            </p>
          </div>
        </div>

        <p className="text-center text-[#8888A8]/50 text-xs mt-6">
          © 2026 KL University · Student Activity Centre
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

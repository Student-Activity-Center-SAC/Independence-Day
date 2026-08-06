"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/competitions", label: "Competitions" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (pathname === "/admin") return;
    const fn = () => setScrolled(window.scrollY > 120);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [pathname]);

  if (pathname === "/admin") return null;

  return (
    <header
      className={`navbar-enter fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#07070E]/92 backdrop-blur-2xl shadow-[0_1px_0_rgba(255,153,51,0.15)]"
          : "bg-transparent"
      }`}
    >
      {/* Tricolor top line */}
      <div className="tricolor-line" />

      <div className="px-3 sm:px-5 lg:px-8 py-1.5 flex items-center justify-between">
        {/* Logo — hidden at hero top, appears on scroll */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div
            className={`relative transition-all duration-500 ease-out ${
              scrolled
                ? "opacity-100 translate-y-0 w-[96px] h-[96px] sm:w-[116px] sm:h-[116px]"
                : "opacity-0 -translate-y-2 w-[96px] h-[96px] sm:w-[116px] sm:h-[116px] pointer-events-none"
            }`}
          >
            <Image
              src="/sac_logo.png"
              alt="SAC KL University"
              fill
              priority
              className="object-contain drop-shadow-[0_0_18px_rgba(255,153,51,0.45)] group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div
            className={`hidden sm:block leading-tight transition-all duration-500 ${
              scrolled ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
            }`}
          >
            <p className="text-[13px] tracking-[0.2em] text-[#FF9933] font-semibold uppercase font-[family-name:var(--font-cinzel)]">
              KL University · SAC
            </p>
            <p className="text-base font-bold text-white font-[family-name:var(--font-cinzel)] tracking-wide">
              Independence Day 2026
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative text-sm font-medium tracking-wide group transition-colors duration-300 ${
                pathname === href ? "text-[#FF9933]" : "text-white/60 hover:text-white"
              }`}
            >
              {label}
              <span
                className={`absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-[#FF9933] to-[#138808] transition-all duration-300 ${
                  pathname === href ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}

          {session ? (
            <div className="ml-4 flex items-center gap-3 border-l border-white/10 pl-4">
              <Link
                href="/my-activities"
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${pathname === "/my-activities" ? "text-[#FF9933]" : "text-white/60 hover:text-white"}`}
              >
                My Activities
              </Link>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-white/50 hover:text-white transition-colors duration-300"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 px-5 py-2 text-sm font-bold rounded-full border border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,153,51,0.4)]"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white rounded-full origin-center"
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-white rounded-full"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white rounded-full origin-center"
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#07070E]/96 backdrop-blur-2xl border-t border-white/8 px-6 pb-6 pt-4 flex flex-col gap-4"
          >
            {/* Logo always at top of drawer */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/8">
              <div className="relative w-12 h-12 shrink-0">
                <Image src="/sac_logo.png" alt="SAC KL University" fill className="object-contain" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] text-[#FF9933] font-semibold uppercase font-[family-name:var(--font-cinzel)]">KL University · SAC</p>
                <p className="text-xs font-bold text-white font-[family-name:var(--font-cinzel)]">Independence Day 2026</p>
              </div>
            </div>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`text-base py-2 font-medium ${pathname === href ? "text-[#FF9933]" : "text-white/70"}`}
              >
                {label}
              </Link>
            ))}
            {session ? (
              <div className="mt-1 space-y-2">
                <Link
                  href="/my-activities"
                  onClick={() => setOpen(false)}
                  className="block py-3 text-center font-bold rounded-full bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black text-sm"
                >
                  My Activities
                </Link>
                <button
                  onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="w-full py-3 text-center font-semibold rounded-full border border-white/15 text-white/60 text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-1 py-3 text-center font-bold rounded-full bg-gradient-to-r from-[#FF9933] to-[#e68000] text-black text-sm block"
              >
                Login
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

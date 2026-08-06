import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const protectedPaths = ["/my-activities", "/profile"];
  if (protectedPaths.some((p) => pathname.startsWith(p)) && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/my-activities/:path*", "/profile/:path*"],
};

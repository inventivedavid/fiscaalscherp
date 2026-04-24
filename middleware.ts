// Basic Auth voor het /admin-pad.
// Wachtwoord? Zie ADMIN_USERNAME / ADMIN_PASSWORD in Vercel env.
//
// Loopt op de Edge runtime — snelle gate vóór de pagina-render.

import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const USER = process.env.ADMIN_USERNAME;
  const PASS = process.env.ADMIN_PASSWORD;
  if (!USER || !PASS) {
    // Niet geconfigureerd → default closed.
    return new NextResponse("Admin niet geconfigureerd", { status: 503 });
  }

  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const [u, p] = atob(header.slice(6)).split(":");
    if (u === USER && p === PASS) return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}

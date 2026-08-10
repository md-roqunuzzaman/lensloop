import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  exp: number;
}

const ROLE_PREFIXES: Record<string, JwtPayload["role"]> = {
  "/dashboard/customer": "CUSTOMER",
  "/dashboard/provider": "PROVIDER",
  "/dashboard/admin": "ADMIN",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const matchedPrefix = Object.keys(ROLE_PREFIXES).find((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!matchedPrefix) return NextResponse.next();

  const token = req.cookies.get("lensloop_token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error("expired");
    }
    const requiredRole = ROLE_PREFIXES[matchedPrefix];
    if (decoded.role !== requiredRole) {
      return NextResponse.redirect(new URL(`/dashboard/${decoded.role.toLowerCase()}`, req.url));
    }
  } catch {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

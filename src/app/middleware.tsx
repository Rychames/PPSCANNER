// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lista de rotas públicas compartilhada
const publicRoutes = ["/login", "/signup", "/VerifyCodePage", "/not-found"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  // Rotas válidas do sistema
  const validRoutes = [
    "/",
    "/login",
    "/add-product",
    "/add-companies",
    "/inventory",
    "/not-found",
    "/signup",
    "/VerifyCodePage",
    "/companies",
  ];

  const isCompanyRoute = pathname.startsWith("/companies/");
  const isRouteValid = validRoutes.includes(pathname) || isCompanyRoute;
  if (!isRouteValid) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!publicRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

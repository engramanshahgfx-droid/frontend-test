import { NextResponse } from "next/server";

const supportedLanguages = ["en", "ar"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (
    pathname === "/admin" ||
    supportedLanguages.some((lang) => pathname === `/${lang}/admin`)
  ) {
    const langFromPath = supportedLanguages.find(
      (lang) => pathname === `/${lang}/admin`
    );

    const langToUse =
      langFromPath ||
      (() => {
        const acceptLang = request.headers.get("Accept-Language") || "";
        const preferredLang = acceptLang.split(",")[0].split("-")[0];
        return supportedLanguages.includes(preferredLang)
          ? preferredLang
          : "en";
      })();

    return NextResponse.redirect(
      new URL(`/${langToUse}/admin/products`, request.url)
    );
  }

  if (
    supportedLanguages.some(
      (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
    )
  ) {
    return NextResponse.next();
  }

  const acceptLang = request.headers.get("Accept-Language") || "";
  const preferredLang = acceptLang.split(",")[0].split("-")[0];

  const langToUse = supportedLanguages.includes(preferredLang)
    ? preferredLang
    : "en";

  return NextResponse.redirect(
    new URL(`/${langToUse}${pathname}`, request.url)
  );
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Rute yang butuh perlindungan login
const protectedRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isLoginRoute = path === "/login";

  // Mengambil token dari cookies
  const token = request.cookies.get("auth_token")?.value;

  try {
    if (token) {
      // Verifikasi token menggunakan jose
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
      await jwtVerify(token, secret);

      // Jika sudah login tapi mencoba ke halaman login, kembalikan ke /admin
      if (isLoginRoute) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // Biarkan lewat jika rute lain
      return NextResponse.next();
    } else {
      throw new Error("Token tidak ada");
    }
  } catch (error) {
    // Jika tidak ada token atau token tidak valid/expired
    if (isProtectedRoute) {
      // Redirect ke login jika mencoba masuk admin
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Konfigurasi Matcher agar middleware tidak berjalan di semua file statis/gambar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - biar route api/user aman diakses tanpa middleware redirect)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

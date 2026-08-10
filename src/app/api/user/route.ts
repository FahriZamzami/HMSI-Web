import { NextResponse } from "next/server";
import { UserModule } from "@/lib/modules/user.module";
import { jwtVerify } from "jose";

// Fungsi pembantu untuk ekstrak userId dari token
async function getUserIdFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/auth_token=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as number;
  } catch (err) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    // Parsing body request
    const body = await request.json();
    const { action, payload } = body;

    // Memeriksa apakah action dan payload dikirimkan
    if (!action) {
      return NextResponse.json(
        { error: "Parameter 'action' diperlukan di dalam body request" },
        { status: 400 }
      );
    }

    let result;
    const response = NextResponse.next(); // Initialize response

    // Routing ke fungsi modul berdasarkan aksi
    switch (action) {
      case "login":
        result = await UserModule.login(payload || {});
        // Jika berhasil login dan ada token, set cookie
        if (result.token) {
          const res = NextResponse.json(result, { status: 200 });
          res.cookies.set("auth_token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 hari
          });
          return res;
        }
        break;

      case "get_current_user": {
        const currentUserId = await getUserIdFromRequest(request);
        if (!currentUserId) throw new Error("Unauthorized");
        result = await UserModule.getProfile(currentUserId);
        return NextResponse.json(result, { status: 200 });
      }

      case "update_status": {
        const currentUserId = await getUserIdFromRequest(request);
        if (!currentUserId) throw new Error("Unauthorized");
        result = await UserModule.updateStatus(currentUserId, payload?.status);
        return NextResponse.json(result, { status: 200 });
      }

      case "change_password": {
        const currentUserId = await getUserIdFromRequest(request);
        if (!currentUserId) throw new Error("Unauthorized");
        const changePayload = { ...payload, userId: currentUserId };
        result = await UserModule.changePassword(changePayload);
        return NextResponse.json(result, { status: 200 });
      }

      case "logout":
        // Menghapus cookie auth_token
        const logoutRes = NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
        logoutRes.cookies.delete("auth_token");
        return logoutRes;

      default:
        return NextResponse.json(
          { error: `Aksi '${action}' tidak dikenali oleh User API` },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API Error [User]:", error.message);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

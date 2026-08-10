import { NextResponse } from "next/server";
import { ProkerModule } from "@/lib/modules/proker.module";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;
    const payload = body.payload || {};

    if (!action) {
      return NextResponse.json(
        { error: "Parameter 'action' diperlukan di dalam body request" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "get_by_divisi":
        result = await ProkerModule.getByDivisiId(Number(payload.divisiId));
        break;

      case "create":
        result = await ProkerModule.create(payload);
        break;

      case "update":
        result = await ProkerModule.update(payload);
        break;

      case "delete":
        result = await ProkerModule.delete(payload);
        break;

      default:
        return NextResponse.json(
          { error: `Aksi '${action}' tidak dikenali oleh Proker API` },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API Error [Proker]:", error.message);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { SaranModule } from "@/lib/modules/saran.module";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;
    const payload = body.payload || {};

    if (!action) {
      return NextResponse.json(
        { error: "Parameter 'action' diperlukan" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "get_all":
        result = await SaranModule.getAll();
        break;

      case "delete":
        result = await SaranModule.delete(Number(payload.saranId));
        break;

      default:
        return NextResponse.json(
          { error: `Aksi '${action}' tidak dikenali` },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

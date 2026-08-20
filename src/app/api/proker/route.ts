import { NextResponse } from "next/server";
import { ProkerModule } from "@/lib/modules/proker.module";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let action: string;
    let payload: any = {};
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      action = formData.get("action") as string;
      payload.periodeId = formData.get("periodeId");
      payload.divisiId = formData.get("divisiId");
      
      const uploadedFile = formData.get("file");
      if (uploadedFile && uploadedFile instanceof File && uploadedFile.size > 0) {
        file = uploadedFile;
      }
    } else {
      const body = await request.json();
      action = body.action;
      payload = body.payload || {};
    }

    if (!action) {
      return NextResponse.json(
        { error: "Parameter 'action' diperlukan di dalam request" },
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

      case "import_bulk":
        if (!file) {
          return NextResponse.json({ error: "File Excel tidak ditemukan" }, { status: 400 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        result = await ProkerModule.importBulk(payload, buffer);
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

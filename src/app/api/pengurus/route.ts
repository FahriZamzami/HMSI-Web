import { NextResponse } from "next/server";
import { PengurusModule } from "@/lib/modules/pengurus.module";

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
      payload.pengurusId = formData.get("pengurusId");
      payload.role = formData.get("role") as string;
      payload.pengurusName = formData.get("pengurusName") as string;
      payload.nomorAnggota = formData.get("nomorAnggota") as string;
      
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
        { error: "Parameter 'action' diperlukan di dalam body request" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "get_taken_global_roles":
        result = await PengurusModule.getTakenGlobalRoles(Number(payload.periodeId));
        break;

      case "get_by_divisi":
        result = await PengurusModule.getByDivisiId(Number(payload.divisiId));
        break;

      case "create":
        result = await PengurusModule.create({ ...payload, file });
        break;

      case "update":
        result = await PengurusModule.update({ ...payload, file });
        break;

      case "delete":
        result = await PengurusModule.delete(payload);
        break;

      case "import_bulk":
        if (!file) {
          return NextResponse.json({ error: "File Excel tidak ditemukan" }, { status: 400 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        result = await PengurusModule.importBulk(payload, buffer);
        break;

      default:
        return NextResponse.json(
          { error: `Aksi '${action}' tidak dikenali oleh Pengurus API` },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API Error [Pengurus]:", error.message);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

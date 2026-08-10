import { NextResponse } from "next/server";
import { DivisiModule } from "@/lib/modules/divisi.module";

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
      payload.divisiName = formData.get("divisiName") as string;
      payload.tentangDivisi = formData.get("tentangDivisi") as string;
      
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
      case "get_by_periode":
        result = await DivisiModule.getByPeriodeId(Number(payload.periodeId));
        break;

      case "get_by_id":
        result = await DivisiModule.getById(Number(payload.divisiId));
        break;

      case "create":
        result = await DivisiModule.create({ ...payload, file });
        break;

      case "update":
        result = await DivisiModule.update({ ...payload, file });
        break;

      default:
        return NextResponse.json(
          { error: `Aksi '${action}' tidak dikenali oleh Divisi API` },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API Error [Divisi]:", error.message);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

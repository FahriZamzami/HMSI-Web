import { NextResponse } from "next/server";
import { PublicModule } from "@/lib/modules/public.module";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let action: string;
    let payload: any = {};
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      action = formData.get("action") as string;
      payload.saran = formData.get("saran") as string;
      
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
      case "get_active_periode_data":
        result = await PublicModule.getActivePeriodeData();
        break;

      case "get_divisi_detail":
        result = await PublicModule.getDivisiDetail(Number(payload.divisiId));
        break;

      case "get_alumni_periode":
        result = await PublicModule.getAlumniPeriode();
        break;

      case "get_alumni_periode_detail":
        result = await PublicModule.getAlumniPeriodeDetail(Number(payload.periodeId));
        break;

      case "submit_saran":
        result = await PublicModule.submitSaran({ ...payload, file });
        break;

      default:
        return NextResponse.json(
          { error: `Aksi '${action}' tidak dikenali oleh Public API` },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API Error [Public]:", error.message);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { PeriodeModule } from "@/lib/modules/periode.module";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let action: string;
    let payload: any = {};
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      action = formData.get("action") as string;
      payload.periode = formData.get("periode") as string;
      payload.periodeId = formData.get("periodeId");
      payload.status = formData.get("status") as string;
      payload.replacementPeriodeId = formData.get("replacementPeriodeId");
      payload.newPeriodeName = formData.get("newPeriodeName") as string;
      
      const uploadedFile = formData.get("file");
      if (uploadedFile && uploadedFile instanceof File && uploadedFile.size > 0) {
        file = uploadedFile;
      }

      const newUploadedFile = formData.get("newPeriodeFile");
      if (newUploadedFile && newUploadedFile instanceof File && newUploadedFile.size > 0) {
        payload.newPeriodeFile = newUploadedFile;
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
      case "get_all":
        result = await PeriodeModule.getAll();
        break;

      case "get_by_id":
        result = await PeriodeModule.getById(Number(payload.periodeId));
        break;

      case "create":
        result = await PeriodeModule.create({ ...payload, file });
        break;

      case "update":
        result = await PeriodeModule.update({ ...payload, file });
        break;

      case "update_and_create_replacement":
        result = await PeriodeModule.updateAndCreateReplacement({ ...payload, file });
        break;

      case "delete":
        result = await PeriodeModule.delete(payload);
        break;

      default:
        return NextResponse.json(
          { error: `Aksi '${action}' tidak dikenali oleh Periode API` },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API Error [Periode]:", error.message);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

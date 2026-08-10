import { NextResponse } from "next/server";
import { PostModule } from "@/lib/modules/post.module";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let action: string = "";
    let payload: any = {};
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      action = formData.get("action") as string;
      payload.postId = formData.get("postId");
      payload.title = formData.get("title") as string;
      payload.description = formData.get("description") as string;

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
        { error: "Parameter 'action' diperlukan" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "get_all":
        result = await PostModule.getAll();
        break;

      case "get_by_id":
        result = await PostModule.getById(Number(payload.postId));
        break;

      case "create":
        if (!file) {
          return NextResponse.json({ error: "Gambar post wajib diisi" }, { status: 400 });
        }
        result = await PostModule.create({ ...payload, file });
        break;

      case "update":
        result = await PostModule.update({ ...payload, postId: Number(payload.postId), file });
        break;

      case "delete":
        result = await PostModule.delete(Number(payload.postId));
        break;

      default:
        return NextResponse.json(
          { error: `Aksi '${action}' tidak dikenali` },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API Error [Post]:", error.message);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

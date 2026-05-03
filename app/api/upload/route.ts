import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const placeholderValues = ["your_cloud_name", "your_api_key", "your_api_secret"];
    const invalidConfig =
      !cloudName || !apiKey || !apiSecret ||
      placeholderValues.includes(cloudName.trim()) ||
      placeholderValues.includes(apiKey.trim()) ||
      placeholderValues.includes(apiSecret.trim());

    if (invalidConfig) {
      console.error("Cloudinary config invalid", { cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret });
      return NextResponse.json(
        {
          error:
            "Cloudinary belum dikonfigurasi dengan benar. Ganti placeholder di env vars dengan kredensial yang valid.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "azzam-barokah-steel",
      resource_type: "image",
    });

    if (!result?.secure_url) {
      const message = (result as any)?.error?.message || "Tidak ada URL gambar yang diterima dari Cloudinary.";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    let message = "Gagal mengupload gambar";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    } else if (error && typeof error === "object") {
      message = (error as any).message || JSON.stringify(error);
    }

    console.error("Upload error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const featured = searchParams.get("featured");
  const limit = Number(searchParams.get("limit") ?? "0");

  const rows = await prisma.portfolio.findMany({
    where: {
      ...(type ? { projectType: type as never } : {}),
      ...(featured === "true" ? { isFeatured: true } : {}),
    },
    orderBy: { createdAt: "desc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireSession();
    if ("error" in guard) return guard.error;
    
    const body = await request.json();
    const { image, ...data } = body;

    // Validate required fields
    if (!data.title || !data.title.trim()) {
      return NextResponse.json(
        { error: "Judul proyek adalah wajib" },
        { status: 400 }
      );
    }
    if (!data.projectType) {
      return NextResponse.json(
        { error: "Tipe proyek adalah wajib" },
        { status: 400 }
      );
    }
    if (!data.description || !data.description.trim()) {
      return NextResponse.json(
        { error: "Deskripsi proyek adalah wajib" },
        { status: 400 }
      );
    }

    const row = await prisma.portfolio.create({
      data: {
        ...data,
        image: image || null,
      },
    });

    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("Portfolio POST error:", error);
    const message = error instanceof Error ? error.message : "Gagal membuat portofolio";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

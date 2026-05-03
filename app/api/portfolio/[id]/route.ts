import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const row = await prisma.portfolio.findUnique({
    where: { id },
  });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const guard = await requireSession();
    if ("error" in guard) return guard.error;
    const { id } = await params;
    const body = await request.json();
    const { image, ...data } = body;

    // Validate required fields if provided
    if ("title" in data && (!data.title || !data.title.trim())) {
      return NextResponse.json(
        { error: "Judul proyek adalah wajib" },
        { status: 400 }
      );
    }
    if ("projectType" in data && !data.projectType) {
      return NextResponse.json(
        { error: "Tipe proyek adalah wajib" },
        { status: 400 }
      );
    }
    if ("description" in data && (!data.description || !data.description.trim())) {
      return NextResponse.json(
        { error: "Deskripsi proyek adalah wajib" },
        { status: 400 }
      );
    }

    const row = await prisma.portfolio.update({
      where: { id },
      data: {
        ...data,
        image: image || null,
      },
    });
    return NextResponse.json(row);
  } catch (error) {
    console.error("Portfolio PATCH error:", error);
    const message = error instanceof Error ? error.message : "Gagal mengupdate portofolio";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const guard = await requireSession();
    if ("error" in guard) return guard.error;
    const { id } = await params;
    await prisma.portfolio.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Portfolio DELETE error:", error);
    const message = error instanceof Error ? error.message : "Gagal menghapus portofolio";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

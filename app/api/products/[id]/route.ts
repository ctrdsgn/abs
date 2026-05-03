import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const guard = await requireSession();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  const body = await request.json();
  const { images, ...data } = body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(Array.isArray(images)
        ? {
            images: {
              deleteMany: {},
              create: images.map((img: { url: string; sortOrder?: number }, idx: number) => ({
                url: img.url,
                sortOrder: img.sortOrder ?? idx,
              })),
            },
          }
        : {}),
    },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json(product);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const guard = await requireSession();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

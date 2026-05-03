import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const guard = await requireSession();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  const body = await request.json();
  const row = await prisma.order.update({
    where: { id },
    data: {
      ...(body.status ? { status: body.status } : {}),
      ...(typeof body.notes === "string" ? { notes: body.notes } : {}),
    },
  });
  return NextResponse.json(row);
}

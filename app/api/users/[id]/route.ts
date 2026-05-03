import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/api-auth";
import { hash } from "bcryptjs";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  const body = await request.json();
  const updateData: Record<string, unknown> = {};

  if (body.name) updateData.name = body.name;
  if (body.email) updateData.email = body.email;
  if (body.role) updateData.role = body.role;
  if (body.password) updateData.password = await hash(body.password, 10);

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
  return NextResponse.json(user);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return guard.error;
  const { id } = await params;
  if (guard.session.user.id === id) {
    return NextResponse.json({ error: "Tidak dapat menghapus akun sendiri" }, { status: 400 });
  }
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

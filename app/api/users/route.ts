import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/api-auth";
import { hash } from "bcryptjs";

export async function GET() {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return guard.error;
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return guard.error;
  const body = await request.json();
  const password = await hash(body.password, 10);
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password,
      role: body.role ?? "STAFF",
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
  return NextResponse.json(user, { status: 201 });
}

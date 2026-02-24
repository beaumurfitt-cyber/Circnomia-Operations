import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const account = await prisma.account.findUnique({ where: { id: params.id } });
  return NextResponse.json(account);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const account = await prisma.account.update({ where: { id: params.id }, data: body });
  return NextResponse.json(account);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.account.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

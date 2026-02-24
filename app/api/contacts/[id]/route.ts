import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(await prisma.contact.findUnique({ where: { id: params.id } }));
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(await prisma.contact.update({ where: { id: params.id }, data: await req.json() }));
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.contact.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

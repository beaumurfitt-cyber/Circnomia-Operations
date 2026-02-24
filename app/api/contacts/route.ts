import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");
  const contacts = await prisma.contact.findMany({ where: accountId ? { accountId } : undefined });
  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const contact = await prisma.contact.create({ data: body });
  return NextResponse.json(contact, { status: 201 });
}

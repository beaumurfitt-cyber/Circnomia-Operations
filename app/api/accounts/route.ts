import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const accounts = await prisma.account.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const account = await prisma.account.create({
    data: {
      name: body.name,
      website: body.website,
      industry: body.industry ?? "Unknown",
      region: body.region ?? "Unknown"
    }
  });
  return NextResponse.json(account, { status: 201 });
}

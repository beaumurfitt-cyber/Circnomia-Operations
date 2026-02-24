import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.outreachDraft.deleteMany();
  await prisma.discProfile.deleteMany();
  await prisma.enrichment.deleteMany();
  await prisma.source.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.account.deleteMany();

  const mining = await prisma.account.create({ data: { name: "Pilbara Minerals Ops", website: "https://example.com", industry: "Mining", region: "WA Regional" } });
  const water = await prisma.account.create({ data: { name: "Riverland Water Authority", industry: "Water", region: "SA Regional" } });
  const council = await prisma.account.create({ data: { name: "North Shire Council", industry: "Council", region: "NSW Regional" } });

  await prisma.contact.createMany({
    data: [
      { accountId: mining.id, name: "Alex Porter", title: "COO", email: "alex@pilbara.example" },
      { accountId: water.id, name: "Jess Lane", title: "GM Ops", phone: "+61-400-000-001" },
      { accountId: council.id, name: "Morgan Lee", title: "CIO", email: "morgan@shire.example", phone: "+61-400-000-002" }
    ]
  });
}

main().finally(async () => prisma.$disconnect());

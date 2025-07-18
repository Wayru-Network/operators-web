import { PrismaClient } from "@/lib/generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const Prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = Prisma;

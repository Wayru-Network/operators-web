import { PrismaClient } from "@/lib/generated/prisma";
import { env } from "@/lib/env/env";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const Prisma = globalForPrisma.prisma || new PrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = Prisma;

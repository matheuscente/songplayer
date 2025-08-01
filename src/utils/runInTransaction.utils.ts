import prisma from "../prismaUtils/client"
export async function runInTransaction<T>(fn: () => Promise<T | void>): Promise<T | void> {
  return prisma.$transaction(() => fn());
}

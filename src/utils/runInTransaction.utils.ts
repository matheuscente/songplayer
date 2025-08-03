import { Prisma } from "@prisma/client";
import database from "../prismaUtils/client"

async function runInTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return database.$transaction(async (tx) => {
    return fn(tx);
  });
}

export default runInTransaction
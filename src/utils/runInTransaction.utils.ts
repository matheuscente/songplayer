import database from "../database";

export function runInTransaction<T>(fn: () => T): T {
  const transaction = database.transaction(fn);
  return transaction();
}

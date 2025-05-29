import { Lock } from "redlock";
import { redlock } from "./redis";

export async function lockProducts(productIds: string[], ttl = 5000) {
  const locks = await Promise.all(
    productIds.map(id =>
      redlock.acquire([`locks:product:${id}`], ttl)
    )
  );
  return locks;
}

export async function unlockProducts(locks: Lock[]) {
  await Promise.all(locks.map(lock => lock.release()));
}
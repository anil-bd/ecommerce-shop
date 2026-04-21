#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const noncePath = resolve(__dirname, "..", "data", "rotation-nonce.json");

async function main() {
  const raw = await readFile(noncePath, "utf8");
  const data = JSON.parse(raw);
  const current = Number(data.nonce ?? 0);
  const next = current + 1;
  const updated = {
    ...data,
    nonce: next,
    bumpedAt: new Date().toISOString(),
  };
  await writeFile(noncePath, JSON.stringify(updated, null, 2) + "\n");
  console.log(`Bumped rotation nonce: ${current} -> ${next}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

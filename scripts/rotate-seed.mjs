#!/usr/bin/env node
import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedPath = resolve(__dirname, "..", "data", "dom-seed.json");

function main() {
  const seed = randomBytes(16).toString("hex");
  const buildId = `build-${new Date().toISOString().slice(0, 10)}-${seed.slice(0, 6)}`;
  const payload = {
    seed,
    generatedAt: new Date().toISOString(),
    buildId,
    strategyVersion: 1,
  };
  return writeFile(seedPath, JSON.stringify(payload, null, 2) + "\n").then(() => {
    console.log(`Rotated DOM seed → ${buildId}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

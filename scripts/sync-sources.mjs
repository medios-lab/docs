#!/usr/bin/env node
/**
 * Sync pinned OpenAPI specs from a medios checkout into static/openapi/.
 * Usage: node scripts/sync-sources.mjs --medios-dir ../medios
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

const ROOT = path.resolve(import.meta.dirname, '..');
const mediosDir = path.resolve(ROOT, getArg('--medios-dir', '../medios'));

const copies = [
  ['api/openapi/controller.openapi.json', 'static/openapi/controller.openapi.json'],
  ['api/openapi/node.openapi.json', 'static/openapi/node.openapi.json'],
];

for (const [srcRel, dstRel] of copies) {
  const src = path.join(mediosDir, srcRel);
  const dst = path.join(ROOT, dstRel);
  if (!fs.existsSync(src)) {
    console.error(`Missing source file: ${src}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  console.log(`Synced ${srcRel} -> ${dstRel}`);
}

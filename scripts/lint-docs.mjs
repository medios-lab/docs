#!/usr/bin/env node
/**
 * Public-release documentation hygiene and sidebar integrity linter.
 * Enforces Medios style-guide invariants across docs/.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const sidebars = require(path.join(ROOT, 'sidebars.js'));

const VALID_DOC_TYPES = new Set(['concept', 'tutorial', 'how-to', 'reference', 'release-notes']);

const FORBIDDEN_PATTERNS = [
  { name: 'private org/user handle', re: /\btnn1t1s\b/gi },
  { name: 'internal coordinator handle', re: /\bmedios-eng\b/gi },
  { name: 'internal teams repo', re: /\bmedios-teams\b/gi },
  { name: 'internal framework name (fennel)', re: /\bfennel\b/gi },
  { name: 'private LAN IP', re: /\b192\.168\.\d+\.\d+\b/g },
  { name: 'private overlay IP', re: /\b100\.122\.\d+\.\d+\b/g },
  { name: 'private host name', re: /\b(?:spark-e9be|mercy|francie)\b/gi },
  { name: 'private Go repo config', re: /\bGOPRIVATE\b/g },
  { name: 'internal decision record ID', re: /\bDR-\d+\b/g },
  { name: 'internal principle ID', re: /\bFAC3-\d+\b/g },
  { name: 'internal build ticket ID', re: /\bBUILD-\d+\b/g },
  { name: 'internal phase label', re: /\bPHASE-[A-C]\b/g },
  { name: 'deprecated upstream daemon', re: /\b(?:mesos-master|mesos-slave)\b/gi },
  { name: 'deprecated wire field', re: /\bagent_id\b/g },
];

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      results.push(full);
    }
  }
  return results.sort();
}

function collectSidebarIds(items, out = new Set()) {
  for (const item of items) {
    if (typeof item === 'string') {
      out.add(item);
    } else if (item && typeof item === 'object') {
      if (item.link && item.link.type === 'doc' && item.link.id) {
        out.add(item.link.id);
      }
      if (Array.isArray(item.items)) {
        collectSidebarIds(item.items, out);
      }
    }
  }
  return out;
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/);
    if (kv) {
      fm[kv[1].trim()] = kv[2].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return fm;
}

function stripFencedCode(body) {
  return body.replace(/```[\s\S]*?```/g, '');
}

const errors = [];
const sidebarIds = collectSidebarIds(sidebars.docsSidebar);
const files = walk(DOCS_DIR);
const docIds = new Set();

for (const file of files) {
  const rel = path.relative(DOCS_DIR, file).replace(/\\/g, '/');
  const id = rel.replace(/\.mdx?$/, '');
  docIds.add(id);

  const raw = fs.readFileSync(file, 'utf8');
  const fm = parseFrontmatter(raw);
  if (!fm) {
    errors.push(`${rel}: missing YAML frontmatter`);
    continue;
  }
  if (!fm.title) {
    errors.push(`${rel}: frontmatter missing 'title'`);
  }
  if (!fm.doc_type || !VALID_DOC_TYPES.has(fm.doc_type)) {
    errors.push(`${rel}: frontmatter 'doc_type' must be one of ${[...VALID_DOC_TYPES].join(', ')}`);
  }

  const prose = stripFencedCode(raw);
  for (const rule of FORBIDDEN_PATTERNS) {
    const match = prose.match(rule.re);
    if (match) {
      errors.push(`${rel}: forbidden ${rule.name} (${match[0]})`);
    }
  }
  if (id !== 'faq' && /\bApache Mesos\b/i.test(prose)) {
    errors.push(`${rel}: 'Apache Mesos' is only permitted in faq.md`);
  }
  const issueRef = prose.match(/(?:^|\s)#[0-9]{2,4}\b/m);
  if (issueRef) {
    errors.push(`${rel}: GitHub issue reference in product prose (${issueRef[0].trim()})`);
  }
}

for (const id of sidebarIds) {
  if (!docIds.has(id)) {
    errors.push(`sidebars.js: missing file for doc ID '${id}'`);
  }
}
for (const id of docIds) {
  if (!sidebarIds.has(id)) {
    errors.push(`docs/${id}.md: orphan file not referenced in sidebars.js`);
  }
}

if (errors.length > 0) {
  console.error(`Docs lint failed with ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`Docs lint passed: ${docIds.size} pages validated against sidebars.js and style-guide rules.`);

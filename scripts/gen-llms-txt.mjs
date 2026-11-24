#!/usr/bin/env node
/**
 * Generate agent-first documentation artifacts into static/:
 * - static/llms.txt            (llms.txt index with raw Markdown + OpenAPI links)
 * - static/llms-full.txt       (complete concatenated Markdown corpus)
 * - static/llms-framework.txt  (scoped bundle for framework-building agents)
 * - static/llms-operator.txt   (scoped bundle for cluster-operator agents)
 * - static/md/<doc-id>.md      (raw Markdown mirrors of every published doc)
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const STATIC_DIR = path.join(ROOT, 'static');
const MD_OUT_DIR = path.join(STATIC_DIR, 'md');
const sidebars = require(path.join(ROOT, 'sidebars.js'));
const cfgText = fs.readFileSync(path.join(ROOT, 'docusaurus.config.js'), 'utf8');
const urlMatch = cfgText.match(/\burl:\s*['"]([^'"]+)['"]/);
const BASE_URL = (urlMatch ? urlMatch[1] : 'https://docs.medios.dev').replace(/\/$/, '');

function parseDoc(id) {
  const filePath = path.join(DOCS_DIR, `${id}.md`);
  const raw = fs.readFileSync(filePath, 'utf8');
  let title = id;
  let docType = 'concept';
  let slug = `/${id.replace(/\/index$/, '')}`;
  let body = raw;

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (fmMatch) {
    body = raw.slice(fmMatch[0].length).trim();
    for (const line of fmMatch[1].split('\n')) {
      const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/);
      if (!kv) continue;
      const k = kv[1].trim();
      const v = kv[2].trim().replace(/^['"]|['"]$/g, '');
      if (k === 'title') title = v;
      if (k === 'doc_type') docType = v;
      if (k === 'slug') slug = v;
    }
  }

  // Extract first non-heading, non-admonition summary sentence
  let summary = '';
  for (const para of body.split(/\n\n+/)) {
    const clean = para.trim();
    if (!clean || clean.startsWith('#') || clean.startsWith(':::') || clean.startsWith('```') || clean.startsWith('|') || clean.startsWith('<!--')) {
      continue;
    }
    summary = clean.replace(/\s+/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    if (summary.length > 160) {
      summary = summary.slice(0, 157).replace(/\s+\S*$/, '') + '…';
    }
    break;
  }

  return { id, title, docType, slug, summary, raw, body };
}

function collectSections(items) {
  const sections = [];
  let topLevel = [];
  for (const item of items) {
    if (typeof item === 'string') {
      topLevel.push(item);
    } else if (item && typeof item === 'object') {
      if (topLevel.length > 0) {
        sections.push({ label: 'Start Here', ids: topLevel });
        topLevel = [];
      }
      const ids = [];
      if (item.link && item.link.type === 'doc' && item.link.id) {
        ids.push(item.link.id);
      }
      if (Array.isArray(item.items)) {
        for (const sub of item.items) {
          if (typeof sub === 'string') ids.push(sub);
        }
      }
      sections.push({ label: item.label, ids });
    }
  }
  if (topLevel.length > 0) {
    sections.push({ label: 'Troubleshooting & FAQ', ids: topLevel });
  }
  return sections;
}

// Clean previous raw md mirrors
if (fs.existsSync(MD_OUT_DIR)) {
  fs.rmSync(MD_OUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(MD_OUT_DIR, { recursive: true });

const sections = collectSections(sidebars.docsSidebar);
const allDocs = [];
const docMap = new Map();

for (const sec of sections) {
  for (const id of sec.ids) {
    const doc = parseDoc(id);
    allDocs.push(doc);
    docMap.set(id, doc);
    const mirrorPath = path.join(MD_OUT_DIR, `${id}.md`);
    fs.mkdirSync(path.dirname(mirrorPath), { recursive: true });
    fs.writeFileSync(mirrorPath, doc.raw, 'utf8');
  }
}

// 1. Generate static/llms.txt
const llmsLines = [
  '# Medios Documentation',
  '',
  '> Medios is a resource broker for agentic and AI workloads. Nodes advertise declared compute resources, `medios-controller` brokers resource offers, and external frameworks (including AI agents and runtimes like `ray-medios`) own scheduling policy over `/api/v1/scheduler`.',
  '',
  '## Machine-Readable Bundles & Schemas',
  '',
  `- [Full Documentation Bundle](${BASE_URL}/llms-full.txt): Complete Markdown corpus of all ${allDocs.length} pages.`,
  `- [Framework Builder Bundle](${BASE_URL}/llms-framework.txt): Architecture, workloads, scheduler contract, Go SDK, HTTP API, and field/reason references.`,
  `- [Cluster Operator Bundle](${BASE_URL}/llms-operator.txt): Installation, cluster operations, security, CLI flags, operator API, environment variables, and metrics.`,
  `- [Controller OpenAPI Spec](${BASE_URL}/openapi/controller.openapi.json): Machine-readable OpenAPI specification for \`medios-controller\`.`,
  `- [Node OpenAPI Spec](${BASE_URL}/openapi/node.openapi.json): Machine-readable OpenAPI specification for \`medios-node\`.`,
  '',
];

for (const sec of sections) {
  llmsLines.push(`## ${sec.label}`, '');
  for (const id of sec.ids) {
    const d = docMap.get(id);
    const mdUrl = `${BASE_URL}/md/${d.id}.md`;
    const desc = d.summary ? `: ${d.summary}` : '';
    llmsLines.push(`- [${d.title}](${mdUrl}) (${d.docType})${desc}`);
  }
  llmsLines.push('');
}

fs.writeFileSync(path.join(STATIC_DIR, 'llms.txt'), llmsLines.join('\n'), 'utf8');

// Helper to write concatenated bundles
function writeBundle(filename, header, ids) {
  const parts = [header, ''];
  for (const id of ids) {
    const d = docMap.get(id);
    if (!d) continue;
    parts.push(
      `---`,
      `source: ${BASE_URL}/md/${d.id}.md`,
      `url: ${BASE_URL}${d.slug}`,
      `doc_type: ${d.docType}`,
      `---`,
      '',
      d.body,
      '',
    );
  }
  fs.writeFileSync(path.join(STATIC_DIR, filename), parts.join('\n'), 'utf8');
}

const frameworkPrefixes = ['overview', 'architecture/', 'workloads/', 'frameworks/', 'go-sdk/', 'api/', 'reference/task-fields', 'reference/task-state-reasons', 'known-issues', 'faq'];
const operatorPrefixes = ['overview', 'quick-start', 'installation/', 'architecture/', 'operations/', 'security/', 'cli/', 'api/index', 'api/openapi', 'api/operator', 'reference/env-variables', 'reference/metrics', 'known-issues', 'faq'];

const matchesAny = (id, prefixes) => prefixes.some(p => (p.endsWith('/') ? id.startsWith(p) : id === p));

writeBundle(
  'llms-full.txt',
  `# Medios Documentation — Full Bundle (${allDocs.length} pages)`,
  allDocs.map(d => d.id),
);

const fwIds = allDocs.map(d => d.id).filter(id => matchesAny(id, frameworkPrefixes));
writeBundle(
  'llms-framework.txt',
  `# Medios Documentation — Framework Builder Bundle (${fwIds.length} pages)`,
  fwIds,
);

const opIds = allDocs.map(d => d.id).filter(id => matchesAny(id, operatorPrefixes));
writeBundle(
  'llms-operator.txt',
  `# Medios Documentation — Cluster Operator Bundle (${opIds.length} pages)`,
  opIds,
);

console.log(
  `Generated llms.txt, llms-full.txt (${allDocs.length} pages), llms-framework.txt (${fwIds.length} pages), llms-operator.txt (${opIds.length} pages), and ${allDocs.length} raw Markdown mirrors under static/md/.`,
);

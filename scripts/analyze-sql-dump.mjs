#!/usr/bin/env node
/**
 * Quick row-count inventory from a phpMyAdmin SQL dump (no MySQL server required).
 * Usage: node scripts/analyze-sql-dump.mjs "greenpro (16).sql"
 */
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const dumpPath = process.argv[2] || path.join('greenpro (16).sql');
if (!fs.existsSync(dumpPath)) {
  console.error(`File not found: ${dumpPath}`);
  process.exit(1);
}

const tableCounts = new Map();
let currentTable = null;
let tupleCount = 0;
let inInsert = false;

const tupleRegex = /^\((.*)\),?$/;

async function main() {
  const rl = readline.createInterface({
    input: fs.createReadStream(dumpPath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const insertStart = line.match(/^INSERT INTO `([^`]+)`/);
    if (insertStart) {
      currentTable = insertStart[1];
      inInsert = true;
      const valuesIdx = line.indexOf('VALUES');
      if (valuesIdx >= 0) {
        const rest = line.slice(valuesIdx + 6).trim();
        if (rest.startsWith('(')) {
          countLineTuples(rest);
        }
      }
      continue;
    }

    if (inInsert && currentTable) {
      if (line.startsWith('--') || line.startsWith('CREATE TABLE')) {
        flushTable();
        continue;
      }
      countLineTuples(line.trim());
      if (line.trim().endsWith(';')) {
        flushTable();
      }
    }
  }

  flushTable();

  const rows = [...tableCounts.entries()].sort((a, b) => b[1] - a[1]);
  let total = 0;
  console.log(`\nSQL dump analysis: ${dumpPath}\n`);
  console.log(`${'Table'.padEnd(45)} Rows`);
  console.log('-'.repeat(55));
  for (const [table, count] of rows) {
    total += count;
    console.log(`${table.padEnd(45)} ${String(count).padStart(8)}`);
  }
  console.log('-'.repeat(55));
  console.log(`${'TOTAL'.padEnd(45)} ${String(total).padStart(8)}`);
  console.log(`\nTables: ${rows.length}`);
}

function countLineTuples(line) {
  if (!line) return;
  const parts = line.split(/\),\s*\(/);
  for (const part of parts) {
    const m = part.match(tupleRegex);
    if (m) tupleCount++;
  }
}

function flushTable() {
  if (currentTable && tupleCount > 0) {
    tableCounts.set(currentTable, (tableCounts.get(currentTable) || 0) + tupleCount);
  }
  currentTable = null;
  tupleCount = 0;
  inInsert = false;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

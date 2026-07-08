const fs = require('fs');
const path = require('path');

const sqlPath =
  process.argv[2] ||
  'C:/Users/ADMIN/.cursor/projects/d-Node-greenpro/uploads/Untitled-1-L1-L1808-0.txt';
const outPath =
  process.argv[3] ||
  path.join(__dirname, '../docs/GREENPRO-MYSQL-DATABASE-INVENTORY.md');

const sql = fs.readFileSync(sqlPath, 'utf8');

const tables = [];
const createRe = /CREATE TABLE IF NOT EXISTS `([^`]+)` \(([\s\S]*?)\) ENGINE=/g;
let m;
while ((m = createRe.exec(sql)) !== null) {
  const name = m[1];
  const body = m[2];
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('--'));
  let pk = null;
  const indexes = [];
  const fks = [];
  const columns = [];
  for (const line of lines) {
    if (line.startsWith('PRIMARY KEY')) {
      const pm = line.match(/PRIMARY KEY \(`([^`]+)`\)/);
      if (pm) pk = pm[1];
      continue;
    }
    if (
      line.startsWith('KEY ') ||
      line.startsWith('UNIQUE KEY ') ||
      line.startsWith('FULLTEXT KEY ')
    ) {
      indexes.push(line.replace(/,$/, ''));
      continue;
    }
    if (line.startsWith('CONSTRAINT') || line.includes('FOREIGN KEY')) {
      fks.push(line.replace(/,$/, ''));
      continue;
    }
    const cm = line.match(/^`([^`]+)`\s+(.+?)(?:,)?$/);
    if (!cm) continue;
    columns.push({ col: cm[1], def: cm[2], nullable: isNullable(cm[2]) });
  }
  tables.push({ name, pk, indexes, fks, columns });
}

const alterRe = /ALTER TABLE `([^`]+)` ADD FULLTEXT KEY[^;]+;/g;
while ((m = alterRe.exec(sql)) !== null) {
  const t = tables.find((x) => x.name === m[1]);
  if (t) {
    t.indexes.push(
      m[0].replace(`ALTER TABLE \`${m[1]}\` `, '').replace(';', ''),
    );
  }
}

function isNullable(def) {
  if (/\bNOT NULL\b/.test(def) && !/\bDEFAULT NULL\b/.test(def)) {
    return false;
  }
  return true;
}

const textTypes = /(?:text|tinytext|mediumtext|longtext|json)/i;
const blobTypes = /(?:blob|tinyblob|mediumblob|longblob)/i;
const enumRe = /enum\(([^)]+)\)/i;
const fileHints =
  /(?:image|file|link|document|report|proposal|photo|avatar|banner_|newsletter_release_file|cheque|tds)/i;

function classify(col, def) {
  const enums = def.match(enumRe);
  return {
    enums: enums ? enums[1] : null,
    isText: textTypes.test(def),
    isBlob: blobTypes.test(def),
    isFile: fileHints.test(col) && /varchar|text/i.test(def),
    comment: (def.match(/COMMENT '([^']*)'/) || [])[1],
  };
}

function logicalFkTarget(col) {
  const map = {
    vendor_id: 'vendors',
    category_id: 'categories',
    manufacturer_id: 'manufacturers',
    product_id: 'products',
    payment_id: 'payment_details',
    online_payment_id: 'online_payment_details',
    process_manufacturing_id: 'process_manufacturing',
    user_id: 'admin / vendor_users (context-dependent)',
    form_primary_id: 'parent form row (polymorphic)',
  };
  if (map[col]) return map[col];
  if (/_id$/.test(col)) return col.replace(/_id$/, 's');
  return null;
}

let md = '# GreenPro Legacy MySQL Database Inventory\n\n';
md += '**Database:** `greenpro`\n';
md += '**Source:** phpMyAdmin SQL dump (schema only)\n';
md += '**Server:** MySQL 8.0.46\n';
md += '**Dump generated:** Jul 06, 2026\n\n';
md += '## Summary\n\n';
md += '| Metric | Value |\n|--------|-------|\n';
md += `| Total tables | ${tables.length} |\n`;
md +=
  '| Row data in dump | **None** — structure-only export; row counts not available |\n';
md +=
  '| Declared FOREIGN KEY constraints | **None** in this dump |\n';
md +=
  '| Relationships | Logical via `vendor_id`, `urn_no`, `manufacturer_id`, `product_id`, etc. |\n\n';

md += '## Table Index\n\n';
tables.forEach((t, i) => {
  md += `${i + 1}. [\`${t.name}\`](#${t.name.replace(/_/g, '-')})\n`;
});
md += '\n---\n\n';

for (const t of tables) {
  const nullableCols = t.columns.filter((c) => c.nullable).map((c) => c.col);
  const textCols = [];
  const fileCols = [];
  const enumCols = [];
  const blobCols = [];
  for (const c of t.columns) {
    const cl = classify(c.col, c.def);
    if (cl.isText) {
      textCols.push(
        c.col + (cl.comment ? ` /* ${cl.comment} */` : ''),
      );
    }
    if (cl.isBlob) blobCols.push(c.col);
    if (cl.isFile) fileCols.push(c.col);
    if (cl.enums) enumCols.push({ col: c.col, values: cl.enums });
  }

  const logicalFks = t.columns
    .map((c) => {
      const target = logicalFkTarget(c.col);
      if (!target || c.col === t.pk) return null;
      return `${c.col} → \`${target}\` (logical, not enforced)`;
    })
    .filter(Boolean);

  md += `## ${t.name}\n\n`;
  md += '| Property | Details |\n|----------|--------|\n';
  md += `| **Primary key** | \`${t.pk || '—'}\` |\n`;
  md += '| **Row count** | N/A (no INSERT data in dump) |\n';
  md += `| **Column count** | ${t.columns.length} |\n\n`;

  md += '### Foreign keys\n\n';
  if (t.fks.length) {
    t.fks.forEach((f) => {
      md += `- ${f}\n`;
    });
  } else if (logicalFks.length) {
    md += '_No enforced FK constraints. Logical references:_\n\n';
    logicalFks.forEach((f) => {
      md += `- ${f}\n`;
    });
  } else {
    md += '_None identified._\n';
  }
  md += '\n';

  if (t.indexes.length) {
    md += '### Indexes\n\n';
    t.indexes.forEach((ix) => {
      md += `- ${ix.replace(/`/g, '')}\n`;
    });
    md += '\n';
  }

  md += `### Nullable fields (${nullableCols.length})\n\n`;
  if (nullableCols.length) {
    md += `${nullableCols.map((c) => `\`${c}\``).join(', ')}\n\n`;
  } else {
    md += '_None (all NOT NULL)._\n\n';
  }

  md += '### JSON / text fields\n\n';
  if (textCols.length) {
    textCols.forEach((c) => {
      md += `- \`${c.split(' ')[0]}\`\n`;
    });
  } else {
    md += '_None._\n';
  }
  md += '\n';

  md += '### Blob / file path fields\n\n';
  const allFiles = [...new Set([...fileCols, ...blobCols])];
  if (allFiles.length) {
    allFiles.forEach((c) => {
      md += `- \`${c}\`\n`;
    });
  } else {
    md += '_None._\n';
  }
  md += '\n';

  md += '### Enum / coded values\n\n';
  if (enumCols.length) {
    enumCols.forEach((e) => {
      md += `- **\`${e.col}\`:** ${e.values}\n`;
    });
  }
  const statusCols = t.columns.filter(
    (c) =>
      /status|role|access|notify_type|seen/i.test(c.col) &&
      c.def.includes('COMMENT'),
  );
  statusCols.forEach((c) => {
    const comment = (c.def.match(/COMMENT '([^']*)'/) || [])[1];
    if (comment) {
      md += `- **\`${c.col}\`:** ${comment}\n`;
    }
  });
  if (!enumCols.length && !statusCols.length) {
    md += '_No MySQL ENUM columns; no status COMMENT fields._\n';
  }

  md += '\n### Columns\n\n';
  md += '| Column | Type | Nullable |\n|--------|------|----------|\n';
  t.columns.forEach((c) => {
    const type = c.def
      .replace(/\s+NOT NULL.*/, '')
      .replace(/\s+DEFAULT.*/, '')
      .replace(/\s+COMMENT.*/, '')
      .replace(/,$/, '')
      .trim();
    md += `| \`${c.col}\` | ${type} | ${c.nullable ? 'YES' : 'NO'} |\n`;
  });
  md += '\n---\n\n';
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, md);
console.log(`Wrote ${outPath}`);
console.log(`Tables: ${tables.length}, Size: ${md.length} chars`);

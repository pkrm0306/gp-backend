const { MongoClient } = require('mongodb');

(async () => {
  const urn = process.argv[2] || 'URN-20260909131058';
  const apply = process.argv.includes('--apply');
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const streams = await db
    .collection('doc_streams')
    .find({ urnNo: urn })
    .project({
      sectionKey: 1,
      slotKey: 1,
      subsectionKey: 1,
      processType: 1,
      latestVersionNo: 1,
      isDeleted: 1,
      currentVersionId: 1,
    })
    .toArray();

  console.log(`URN ${urn}: ${streams.length} stream(s). mode=${apply ? 'APPLY' : 'dry-run'}`);

  const BATCH_MS = 60_000; // versions created within 60s = same upload batch

  for (const stream of streams) {
    const versions = await db
      .collection('doc_versions')
      .find({ streamId: stream._id })
      .sort({ versionNo: 1, createdAt: 1 })
      .toArray();

    console.log(
      `\n[${stream.sectionKey}/${stream.slotKey}] latestVersionNo=${stream.latestVersionNo} rows=${versions.length}`,
    );
    for (const v of versions) {
      console.log(
        `  v${v.versionNo} ${v.action} pid=${v.productDocumentId} ${v.originalName || ''} @ ${v.createdAt}`,
      );
    }

    if (versions.length <= 1) continue;

    // Keep first version of each time-cluster; drop the rest (per-file bump artifact).
    const keep = [];
    let clusterStart = null;
    for (const v of versions) {
      const t = new Date(v.createdAt || 0).getTime();
      if (clusterStart == null || t - clusterStart > BATCH_MS) {
        keep.push(v);
        clusterStart = t;
      } else {
        console.log(`  drop duplicate batch stamp v${v.versionNo} (${v.originalName})`);
      }
    }

    if (keep.length === versions.length) {
      console.log('  no batch duplicates to compact');
    } else {
      console.log(`  compact ${versions.length} -> ${keep.length} version(s)`);
      if (apply) {
        const dropIds = versions
          .filter((v) => !keep.some((k) => String(k._id) === String(v._id)))
          .map((v) => v._id);
        if (dropIds.length) {
          await db.collection('doc_versions').deleteMany({ _id: { $in: dropIds } });
        }
        // Renumber kept versions 1..n by createdAt
        keep.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() ||
            a.versionNo - b.versionNo,
        );
        for (let i = 0; i < keep.length; i += 1) {
          const versionNo = i + 1;
          const isLatest = i === keep.length - 1;
          await db.collection('doc_versions').updateOne(
            { _id: keep[i]._id },
            { $set: { versionNo, isLatest } },
          );
        }
        const latest = keep[keep.length - 1];
        await db.collection('doc_streams').updateOne(
          { _id: stream._id },
          {
            $set: {
              latestVersionNo: keep.length,
              currentVersionId: latest._id,
              isDeleted: false,
            },
          },
        );
        console.log(`  stream latestVersionNo -> ${keep.length}`);
      }
    }

    // Soft-delete live product docs superseded by older version productDocumentIds
    const sorted = [...versions].sort((a, b) => a.versionNo - b.versionNo);
    const latestNo = sorted[sorted.length - 1]?.versionNo ?? 0;
    const supersededPids = new Set();
    for (const v of sorted) {
      if (v.versionNo < latestNo && v.productDocumentId) {
        supersededPids.add(Number(v.productDocumentId));
      }
    }
    // After compact, recompute from keep if applying conceptually
    const effective = apply && keep.length ? keep : versions;
    const effSorted = [...effective].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() ||
        a.versionNo - b.versionNo,
    );
    const effLatest = effSorted[effSorted.length - 1];
    const superseded = new Set();
    for (const v of effSorted) {
      if (String(v._id) === String(effLatest?._id)) continue;
      const pid = Number(v.productDocumentId);
      if (Number.isFinite(pid) && pid > 0) superseded.add(pid);
    }

    if (superseded.size) {
      const live = await db
        .collection('all_product_documents')
        .find({
          urnNo: urn,
          productDocumentId: { $in: [...superseded] },
          isDeleted: { $ne: true },
        })
        .project({ productDocumentId: 1, documentOriginalName: 1, documentFormSubsection: 1 })
        .toArray();
      if (live.length) {
        console.log(
          `  soft-delete live superseded pids: ${live.map((d) => d.productDocumentId).join(', ')}`,
        );
        if (apply) {
          const now = new Date();
          await db.collection('all_product_documents').updateMany(
            {
              urnNo: urn,
              productDocumentId: { $in: live.map((d) => d.productDocumentId) },
              isDeleted: { $ne: true },
            },
            { $set: { isDeleted: true, deletedAt: now, updatedDate: now } },
          );
        }
      }
    }
  }

  const liveLeft = await db
    .collection('all_product_documents')
    .find({
      urnNo: urn,
      isDeleted: { $ne: true },
      documentForm: { $in: ['product_design', 'product_performance'] },
    })
    .project({
      productDocumentId: 1,
      documentForm: 1,
      documentFormSubsection: 1,
      documentOriginalName: 1,
    })
    .toArray();
  console.log('\nLIVE DOCS AFTER:', JSON.stringify(liveLeft, null, 2));

  await client.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

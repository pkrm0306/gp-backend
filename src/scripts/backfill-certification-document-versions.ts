import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import { DocStream, DocStreamDocument } from '../documents/schemas/doc-stream.schema';
import {
  certificationSlotKey,
  certificationSlotKeyModeForSection,
} from '../documents/helpers/certification-document-version.util';
import { slotKeyFromSubsection } from '../documents/helpers/document-version.helper';

const TARGET_SECTIONS = [
  DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
  DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
  DocumentSectionKey.PROCESS_MANUFACTURING,
  DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
] as const;

type DocRow = {
  _id: AllProductDocumentDocument['_id'];
  vendorId: AllProductDocumentDocument['vendorId'];
  urnNo: string;
  documentForm: string;
  documentFormSubsection?: string | null;
  productDocumentId: number;
  documentLink?: string | null;
  documentName?: string | null;
  documentOriginalName?: string | null;
  createdDate?: Date;
};

async function run() {
  const dryRun = String(process.env.DRY_RUN ?? 'true').toLowerCase() === 'true';
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const allProductDocumentModel = app.get<Model<AllProductDocumentDocument>>(
    getModelToken(AllProductDocument.name),
  );
  const docStreamModel = app.get<Model<DocStreamDocument>>(
    getModelToken(DocStream.name),
  );
  const versioning = app.get(DocumentVersioningService);

  let scanned = 0;
  let created = 0;
  let skippedExisting = 0;

  try {
    const docs = (await allProductDocumentModel
      .find({
        documentForm: { $in: [...TARGET_SECTIONS] },
        isDeleted: { $ne: true },
      })
      .sort({ createdDate: 1, productDocumentId: 1 })
      .lean()
      .exec()) as DocRow[];

    const groups = new Map<string, DocRow[]>();
    for (const doc of docs) {
      scanned += 1;
      const sectionKey = String(doc.documentForm ?? '').trim();
      const slotKey =
        certificationSlotKeyModeForSection(sectionKey) === 'subsectionTag'
          ? certificationSlotKey(
              sectionKey,
              doc.documentFormSubsection,
              (doc as { documentTag?: string }).documentTag,
            )
          : slotKeyFromSubsection(doc.documentFormSubsection);
      const key = `${doc.urnNo}|initial|${sectionKey}|${doc.documentFormSubsection ?? ''}|${slotKey}`;
      const bucket = groups.get(key) ?? [];
      bucket.push(doc);
      groups.set(key, bucket);
    }

    for (const [, group] of groups) {
      const liveDoc = group[group.length - 1];
      const sectionKey = String(liveDoc.documentForm);
      const subsectionKey = liveDoc.documentFormSubsection ?? null;
      const slotKey = slotKeyFromSubsection(subsectionKey);

      const existing = await docStreamModel
        .findOne({
          urnNo: liveDoc.urnNo,
          processType: 'initial',
          renewalCycleId: null,
          sectionKey,
          subsectionKey,
          slotKey,
        })
        .lean()
        .exec();

      if (existing) {
        skippedExisting += 1;
        continue;
      }

      if (dryRun) {
        created += 1;
        continue;
      }

      await versioning.trackAllProductDocument({
        urnNo: liveDoc.urnNo,
        sectionKey,
        subsectionKey,
        slotKey,
        action: 'added',
        documentId: liveDoc._id,
        productDocumentId: liveDoc.productDocumentId,
        filePath: liveDoc.documentLink ?? null,
        originalName: liveDoc.documentOriginalName ?? null,
        storedName: liveDoc.documentName ?? null,
        userId: liveDoc.vendorId,
        processType: 'initial',
      });
      created += 1;
    }

    console.log(
      JSON.stringify(
        {
          dryRun,
          scannedDocuments: scanned,
          slotGroups: groups.size,
          streamsCreated: created,
          skippedExistingStreams: skippedExisting,
          sections: TARGET_SECTIONS,
        },
        null,
        2,
      ),
    );
  } finally {
    await app.close();
  }
}

run().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});

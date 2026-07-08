/**
 * One-time migration for summit CMS tab shapes.
 *
 * Usage (from project root):
 *   pnpm exec ts-node -r tsconfig-paths/register scripts/migrate-summit-cms-sections.ts
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Summit, SummitDocument } from '../src/summits/schemas/summit.schema';
import {
  mapAgendaFromDoc,
  mapEventOutcomesFromDoc,
  mapFocusedAreasFromDoc,
  mapHighlightsFromDoc,
} from '../src/summits/utils/summit-cms-sections.util';

async function migrateSummit(doc: SummitDocument): Promise<boolean> {
  let changed = false;

  const highlights = mapHighlightsFromDoc(doc);
  if (JSON.stringify(doc.highlights ?? []) !== JSON.stringify(highlights)) {
    doc.highlights = highlights as SummitDocument['highlights'];
    changed = true;
  }

  const focusedAreas = mapFocusedAreasFromDoc(doc);
  if (
    JSON.stringify(doc.focusedAreas ?? []) !== JSON.stringify(focusedAreas) ||
    (doc.areaPoints ?? []).length > 0
  ) {
    doc.focusedAreas = focusedAreas as SummitDocument['focusedAreas'];
    doc.areaPoints = [];
    changed = true;
  }

  const eventOutcomes = mapEventOutcomesFromDoc(doc);
  if (JSON.stringify(doc.eventOutcomes ?? []) !== JSON.stringify(eventOutcomes)) {
    doc.eventOutcomes = eventOutcomes as SummitDocument['eventOutcomes'];
    changed = true;
  }

  const agenda = mapAgendaFromDoc(doc);
  if (
    (doc.agendaPoints ?? []).length === 0 &&
    agenda.points.length > 0
  ) {
    doc.agendaTitle = agenda.title;
    doc.agendaPoints = agenda.points as SummitDocument['agendaPoints'];
    doc.agenda = { title: agenda.title, content: '' };
    changed = true;
  }

  if (changed) {
    await doc.save();
  }
  return changed;
}

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const summitModel = app.get<Model<SummitDocument>>(getModelToken(Summit.name));
    const docs = await summitModel.find({ deletedAt: null }).exec();
    let migrated = 0;

    for (const doc of docs) {
      if (await migrateSummit(doc)) {
        migrated += 1;
        console.log(`Migrated summit ${doc._id.toString()} (${doc.title})`);
      }
    }

    console.log(`Done. Migrated ${migrated} of ${docs.length} summits.`);
  } finally {
    await app.close();
  }
}

void main();

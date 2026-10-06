import { Types } from 'mongoose';
import {
  partitionLcaLiveDocsBySubsection,
  LCA_ASSESSMENT_SUBSECTION,
  LCA_IMPLEMENTATION_SUBSECTION,
} from './process-life-cycle-approach.service';
import {
  resolveDesiredDocumentIdRefs,
  softDeleteUnkeptCertificationDocuments,
} from '../documents/helpers/desired-document-state.apply';
import { partitionLiveDocumentsForDesiredState } from '../documents/helpers/desired-document-state.sync';

describe('LCA DesiredState partition + isolation', () => {
  const id = (hex: string) => new Types.ObjectId(hex.padEnd(24, '0'));

  it('partitions assessment vs implementation (incl. typo + legacy empty)', () => {
    const live = [
      {
        _id: id('aa01'),
        productDocumentId: 1,
        documentFormSubsection: LCA_ASSESSMENT_SUBSECTION,
      },
      {
        _id: id('aa02'),
        productDocumentId: 2,
        documentFormSubsection: 'life_cycle_assessment_reports',
      },
      {
        _id: id('aa03'),
        productDocumentId: 3,
        documentFormSubsection: '',
      },
      {
        _id: id('bb01'),
        productDocumentId: 10,
        documentFormSubsection: LCA_IMPLEMENTATION_SUBSECTION,
      },
      {
        _id: id('cc01'),
        productDocumentId: 99,
        documentFormSubsection: 'unknown_subsection',
      },
    ];
    const part = partitionLcaLiveDocsBySubsection(live);
    expect(part.assessment.map((d) => d.productDocumentId)).toEqual([1, 2, 3]);
    expect(part.implementation.map((d) => d.productDocumentId)).toEqual([10]);
    expect(part.other.map((d) => d.productDocumentId)).toEqual([99]);
  });

  it('empty Assessment keep → 0 retained Assessment; Implementation keep intact', async () => {
    const assessmentLive = [
      {
        _id: id('aa01'),
        productDocumentId: 1,
        documentFormSubsection: LCA_ASSESSMENT_SUBSECTION,
        documentLink: 'a.pdf',
      },
      {
        _id: id('aa02'),
        productDocumentId: 2,
        documentFormSubsection: LCA_ASSESSMENT_SUBSECTION,
        documentLink: 'b.pdf',
      },
    ];
    const implementationLive = [
      {
        _id: id('bb01'),
        productDocumentId: 10,
        documentFormSubsection: LCA_IMPLEMENTATION_SUBSECTION,
        documentLink: 'c.pdf',
      },
    ];

    const updateMany = jest.fn().mockResolvedValue({ acknowledged: true });
    const documentModel = { updateMany } as any;
    const versioning = {
      trackAllProductDocument: jest.fn().mockResolvedValue(undefined),
    } as any;

    const assessmentSync = await softDeleteUnkeptCertificationDocuments({
      documentModel,
      versioning,
      urnNo: 'URN-LCA',
      sectionKey: 'process_life_cycle_approach',
      vendorObjectId: id('dd01'),
      now: new Date(),
      liveDocs: assessmentLive as any,
      keepRefs: resolveDesiredDocumentIdRefs([]),
    });
    const implementationSync = await softDeleteUnkeptCertificationDocuments({
      documentModel,
      versioning,
      urnNo: 'URN-LCA',
      sectionKey: 'process_life_cycle_approach',
      vendorObjectId: id('dd01'),
      now: new Date(),
      liveDocs: implementationLive as any,
      keepRefs: resolveDesiredDocumentIdRefs(['10']),
    });

    expect(assessmentSync.retainIds).toHaveLength(0);
    expect(assessmentSync.removeIds).toHaveLength(2);
    expect(implementationSync.retainIds).toHaveLength(1);
    expect(implementationSync.removeIds).toHaveLength(0);
  });

  it('20→26 style: Assessment keep 20 + 6 new chunk isolation from Implementation', () => {
    const assessmentKeep = Array.from({ length: 20 }, (_, i) => i + 1);
    const implementationKeep = [901, 902];
    const assessmentLive = assessmentKeep.map((pid) => ({
      _id: id(`a${pid.toString(16).padStart(4, '0')}`),
      productDocumentId: pid,
      documentFormSubsection: LCA_ASSESSMENT_SUBSECTION,
    }));
    const implementationLive = implementationKeep.map((pid) => ({
      _id: id(`b${pid.toString(16).padStart(4, '0')}`),
      productDocumentId: pid,
      documentFormSubsection: LCA_IMPLEMENTATION_SUBSECTION,
    }));

    const assessmentPart = partitionLiveDocumentsForDesiredState(
      assessmentLive,
      resolveDesiredDocumentIdRefs(assessmentKeep.map(String)),
    );
    const implementationPart = partitionLiveDocumentsForDesiredState(
      implementationLive,
      resolveDesiredDocumentIdRefs(implementationKeep.map(String)),
    );

    expect(assessmentPart.retain).toHaveLength(20);
    expect(assessmentPart.remove).toHaveLength(0);
    expect(implementationPart.retain).toHaveLength(2);
    // New uploads append after sync; final Assessment count = 20 keep + 6 new = 26
    expect(assessmentPart.retain.length + 6).toBe(26);
  });
});

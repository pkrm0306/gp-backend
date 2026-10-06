import { Types } from 'mongoose';
import {
  resolveDesiredDocumentIdRefs,
  softDeleteUnkeptCertificationDocuments,
} from './desired-document-state.apply';
import { partitionLiveDocumentsForDesiredState } from './desired-document-state.sync';

describe('desired-document-state.apply (Phase 2A shared)', () => {
  const id = (hex: string) => new Types.ObjectId(hex.padEnd(24, '0'));

  it('resolveDesiredDocumentIdRefs parses productDocumentIds', () => {
    const refs = resolveDesiredDocumentIdRefs(['10', '11', 'not-a-number']);
    expect(refs.productDocumentIds).toEqual([10, 11]);
  });

  it('Manufacturing DesiredState: keep 18 of 20 → remove 2', () => {
    const live = Array.from({ length: 20 }, (_, i) => ({
      _id: id(String(i + 1)),
      productDocumentId: i + 1,
      documentFormSubsection: 'energy_conservation_supporting_documents',
    }));
    const keep = live.slice(0, 18).map((d) => d.productDocumentId);
    const part = partitionLiveDocumentsForDesiredState(
      live,
      resolveDesiredDocumentIdRefs(keep.map(String)),
    );
    expect(part.retain).toHaveLength(18);
    expect(part.remove).toHaveLength(2);
  });

  it('Waste DesiredState: keep [] → remove all (empty UI save)', () => {
    const live = Array.from({ length: 5 }, (_, i) => ({
      _id: id(String(i + 1)),
      productDocumentId: i + 1,
      documentFormSubsection: 'wm_supporting_documents',
    }));
    const part = partitionLiveDocumentsForDesiredState(
      live,
      resolveDesiredDocumentIdRefs([]),
    );
    expect(part.retain).toHaveLength(0);
    expect(part.remove).toHaveLength(5);
  });

  it('Manufacturing keep does not affect Waste live docs (isolation contract)', () => {
    const mpLive = [
      { _id: id('aaaa1111'), productDocumentId: 1 },
      { _id: id('aaaa2222'), productDocumentId: 2 },
    ];
    const wmLive = [
      { _id: id('bbbb1111'), productDocumentId: 10 },
      { _id: id('bbbb2222'), productDocumentId: 11 },
    ];
    const mpPart = partitionLiveDocumentsForDesiredState(
      mpLive,
      resolveDesiredDocumentIdRefs(['1']),
    );
    const wmPart = partitionLiveDocumentsForDesiredState(wmLive, null);
    expect(mpPart.retain.map((d) => d.productDocumentId)).toEqual([1]);
    expect(wmPart.retain).toHaveLength(2);
  });

  it('softDeleteUnkeptCertificationDocuments soft-deletes unkept and tracks version', async () => {
    const live = [
      { _id: id('cccc1111'), productDocumentId: 1, documentLink: 'a.pdf' },
      { _id: id('cccc2222'), productDocumentId: 2, documentLink: 'b.pdf' },
    ];
    const updateMany = jest.fn().mockResolvedValue({ acknowledged: true });
    const documentModel = { updateMany } as any;
    const trackAllProductDocument = jest.fn().mockResolvedValue(undefined);
    const versioning = { trackAllProductDocument } as any;

    const result = await softDeleteUnkeptCertificationDocuments({
      documentModel,
      versioning,
      urnNo: 'URN-1',
      sectionKey: 'process_manufacturing',
      vendorObjectId: id('dddd1111'),
      now: new Date(),
      session: {} as any,
      liveDocs: live as any,
      keepRefs: resolveDesiredDocumentIdRefs(['1']),
    });

    expect(result.removeIds).toHaveLength(1);
    expect(result.retainIds).toHaveLength(1);
    expect(result.oldFileLinks).toEqual(['b.pdf']);
    expect(updateMany).toHaveBeenCalled();
  });

  it('Regional materials DesiredState: keep 2 of 3 → remove 1', () => {
    const live = [
      {
        _id: id('aa01'),
        productDocumentId: 101,
        documentFormSubsection: 'supporting_documents',
      },
      {
        _id: id('aa02'),
        productDocumentId: 102,
        documentFormSubsection: 'supporting_documents',
      },
      {
        _id: id('aa03'),
        productDocumentId: 103,
        documentFormSubsection: 'supporting_documents',
      },
    ];
    const part = partitionLiveDocumentsForDesiredState(
      live,
      resolveDesiredDocumentIdRefs(['101', '102']),
    );
    expect(part.retain.map((d) => d.productDocumentId)).toEqual([101, 102]);
    expect(part.remove.map((d) => d.productDocumentId)).toEqual([103]);
  });

  it('FileInterceptor-style green-supply: omit keep → retain all; keep [] → remove all', () => {
    const live = [
      {
        _id: id('bb01'),
        productDocumentId: 201,
        documentFormSubsection: 'supporting_documents',
        documentLink: 'gs-a.pdf',
      },
      {
        _id: id('bb02'),
        productDocumentId: 202,
        documentFormSubsection: 'supporting_documents',
        documentLink: 'gs-b.pdf',
      },
    ];
    const omitKeep = partitionLiveDocumentsForDesiredState(live, null);
    expect(omitKeep.retain).toHaveLength(2);
    expect(omitKeep.remove).toHaveLength(0);

    const emptyKeep = partitionLiveDocumentsForDesiredState(
      live,
      resolveDesiredDocumentIdRefs([]),
    );
    expect(emptyKeep.retain).toHaveLength(0);
    expect(emptyKeep.remove).toHaveLength(2);
    expect(emptyKeep.oldFileLinks).toEqual(['gs-a.pdf', 'gs-b.pdf']);
  });

  it('RMC subsection DesiredState: step_15_1 keep does not remove step_15_2', () => {
    const step151 = [
      {
        _id: id('cc01'),
        productDocumentId: 301,
        documentFormSubsection: 'step_15_1_supporting_document',
      },
    ];
    const step152 = [
      {
        _id: id('cc02'),
        productDocumentId: 302,
        documentFormSubsection: 'step_15_2_supporting_document',
      },
    ];
    const part151 = partitionLiveDocumentsForDesiredState(
      step151,
      resolveDesiredDocumentIdRefs([]),
    );
    const part152 = partitionLiveDocumentsForDesiredState(step152, null);
    expect(part151.remove).toHaveLength(1);
    expect(part152.retain).toHaveLength(1);
  });

  it('Innovation DesiredState: keep 18 of 20 → remove 2 (innovation_implementation_documents)', () => {
    const live = Array.from({ length: 20 }, (_, i) => ({
      _id: id(String(i + 1)),
      productDocumentId: i + 1,
      documentFormSubsection: 'innovation_implementation_documents',
    }));
    const keep = live.slice(0, 18).map((d) => d.productDocumentId);
    const part = partitionLiveDocumentsForDesiredState(
      live,
      resolveDesiredDocumentIdRefs(keep.map(String)),
    );
    expect(part.retain).toHaveLength(18);
    expect(part.remove).toHaveLength(2);
  });

  it('Innovation DesiredState: keep [] → remove all', () => {
    const live = Array.from({ length: 4 }, (_, i) => ({
      _id: id(String(i + 1)),
      productDocumentId: i + 1,
      documentFormSubsection: 'innovation_implementation_documents',
    }));
    const part = partitionLiveDocumentsForDesiredState(
      live,
      resolveDesiredDocumentIdRefs([]),
    );
    expect(part.retain).toHaveLength(0);
    expect(part.remove).toHaveLength(4);
  });

  it('Innovation keep does not affect Manufacturing live docs (isolation)', () => {
    const innovLive = [
      { _id: id('eeee1111'), productDocumentId: 50 },
      { _id: id('eeee2222'), productDocumentId: 51 },
    ];
    const mpLive = [
      { _id: id('ffff1111'), productDocumentId: 1 },
      { _id: id('ffff2222'), productDocumentId: 2 },
    ];
    const innovPart = partitionLiveDocumentsForDesiredState(
      innovLive,
      resolveDesiredDocumentIdRefs(['50']),
    );
    const mpPart = partitionLiveDocumentsForDesiredState(mpLive, null);
    expect(innovPart.retain.map((d) => d.productDocumentId)).toEqual([50]);
    expect(innovPart.remove).toHaveLength(1);
    expect(mpPart.retain).toHaveLength(2);
  });

  it('LCA Assessment DesiredState: keep [] → remove assessment only; Implementation untouched', () => {
    const assessmentLive = [
      {
        _id: id('aaaa0101'),
        productDocumentId: 401,
        documentFormSubsection: 'life_cycle_assesment_reports',
      },
      {
        _id: id('aaaa0202'),
        productDocumentId: 402,
        documentFormSubsection: 'life_cycle_assesment_reports',
      },
    ];
    const implementationLive = [
      {
        _id: id('bbbb0101'),
        productDocumentId: 501,
        documentFormSubsection: 'life_cycle_implementation_documents',
      },
    ];
    const assessmentPart = partitionLiveDocumentsForDesiredState(
      assessmentLive,
      resolveDesiredDocumentIdRefs([]),
    );
    const implementationPart = partitionLiveDocumentsForDesiredState(
      implementationLive,
      null,
    );
    expect(assessmentPart.retain).toHaveLength(0);
    expect(assessmentPart.remove).toHaveLength(2);
    expect(implementationPart.retain).toHaveLength(1);
    expect(implementationPart.remove).toHaveLength(0);
  });

  it('LCA Implementation DesiredState: keep 1 of 2 → remove 1; Assessment keep independent', () => {
    const assessmentLive = [
      {
        _id: id('aaaa1111'),
        productDocumentId: 411,
        documentFormSubsection: 'life_cycle_assesment_reports',
      },
    ];
    const implementationLive = [
      {
        _id: id('bbbb1111'),
        productDocumentId: 511,
        documentFormSubsection: 'life_cycle_implementation_documents',
      },
      {
        _id: id('bbbb1212'),
        productDocumentId: 512,
        documentFormSubsection: 'life_cycle_implementation_documents',
      },
    ];
    const assessmentPart = partitionLiveDocumentsForDesiredState(
      assessmentLive,
      resolveDesiredDocumentIdRefs(['411']),
    );
    const implementationPart = partitionLiveDocumentsForDesiredState(
      implementationLive,
      resolveDesiredDocumentIdRefs(['511']),
    );
    expect(assessmentPart.retain.map((d) => d.productDocumentId)).toEqual([411]);
    expect(implementationPart.retain.map((d) => d.productDocumentId)).toEqual([
      511,
    ]);
    expect(implementationPart.remove.map((d) => d.productDocumentId)).toEqual([
      512,
    ]);
  });

  it('Product Stewardship SEA DesiredState does not remove QM/EPR docs', () => {
    const seaLive = [
      { _id: id('aa01'), productDocumentId: 101, documentFormSubsection: 'sea_supporting_documents' },
      { _id: id('aa02'), productDocumentId: 102, documentFormSubsection: 'sea_supporting_documents' },
    ];
    const qmLive = [
      { _id: id('bb01'), productDocumentId: 201, documentFormSubsection: 'qm_supporting_documents' },
    ];
    const eprLive = [
      { _id: id('cc01'), productDocumentId: 301, documentFormSubsection: 'epr_supporting_documents' },
    ];
    const seaPart = partitionLiveDocumentsForDesiredState(
      seaLive,
      resolveDesiredDocumentIdRefs(['101']),
    );
    const qmPart = partitionLiveDocumentsForDesiredState(qmLive, null);
    const eprPart = partitionLiveDocumentsForDesiredState(eprLive, null);
    expect(seaPart.retain.map((d) => d.productDocumentId)).toEqual([101]);
    expect(seaPart.remove).toHaveLength(1);
    expect(qmPart.retain).toHaveLength(1);
    expect(eprPart.retain).toHaveLength(1);
  });

  it('Product Stewardship QM DesiredState does not remove SEA/EPR docs', () => {
    const seaLive = [
      { _id: id('aa11'), productDocumentId: 111, documentFormSubsection: 'sea_supporting_documents' },
    ];
    const qmLive = [
      { _id: id('bb11'), productDocumentId: 211, documentFormSubsection: 'qm_supporting_documents' },
      { _id: id('bb12'), productDocumentId: 212, documentFormSubsection: 'qm_supporting_documents' },
    ];
    const eprLive = [
      { _id: id('cc11'), productDocumentId: 311, documentFormSubsection: 'epr_supporting_documents' },
    ];
    const seaPart = partitionLiveDocumentsForDesiredState(seaLive, null);
    const qmPart = partitionLiveDocumentsForDesiredState(
      qmLive,
      resolveDesiredDocumentIdRefs(['211']),
    );
    const eprPart = partitionLiveDocumentsForDesiredState(eprLive, null);
    expect(seaPart.retain).toHaveLength(1);
    expect(qmPart.retain.map((d) => d.productDocumentId)).toEqual([211]);
    expect(qmPart.remove).toHaveLength(1);
    expect(eprPart.retain).toHaveLength(1);
  });

  it('Product Stewardship EPR DesiredState does not remove SEA/QM docs', () => {
    const seaLive = [
      { _id: id('aa21'), productDocumentId: 121, documentFormSubsection: 'sea_supporting_documents' },
    ];
    const qmLive = [
      { _id: id('bb21'), productDocumentId: 221, documentFormSubsection: 'qm_supporting_documents' },
    ];
    const eprLive = [
      { _id: id('cc21'), productDocumentId: 321, documentFormSubsection: 'epr_supporting_documents' },
      { _id: id('cc22'), productDocumentId: 322, documentFormSubsection: 'epr_supporting_documents' },
    ];
    const seaPart = partitionLiveDocumentsForDesiredState(seaLive, null);
    const qmPart = partitionLiveDocumentsForDesiredState(qmLive, null);
    const eprPart = partitionLiveDocumentsForDesiredState(
      eprLive,
      resolveDesiredDocumentIdRefs(['321']),
    );
    expect(seaPart.retain).toHaveLength(1);
    expect(qmPart.retain).toHaveLength(1);
    expect(eprPart.retain.map((d) => d.productDocumentId)).toEqual([321]);
    expect(eprPart.remove).toHaveLength(1);
  });

  it('Product Stewardship empty slot keep [] clears only that subsection', () => {
    const seaLive = [
      { _id: id('aa31'), productDocumentId: 131, documentFormSubsection: 'sea_supporting_documents' },
    ];
    const qmLive = [
      { _id: id('bb31'), productDocumentId: 231, documentFormSubsection: 'qm_supporting_documents' },
      { _id: id('bb32'), productDocumentId: 232, documentFormSubsection: 'qm_supporting_documents' },
    ];
    const eprLive = [
      { _id: id('cc31'), productDocumentId: 331, documentFormSubsection: 'epr_supporting_documents' },
    ];
    const seaPart = partitionLiveDocumentsForDesiredState(
      seaLive,
      resolveDesiredDocumentIdRefs([]),
    );
    const qmPart = partitionLiveDocumentsForDesiredState(
      qmLive,
      resolveDesiredDocumentIdRefs(['231', '232']),
    );
    const eprPart = partitionLiveDocumentsForDesiredState(
      eprLive,
      resolveDesiredDocumentIdRefs(['331']),
    );
    expect(seaPart.retain).toHaveLength(0);
    expect(seaPart.remove).toHaveLength(1);
    expect(qmPart.retain).toHaveLength(2);
    expect(eprPart.retain).toHaveLength(1);
  });
});

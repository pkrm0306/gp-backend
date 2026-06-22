import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuditLookupResolver } from './audit-lookup-resolver.service';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { Category } from '../categories/schemas/category.schema';
import { Sector } from '../sectors/schemas/sector.schema';
import { Manufacturer } from '../manufacturers/schemas/manufacturer.schema';
import { Country } from '../countries/schemas/country.schema';
import { State } from '../states/schemas/state.schema';
import { Standard } from '../standards/schemas/standard.schema';
import { Product } from '../product-registration/schemas/product.schema';
import { Role } from '../rbac/schemas/role.schema';
import { VendorUser } from '../vendor-users/schemas/vendor-user.schema';

describe('AuditLookupResolver', () => {
  let resolver: AuditLookupResolver;
  const lookupFindExecMock = jest.fn().mockResolvedValue([]);

  beforeEach(async () => {
    lookupFindExecMock.mockReset();
    lookupFindExecMock.mockResolvedValue([]);
    const lookupModelMock = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: lookupFindExecMock,
        }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLookupResolver,
        AuditStatusResolver,
        { provide: getModelToken(Category.name), useValue: lookupModelMock },
        { provide: getModelToken(Sector.name), useValue: lookupModelMock },
        { provide: getModelToken(Manufacturer.name), useValue: lookupModelMock },
        { provide: getModelToken(Country.name), useValue: lookupModelMock },
        { provide: getModelToken(State.name), useValue: lookupModelMock },
        { provide: getModelToken(Standard.name), useValue: lookupModelMock },
        { provide: getModelToken(Product.name), useValue: lookupModelMock },
        { provide: getModelToken(Role.name), useValue: lookupModelMock },
        { provide: getModelToken(VendorUser.name), useValue: lookupModelMock },
      ],
    }).compile();

    resolver = module.get(AuditLookupResolver);
  });

  it('collects productIds from productsToBeCertified JSON string', async () => {
    lookupFindExecMock.mockResolvedValueOnce([
      { productId: 101, productName: 'Eco Paint' },
      { productId: 102, productName: 'Green Adhesive' },
    ]);

    const valuesByModel = resolver.collectValues([
      { productsToBeCertified: '[101,102]' },
    ]);
    const labels = await resolver.resolveLookupLabels(valuesByModel);

    expect(valuesByModel.get('product')).toEqual(new Set(['101', '102']));
    expect(
      resolver.resolveLabel(labels, 'productsToBeCertified', '[101,102]'),
    ).toBe('Eco Paint, Green Adhesive');
  });

  it('uses deleted-product fallback for unknown ids in productsToBeCertified', async () => {
    lookupFindExecMock.mockResolvedValueOnce([
      { productId: 101, productName: 'Eco Paint' },
    ]);

    const valuesByModel = resolver.collectValues([
      { productsToBeCertified: '[101,999]' },
    ]);
    const labels = await resolver.resolveLookupLabels(valuesByModel);

    expect(
      resolver.resolveLabel(labels, 'productsToBeCertified', '[101,999]'),
    ).toBe('Eco Paint, Deleted product (999)');
  });
});

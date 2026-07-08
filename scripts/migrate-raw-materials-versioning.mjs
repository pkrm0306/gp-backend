import fs from 'fs';
import path from 'path';

const srcRoot = path.resolve('src');
const serviceDirs = fs
  .readdirSync(srcRoot)
  .filter((d) => d.startsWith('raw-materials-'))
  .map((d) => path.join(srcRoot, d));

const importOld = /import \{ trackUploadedProductDocument \} from '\.\.\/documents\/helpers\/product-document-version\.integration';/;
const importOld2 =
  /import \{\s*trackProductDocumentDeleteBatch,\s*trackUploadedProductDocument,\s*\} from '\.\.\/documents\/helpers\/product-document-version\.integration';/;
const importOld3 =
  /import \{\s*trackUploadedProductDocument,\s*trackProductDocumentDeleteBatch,\s*\} from '\.\.\/documents\/helpers\/product-document-version\.integration';/;

const newImports = `import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import { trackCertificationDocumentAfterCreate } from '../documents/helpers/certification-document-version.util';`;

function patchService(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('trackUploadedProductDocument')) return false;

  if (importOld.test(content)) {
    content = content.replace(importOld, newImports);
  } else if (importOld2.test(content)) {
    content = content.replace(
      importOld2,
      `import { trackProductDocumentDeleteBatch } from '../documents/helpers/product-document-version.integration';\n${newImports}`,
    );
  } else if (importOld3.test(content)) {
    content = content.replace(
      importOld3,
      `import { trackProductDocumentDeleteBatch } from '../documents/helpers/product-document-version.integration';\n${newImports}`,
    );
  } else if (content.includes('trackUploadedProductDocument')) {
    content = content.replace(
      /import \{([^}]*trackUploadedProductDocument[^}]*)\} from '\.\.\/documents\/helpers\/product-document-version\.integration';/,
      (m, inner) => {
        const kept = inner
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s && s !== 'trackUploadedProductDocument')
          .join(', ');
        const line = kept
          ? `import { ${kept} } from '../documents/helpers/product-document-version.integration';\n${newImports}`
          : newImports;
        return line;
      },
    );
  }

  if (
    !content.includes('@InjectModel(Product.name)') &&
    content.includes('allProductDocumentModel')
  ) {
    content = content.replace(
      /(@InjectModel\(AllProductDocument\.name\)\s+private allProductDocumentModel:[^\n]+\n)/,
      `$1    @InjectModel(Product.name)\n    private productModel: Model<ProductDocument>,\n`,
    );
  }

  // Remove soft-delete blocks before single file upload (prohibited flame pattern)
  content = content.replace(
    /\s*const existingDocs = await this\.allProductDocumentModel\.find\(\{[\s\S]*?trackProductDocumentDeleteBatch\(\{[\s\S]*?\}\);\s*\}/g,
    '',
  );

  content = content.replace(
    /await trackUploadedProductDocument\(this\.documentVersioningService, \{([\s\S]*?)\}\);/g,
    (match, body) => {
      const urnNo = body.match(/urnNo,?\s*\n/) ? 'urnNo' : body.match(/urnNo:\s*([^,\n]+)/)?.[1]?.trim() || 'urnNo';
      const sectionKey =
        body.match(/sectionKey:\s*DocumentSectionKey\.([A-Z_0-9]+)/)?.[0] ||
        body.match(/sectionKey:\s*\n\s*DocumentSectionKey\.([A-Z_0-9]+)/)?.[0]?.replace(/\n\s*/, ' ') ||
        "sectionKey: DocumentSectionKey.UNKNOWN";
      const sectionExpr = sectionKey.includes('\n')
        ? sectionKey.replace('sectionKey:', 'sectionKey:').replace(/\s+/g, ' ')
        : sectionKey.replace('sectionKey:', 'sectionKey:');
      const fullSection = body.includes('DocumentSectionKey.')
        ? body.match(/sectionKey:[\s\S]*?DocumentSectionKey\.[A-Z_0-9_]+/)?.[0] || 'sectionKey: DocumentSectionKey.UNKNOWN'
        : 'sectionKey: DocumentSectionKey.UNKNOWN';

      const docId =
        body.match(/documentId: (createdDoc|masterDoc|doc|d|inserted\[0\])\._id/)?.[1] || 'createdDoc';
      const fileVar =
        body.match(/file: ([a-zA-Z0-9_]+),/)?.[1] ||
        body.match(/file,\s*\n/)?.[0] ||
        body.match(/file: ([a-zA-Z0-9_]+)/)?.[1] ||
        'file';
      const session = body.includes('session,') ? '\n          session,' : '';

      const sectionLine = body.match(
        /sectionKey:\s*(?:DocumentSectionKey\.[A-Z_0-9_]+|DocumentSectionKey\.[\s\S]*?DocumentSectionKey\.[A-Z_0-9_]+)/,
      )?.[0];
      const sectionValue = sectionLine
        ? sectionLine.replace('sectionKey:', 'sectionKey:').trim()
        : 'sectionKey: DocumentSectionKey.UNKNOWN';

      return `await trackCertificationDocumentAfterCreate({
          productModel: this.productModel,
          versioning: this.documentVersioningService,
          documentModel: this.allProductDocumentModel,
          urnNo,
          ${sectionValue},
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          doc: ${docId},
          file: ${fileVar},${session}
        });`;
    },
  );

  fs.writeFileSync(filePath, content);
  return true;
}

function patchModule(modulePath) {
  if (!fs.existsSync(modulePath)) return false;
  let content = fs.readFileSync(modulePath, 'utf8');
  if (content.includes('Product.name')) return false;
  if (!content.includes('AllProductDocument.name')) return false;
  if (!content.includes("import { ProductRegistrationModule }")) {
    content = content.replace(
      "import { ProductRegistrationModule }",
      "import { Product, ProductSchema } from '../product-registration/schemas/product.schema';\nimport { ProductRegistrationModule }",
    );
  } else if (!content.includes("Product, ProductSchema")) {
    content = content.replace(
      /import \{ ProductRegistrationModule \}/,
      "import { Product, ProductSchema } from '../product-registration/schemas/product.schema';\nimport { ProductRegistrationModule }",
    );
  }
  content = content.replace(
    /(\{ name: AllProductDocument\.name, schema: AllProductDocumentSchema \},?\s*\n)/,
    `$1      { name: Product.name, schema: ProductSchema },\n`,
  );
  fs.writeFileSync(modulePath, content);
  return true;
}

let services = 0;
let modules = 0;
for (const dir of serviceDirs) {
  const serviceFile = fs
    .readdirSync(dir)
    .find((f) => f.endsWith('.service.ts') && !f.endsWith('.spec.ts'));
  if (serviceFile && patchService(path.join(dir, serviceFile))) services++;
  const moduleFile = path.join(dir, `${path.basename(dir)}.module.ts`);
  if (patchModule(moduleFile)) modules++;
}

console.log(`Patched ${services} services, ${modules} modules`);

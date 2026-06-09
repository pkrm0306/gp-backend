import { Global, Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentVersioningService } from './document-versioning.service';
import { DocStream, DocStreamSchema } from './schemas/doc-stream.schema';
import { DocVersion, DocVersionSchema } from './schemas/doc-version.schema';
import { RenewalModule } from '../renew/renewal.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
      { name: DocStream.name, schema: DocStreamSchema },
      { name: DocVersion.name, schema: DocVersionSchema },
    ]),
    PassportModule,
    AuthModule,
    forwardRef(() => RenewalModule),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentVersioningService],
  exports: [DocumentsService, DocumentVersioningService],
})
export class DocumentsModule {}

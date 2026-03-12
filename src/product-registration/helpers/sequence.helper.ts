import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class SequenceHelper {
  constructor(@InjectConnection() private connection: Connection) {}

  async getNextSequenceValue(sequenceName: string): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const result: any = await sequenceCollection.findOneAndUpdate(
        { _id: sequenceName as any },
        { $inc: { sequenceValue: 1 } },
        { upsert: true, returnDocument: 'after' },
      );

      // NOTE: depending on the MongoDB driver version/wrapper, findOneAndUpdate may return:
      // - { value: <doc>, ... }  OR
      // - <doc> directly
      const seqValue = result?.value?.sequenceValue ?? result?.sequenceValue;
      return typeof seqValue === 'number' ? seqValue : 1;
    } catch (error: any) {
      console.error(`Sequence error for ${sequenceName}:`, error);
      throw new Error(`Failed to get next sequence value for ${sequenceName}: ${error.message}`);
    }
  }

  async getProductId(): Promise<number> {
    return this.getNextSequenceValue('product_id');
  }

  async getProductPlantId(): Promise<number> {
    return this.getNextSequenceValue('product_plant_id');
  }

  async getPaymentId(): Promise<number> {
    const sequenceCollection = this.connection.collection('sequences');
    const sequenceName = 'payment_id';
    
    try {
      // First, check if sequence exists
      const existingSequence = await sequenceCollection.findOne({ _id: sequenceName as any });
      
      if (!existingSequence) {
        // Initialize sequence from max existing paymentId
        const paymentCollection = this.connection.collection('payment_details');
        const maxPayment = await paymentCollection
          .findOne({}, { sort: { paymentId: -1 }, projection: { paymentId: 1 } });
        
        const maxPaymentId = maxPayment?.paymentId || 0;
        
        // Initialize sequence to maxPaymentId (next increment will give maxPaymentId + 1)
        await sequenceCollection.insertOne({
          _id: sequenceName as any,
          sequenceValue: maxPaymentId,
        });
      }
      
      // Atomically increment and get next value
      const result: any = await sequenceCollection.findOneAndUpdate(
        { _id: sequenceName as any },
        { $inc: { sequenceValue: 1 } },
        { returnDocument: 'after' }
      );
      
      const nextValue = result?.value?.sequenceValue ?? result?.sequenceValue;
      
      if (!nextValue) {
        throw new Error('Failed to get next payment ID from sequence');
      }
      
      // Double-check: if the generated ID already exists, get max and use max + 1
      const paymentCollection = this.connection.collection('payment_details');
      const existingPayment = await paymentCollection.findOne({ paymentId: nextValue });
      
      if (existingPayment) {
        // ID already exists, get max and return max + 1
        const maxPayment = await paymentCollection
          .findOne({}, { sort: { paymentId: -1 }, projection: { paymentId: 1 } });
        const maxPaymentId = maxPayment?.paymentId || 0;
        
        // Update sequence to maxPaymentId + 1
        await sequenceCollection.updateOne(
          { _id: sequenceName as any },
          { $set: { sequenceValue: maxPaymentId + 1 } }
        );
        
        return maxPaymentId + 1;
      }
      
      return nextValue;
    } catch (error: any) {
      console.error('Payment ID sequence error:', error);
      // Fallback: get max paymentId and return max + 1
      try {
        const paymentCollection = this.connection.collection('payment_details');
        const maxPayment = await paymentCollection
          .findOne({}, { sort: { paymentId: -1 }, projection: { paymentId: 1 } });
        const maxPaymentId = maxPayment?.paymentId || 0;
        console.log(`[Payment ID] Using fallback: maxPaymentId=${maxPaymentId}, returning ${maxPaymentId + 1}`);
        return maxPaymentId + 1;
      } catch (fallbackError: any) {
        console.error('Fallback payment ID generation error:', fallbackError);
        throw new Error(`Failed to get payment ID: ${error.message}`);
      }
    }
  }

  /**
   * Get next product design ID
   * Ensures the sequence is initialized/synced with the max existing productDesignId
   * in `process_product_design` to avoid duplicate key errors.
   */
  async getProductDesignId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'product_design_id';

      // Find max existing productDesignId
      const designCollection = this.connection.collection('process_product_design');
      const maxDesign = await designCollection.findOne(
        {},
        { sort: { productDesignId: -1 }, projection: { productDesignId: 1 } },
      );
      const maxDesignId = maxDesign?.productDesignId || 0;

      // Ensure sequence exists and is at least maxDesignId
      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        {
          $setOnInsert: { sequenceValue: 0 },
          $max: { sequenceValue: maxDesignId },
        },
        { upsert: true },
      );

      // Atomically increment and get next value
      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Product design ID sequence error:', error);
      return this.getNextSequenceValue('product_design_id');
    }
  }

  /**
   * Get next product design measure ID
   * Ensures sequence is synced with max existing productDesignMeasureId in `process_pd_measures`
   */
  async getProductDesignMeasureId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'product_design_measure_id';

      const measuresCollection = this.connection.collection('process_pd_measures');
      const maxRow = await measuresCollection.findOne(
        {},
        {
          sort: { productDesignMeasureId: -1 },
          projection: { productDesignMeasureId: 1 },
        },
      );
      const maxId = maxRow?.productDesignMeasureId || 0;

      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        { $setOnInsert: { sequenceValue: 0 }, $max: { sequenceValue: maxId } },
        { upsert: true },
      );

      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Product design measure ID sequence error:', error);
      return this.getNextSequenceValue('product_design_measure_id');
    }
  }

  /**
   * Get next product document ID
   * Ensures sequence is synced with max existing productDocumentId in `all_product_documents`
   */
  async getProductDocumentId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'product_document_id';

      const docsCollection = this.connection.collection('all_product_documents');
      const maxRow = await docsCollection.findOne(
        {},
        { sort: { productDocumentId: -1 }, projection: { productDocumentId: 1 } },
      );
      const maxId = maxRow?.productDocumentId || 0;

      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        { $setOnInsert: { sequenceValue: 0 }, $max: { sequenceValue: maxId } },
        { upsert: true },
      );

      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Product document ID sequence error:', error);
      return this.getNextSequenceValue('product_document_id');
    }
  }

  /**
   * Get next product performance ID
   * Ensures sequence is synced with max existing processProductPerformanceId in `process_product_performance`
   */
  async getProductPerformanceId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'product_performance_id';

      // Find max existing processProductPerformanceId
      const performanceCollection = this.connection.collection('process_product_performance');
      const maxPerformance = await performanceCollection.findOne(
        {},
        { sort: { processProductPerformanceId: -1 }, projection: { processProductPerformanceId: 1 } },
      );
      const maxPerformanceId = maxPerformance?.processProductPerformanceId || 0;

      // Ensure sequence exists and is at least maxPerformanceId
      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        {
          $setOnInsert: { sequenceValue: 0 },
          $max: { sequenceValue: maxPerformanceId },
        },
        { upsert: true },
      );

      // Atomically increment and get next value
      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Product performance ID sequence error:', error);
      return this.getNextSequenceValue('product_performance_id');
    }
  }

  /**
   * Get next raw materials hazardous products ID
   * Ensures sequence is synced with max existing rawMaterialsHazardousProductsId in `raw_materials_hazardous_products`
   */
  async getRawMaterialsHazardousProductsId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'raw_materials_hazardous_products_id';

      const collection = this.connection.collection('raw_materials_hazardous_products');
      const maxRow = await collection.findOne(
        {},
        {
          sort: { rawMaterialsHazardousProductsId: -1 },
          projection: { rawMaterialsHazardousProductsId: 1 },
        },
      );
      const maxId = maxRow?.rawMaterialsHazardousProductsId || 0;

      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        { $setOnInsert: { sequenceValue: 0 }, $max: { sequenceValue: maxId } },
        { upsert: true },
      );

      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Raw materials hazardous products ID sequence error:', error);
      return this.getNextSequenceValue('raw_materials_hazardous_products_id');
    }
  }

  /**
   * Get next process manufacturing ID
   * Ensures sequence is synced with max existing processManufacturingId in `process_manufacturing`
   */
  async getProcessManufacturingId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'process_manufacturing_id';

      const collection = this.connection.collection('process_manufacturing');
      const maxRow = await collection.findOne(
        {},
        {
          sort: { processManufacturingId: -1 },
          projection: { processManufacturingId: 1 },
        },
      );
      const maxId = maxRow?.processManufacturingId || 0;

      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        { $setOnInsert: { sequenceValue: 0 }, $max: { sequenceValue: maxId } },
        { upsert: true },
      );

      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Process manufacturing ID sequence error:', error);
      return this.getNextSequenceValue('process_manufacturing_id');
    }
  }

  /**
   * Get next process mp manufacturing unit ID
   * Ensures sequence is synced with max existing processMpManufacturingUnitId in `process_mp_manufacturing_units`
   */
  async getProcessMpManufacturingUnitId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'process_mp_manufacturing_unit_id';

      const collection = this.connection.collection('process_mp_manufacturing_units');
      const maxRow = await collection.findOne(
        {},
        {
          sort: { processMpManufacturingUnitId: -1 },
          projection: { processMpManufacturingUnitId: 1 },
        },
      );
      const maxId = maxRow?.processMpManufacturingUnitId || 0;

      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        { $setOnInsert: { sequenceValue: 0 }, $max: { sequenceValue: maxId } },
        { upsert: true },
      );

      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Process MP manufacturing unit ID sequence error:', error);
      return this.getNextSequenceValue('process_mp_manufacturing_unit_id');
    }
  }

  /**
   * Get next process waste management ID
   * Ensures sequence is synced with max existing processWasteManagementId in `process_waste_management`
   */
  async getProcessWasteManagementId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'process_waste_management_id';

      const collection = this.connection.collection('process_waste_management');
      const maxRow = await collection.findOne(
        {},
        {
          sort: { processWasteManagementId: -1 },
          projection: { processWasteManagementId: 1 },
        },
      );
      const maxId = maxRow?.processWasteManagementId || 0;

      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        { $setOnInsert: { sequenceValue: 0 }, $max: { sequenceValue: maxId } },
        { upsert: true },
      );

      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Process waste management ID sequence error:', error);
      return this.getNextSequenceValue('process_waste_management_id');
    }
  }

  /**
   * Get next process WM manufacturing unit ID
   * Ensures sequence is synced with max existing processWmManufacturingUnitId in `process_wm_manufacturing_units`
   */
  async getProcessWmManufacturingUnitId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'process_wm_manufacturing_unit_id';

      const collection = this.connection.collection('process_wm_manufacturing_units');
      const maxRow = await collection.findOne(
        {},
        {
          sort: { processWmManufacturingUnitId: -1 },
          projection: { processWmManufacturingUnitId: 1 },
        },
      );
      const maxId = maxRow?.processWmManufacturingUnitId || 0;

      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        { $setOnInsert: { sequenceValue: 0 }, $max: { sequenceValue: maxId } },
        { upsert: true },
      );

      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Process WM manufacturing unit ID sequence error:', error);
      return this.getNextSequenceValue('process_wm_manufacturing_unit_id');
    }
  }

  /**
   * Get next process life cycle approach ID
   * Ensures sequence is synced with max existing processLifeCycleApproachId in `process_life_cycle_approach`
   */
  async getProcessLifeCycleApproachId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'process_life_cycle_approach_id';

      const collection = this.connection.collection('process_life_cycle_approach');
      const maxRow = await collection.findOne(
        {},
        {
          sort: { processLifeCycleApproachId: -1 },
          projection: { processLifeCycleApproachId: 1 },
        },
      );
      const maxId = maxRow?.processLifeCycleApproachId || 0;

      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        { $setOnInsert: { sequenceValue: 0 }, $max: { sequenceValue: maxId } },
        { upsert: true },
      );

      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Process life cycle approach ID sequence error:', error);
      return this.getNextSequenceValue('process_life_cycle_approach_id');
    }
  }

  /**
   * Get next process product stewardship ID
   * Ensures sequence is synced with max existing processProductStewardshipId in `process_product_stewardship`
   */
  async getProcessProductStewardshipId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'process_product_stewardship_id';

      const collection = this.connection.collection('process_product_stewardship');
      const maxRow = await collection.findOne(
        {},
        {
          sort: { processProductStewardshipId: -1 },
          projection: { processProductStewardshipId: 1 },
        },
      );
      const maxId = maxRow?.processProductStewardshipId || 0;

      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        { $setOnInsert: { sequenceValue: 0 }, $max: { sequenceValue: maxId } },
        { upsert: true },
      );

      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Process product stewardship ID sequence error:', error);
      return this.getNextSequenceValue('process_product_stewardship_id');
    }
  }

  /**
   * Get next process innovation ID
   * Ensures sequence is synced with max existing processInnovationId in `process_innovation`
   */
  async getProcessInnovationId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'process_innovation_id';

      const collection = this.connection.collection('process_innovation');
      const maxRow = await collection.findOne(
        {},
        {
          sort: { processInnovationId: -1 },
          projection: { processInnovationId: 1 },
        },
      );
      const maxId = maxRow?.processInnovationId || 0;

      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        { $setOnInsert: { sequenceValue: 0 }, $max: { sequenceValue: maxId } },
        { upsert: true },
      );

      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Process innovation ID sequence error:', error);
      return this.getNextSequenceValue('process_innovation_id');
    }
  }

  /**
   * Get next process comments ID
   * Ensures sequence is synced with max existing processCommentsId in `process_comments`
   */
  async getProcessCommentsId(): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const sequenceName = 'process_comments_id';

      const collection = this.connection.collection('process_comments');
      const maxRow = await collection.findOne(
        {},
        {
          sort: { processCommentsId: -1 },
          projection: { processCommentsId: 1 },
        },
      );
      const maxId = maxRow?.processCommentsId || 0;

      await sequenceCollection.updateOne(
        { _id: sequenceName as any },
        { $setOnInsert: { sequenceValue: 0 }, $max: { sequenceValue: maxId } },
        { upsert: true },
      );

      return this.getNextSequenceValue(sequenceName);
    } catch (error: any) {
      console.error('Process comments ID sequence error:', error);
      return this.getNextSequenceValue('process_comments_id');
    }
  }
}

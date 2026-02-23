import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class SequenceHelper {
  constructor(@InjectConnection() private connection: Connection) {}

  async getNextSequenceValue(sequenceName: string): Promise<number> {
    try {
      const sequenceCollection = this.connection.collection('sequences');
      const result = await sequenceCollection.findOneAndUpdate(
        { _id: sequenceName as any },
        { $inc: { sequenceValue: 1 } },
        { upsert: true, returnDocument: 'after' },
      );
      return result.value?.sequenceValue || 1;
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
}

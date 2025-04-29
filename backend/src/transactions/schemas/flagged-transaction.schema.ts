import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FlaggedTransaction extends Document {
  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  merchant: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const FlaggedTransactionSchema = SchemaFactory.createForClass(FlaggedTransaction);

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlaggedTransaction } from './schemas/flagged-transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(FlaggedTransaction.name)
    private flaggedTransactionModel: Model<FlaggedTransaction>,
  ) { }

  async getFlaggedTransactionsByUser(userId: string) {
    return this.flaggedTransactionModel.find({ userId }).lean();
  }
}

import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';
import { FlaggedTransaction, FlaggedTransactionSchema } from '../transactions/schemas/flagged-transaction.schema';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService): Promise<typeof mongoose> => {
      const uri = configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/test');
      return await mongoose.connect(uri);
    },
    inject: [ConfigService],
  },
  {
    provide: 'TransactionModel',
    useFactory: (connection: typeof mongoose) => connection.model('Transaction', TransactionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'FlaggedTransactionModel',
    useFactory: (connection: typeof mongoose) => connection.model('FlaggedTransaction', FlaggedTransactionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
import { Module } from '@nestjs/common';
import { ReconcileModule } from './reconcile/reconcile.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ReconcileModule, TransactionsModule, DatabaseModule, ConfigModule],
})
export class AppModule { }

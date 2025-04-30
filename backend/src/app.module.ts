import { Module } from '@nestjs/common';
import { ReconcileModule } from './reconcile/reconcile.module';
import { TransactionsModule } from './transactions/transactions.module';

import { MongooseModule } from '@nestjs/mongoose';
import { databaseProviders } from './database/database.providers';
@Module({
  imports: [ReconcileModule, TransactionsModule, MongooseModule.forRoot('mongodb://localhost/test')],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class AppModule { }

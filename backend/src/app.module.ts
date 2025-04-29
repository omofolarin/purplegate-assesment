import { Module } from '@nestjs/common';
import { ReconcileModule } from './reconcile/reconcile.module';
import { TransactionsModule } from './transactions/transactions.module';
@Module({
  imports: [ReconcileModule, TransactionsModule],
})
export class AppModule { }

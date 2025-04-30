import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { Transaction, TransactionSchema, FlaggedTransaction, FlaggedTransactionSchema } from "../transactions/schemas";
import { databaseProviders } from "src/database/database.providers";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: FlaggedTransaction.name, schema: FlaggedTransactionSchema },
    ]),
    DatabaseModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, ...databaseProviders],
})
export class TransactionsModule { }
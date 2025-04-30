import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { FraudDetectionController } from "./fraud-detection.controller";
import { FraudDetectionService } from "./fraud-detection.service";
import { databaseProviders } from "src/database/database.providers";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [TransactionsController, FraudDetectionController],
  providers: [TransactionsService, FraudDetectionService, ...databaseProviders],
})
export class TransactionsModule { }
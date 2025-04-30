import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { FraudDetectionService } from './fraud-detection.service';
import { Transaction } from './schemas/transaction.schema';

@Controller('fraud')
export class FraudDetectionController {
  constructor(private readonly fraudDetectionService: FraudDetectionService) {}

  @Post('process')
  async processTransaction(@Body() transaction: Transaction) {
    await this.fraudDetectionService.processTransaction(transaction);
    return { success: true, message: 'Transaction processed successfully' };
  }

  @Get('statistics')
  async getStatistics() {
    return this.fraudDetectionService.getStatistics();
  }

  @Get('patterns')
  async getSuspiciousPatterns() {
    return this.fraudDetectionService.getSuspiciousPatterns();
  }

  @Get('flagged')
  async getFlaggedTransactions(
    @Query('userId') userId?: string,
    @Query('reason') reason?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const query: any = {};
    if (userId) query.userId = userId;
    if (reason) query.reason = { $regex: reason };
    if (startDate) query.timestamp = { $gte: new Date(startDate) };
    if (endDate) {
      if (!query.timestamp) query.timestamp = {};
      query.timestamp.$lte = new Date(endDate);
    }

    return this.fraudDetectionService.findFlaggedTransactions(query);
  }
}

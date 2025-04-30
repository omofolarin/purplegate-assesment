import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlaggedTransaction } from './schemas/flagged-transaction.schema';
import { Transaction } from './schemas/transaction.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FraudDetectionService {
  private readonly transactionCache = new Map<string, Transaction[]>();
  private readonly locationCache = new Map<string, { location: string; timestamp: Date }>();

  constructor(
    @InjectModel(FlaggedTransaction.name)
    protected flaggedTransactionModel: Model<FlaggedTransaction>,
  ) { }

  async processTransaction(transaction: Transaction): Promise<void> {
    const { userId, amount, timestamp, location } = transaction;
    const now = new Date(timestamp);

    // Check for suspicious patterns
    const reasons = await this.checkSuspiciousPatterns(transaction);

    if (reasons.length > 0) {
      await this.flagTransaction(transaction, reasons);
    }

    // Update caches
    this.updateTransactionCache(userId, transaction);
    this.updateLocationCache(userId, location, now);
  }

  private async checkSuspiciousPatterns(transaction: Transaction): Promise<string[]> {
    const reasons: string[] = [];
    const { userId, amount, timestamp } = transaction;
    const now = new Date(timestamp);

    // 1. More than 5 transactions by the same user in under 1 minute
    const recentTransactions = this.getRecentTransactions(userId, now, 60000);
    if (recentTransactions.length >= 5) {
      reasons.push('More than 5 transactions in 1 minute');
    }

    // 2. Transactions exceeding $10,000 in a single day
    const dailyTransactions = this.getDailyTransactions(userId, now);
    const dailyAmount = dailyTransactions.reduce((sum, t) => sum + t.amount, 0) + amount;
    if (dailyAmount > 10000) {
      reasons.push('Daily transaction amount exceeds $10,000');
    }

    // 3. Transactions from different locations within 2 minutes
    const lastLocation = this.locationCache.get(userId);
    if (lastLocation && this.isDifferentLocation(lastLocation, transaction.location, now)) {
      reasons.push('Transaction from different location within 2 minutes');
    }

    return reasons;
  }

  private async flagTransaction(transaction: Transaction, reasons: string[]): Promise<void> {
    const flaggedTransaction = new this.flaggedTransactionModel({
      transactionId: transaction.transactionId,
      userId: transaction.userId,
      amount: transaction.amount,
      timestamp: transaction.timestamp,
      merchant: transaction.merchant,
      location: transaction.location,
      reason: reasons.join(', '),
      metadata: {
        originalTransaction: transaction,
      },
    });

    await flaggedTransaction.save();
  }

  private getRecentTransactions(userId: string, now: Date, durationMs: number): Transaction[] {
    const transactions = this.transactionCache.get(userId) || [];
    return transactions.filter(
      t => now.getTime() - new Date(t.timestamp).getTime() <= durationMs
    );
  }

  private getDailyTransactions(userId: string, now: Date): Transaction[] {
    const transactions = this.transactionCache.get(userId) || [];
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    return transactions.filter(
      t => new Date(t.timestamp).getTime() >= startOfDay.getTime()
    );
  }

  private isDifferentLocation(
    lastLocation: { location: string; timestamp: Date },
    currentLocation: string,
    now: Date
  ): boolean {
    return (
      lastLocation.location !== currentLocation &&
      now.getTime() - lastLocation.timestamp.getTime() <= 120000
    );
  }

  private updateTransactionCache(userId: string, transaction: Transaction): void {
    const transactions = this.transactionCache.get(userId) || [];
    transactions.push(transaction);
    this.transactionCache.set(userId, transactions);
  }

  private updateLocationCache(userId: string, location: string, timestamp: Date): void {
    this.locationCache.set(userId, { location, timestamp });
  }

  async getStatistics(): Promise<any> {
    const stats = {
      totalFlagged: await this.flaggedTransactionModel.countDocuments(),
      byReason: {} as Record<string, number>,
      byUser: {} as Record<string, number>,
    };

    const flaggedTransactions = await this.flaggedTransactionModel.find();
    flaggedTransactions.forEach(ft => {
      stats.byReason[ft.reason] = (stats.byReason[ft.reason] || 0) + 1;
      stats.byUser[ft.userId] = (stats.byUser[ft.userId] || 0) + 1;
    });

    return stats;
  }

  async findFlaggedTransactions(query: any): Promise<any[]> {
    return this.flaggedTransactionModel
      .find(query)
      .sort({ timestamp: -1 })
      .lean();
  }

  async getSuspiciousPatterns(): Promise<any> {
    const patterns = {
      highVolumeUsers: [] as any[],
      highAmountUsers: [] as any[],
      locationChanges: [] as any[],
    };

    // Get users with high transaction volume
    const volumeUsers = await this.flaggedTransactionModel
      .aggregate([
        { $group: { _id: '$userId', count: { $sum: 1 } } },
        { $match: { count: { $gt: 5 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .exec();

    patterns.highVolumeUsers = volumeUsers;

    // Get users with high transaction amounts
    const amountUsers = await this.flaggedTransactionModel
      .aggregate([
        { $group: { _id: '$userId', totalAmount: { $sum: '$amount' } } },
        { $match: { totalAmount: { $gt: 10000 } } },
        { $sort: { totalAmount: -1 } },
        { $limit: 10 },
      ])
      .exec();

    patterns.highAmountUsers = amountUsers;

    // Get location changes
    const locationChanges = await this.flaggedTransactionModel
      .find({ reason: { $regex: 'different location' } })
      .sort({ timestamp: -1 })
      .limit(10)
      .exec();

    patterns.locationChanges = locationChanges;

    return patterns;
  }
}

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'fast-csv';

interface Transaction {
  transactionId: string;
  amount: number;
  status: string;
  timestamp: string;
  currency: string;
}

@Injectable()
export class ReconcileService {
  async processCsvs(systemAPath: string, systemBPath: string) {
    // Parse both CSVs
    const [mapA, mapB] = await Promise.all([
      this.parseCsvToMap(systemAPath),
      this.parseCsvToMap(systemBPath),
    ]);

    // Find missing in A and B
    const missingInA = [];
    const missingInB = [];
    const amountMismatches = [];
    const statusMismatches = [];

    for (const [id, b] of mapB.entries()) {
      if (!mapA.has(id)) {
        missingInA.push(id);
      }
    }
    for (const [id, a] of mapA.entries()) {
      if (!mapB.has(id)) {
        missingInB.push(id);
      } else {
        const b = mapB.get(id)!;
        if (Number(a.amount) !== Number(b.amount)) {
          amountMismatches.push({
            id,
            systemA_amount: Number(a.amount),
            systemB_amount: Number(b.amount),
          });
        }
        if (a.status !== b.status) {
          statusMismatches.push({
            id,
            systemA_status: a.status,
            systemB_status: b.status,
          });
        }
      }
    }
    return {
      missing_in_a: missingInA,
      missing_in_b: missingInB,
      amount_mismatches: amountMismatches,
      status_mismatches: statusMismatches,
    };
  }

  private parseCsvToMap(filePath: string): Promise<Map<string, Transaction>> {
    return new Promise((resolve, reject) => {
      const map = new Map<string, Transaction>();
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true, ignoreEmpty: true, trim: true }))
        .on('error', reject)
        .on('data', (row: any) => {
          // Validate required fields
          if (!row.transactionId || !row.amount || !row.status) return;
          map.set(row.transactionId, {
            transactionId: row.transactionId,
            amount: Number(row.amount),
            status: row.status,
            timestamp: row.timestamp,
            currency: row.currency,
          });
        })
        .on('end', () => resolve(map));
    });
  }
}

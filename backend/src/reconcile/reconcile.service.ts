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
    const [resultA, resultB] = await Promise.all([
      this.parseCsvToMap(systemAPath),
      this.parseCsvToMap(systemBPath),
    ]);
    const mapA = resultA.map;
    const mapB = resultB.map;
    const invalidRowsA = resultA.invalidRows;
    const invalidRowsB = resultB.invalidRows;

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
      invalid_rows: {
        systemA: invalidRowsA,
        systemB: invalidRowsB,
      },
    };
  }

  private static readonly ALLOWED_STATUSES = ['SUCCESS', 'FAILED'];

  private isValidISODate(dateStr: string): boolean {
    if (!dateStr || typeof dateStr !== 'string') return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && dateStr === date.toISOString();
  }

  private validateTransactionRecord(record: any): string[] {
    const errors: string[] = [];
    if (!record.transactionId || typeof record.transactionId !== 'string') {
      errors.push('Missing or invalid transactionId');
    }
    if (!record.timestamp || !this.isValidISODate(record.timestamp)) {
      errors.push('Missing or invalid timestamp');
    }
    const amount = typeof record.amount === 'string' ? parseFloat(record.amount) : record.amount;
    if (isNaN(amount)) {
      errors.push('Missing or invalid amount');
    }
    if (!record.currency || typeof record.currency !== 'string') {
      errors.push('Missing or invalid currency');
    }
    if (!ReconcileService.ALLOWED_STATUSES.includes(record.status)) {
      errors.push('Missing or invalid status');
    }
    return errors;
  }

  private parseCsvToMap(filePath: string): Promise<{
    map: Map<string, Transaction>,
    invalidRows: Array<{ row: any, errors: string[] }>
  }> {
    return new Promise((resolve, reject) => {
      const map = new Map<string, Transaction>();
      const invalidRows: Array<{ row: any, errors: string[] }> = [];
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true, ignoreEmpty: true, trim: true }))
        .on('error', reject)
        .on('data', (row: any) => {
          const errors = this.validateTransactionRecord(row);
          if (errors.length > 0) {
            invalidRows.push({ row, errors });
            return;
          }
          map.set(row.transactionId, {
            transactionId: row.transactionId,
            amount: Number(row.amount),
            status: row.status,
            timestamp: row.timestamp,
            currency: row.currency,
          });
        })
        .on('end', () => resolve({ map, invalidRows }));
    });
  }
}

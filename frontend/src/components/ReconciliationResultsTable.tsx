import React from 'react';
import { Table, Card } from 'react-bootstrap';

interface ReconciliationResults {
  missing_transactions: Array<{
    transaction_id: string;
    amount: number;
    currency: string;
    status: string;
    timestamp: string;
    source_system: 'A' | 'B';
  }>;
  amount_discrepancies: Array<{
    transaction_id: string;
    amount_a: number;
    amount_b: number;
    currency: string;
    timestamp: string;
  }>;
  status_discrepancies: Array<{
    transaction_id: string;
    status_a: string;
    status_b: string;
    amount: number;
    currency: string;
    timestamp: string;
  }>;
}

interface ReconciliationResultsTableProps {
  results: ReconciliationResults;
}

export const ReconciliationResultsTable: React.FC<ReconciliationResultsTableProps> = ({ results }) => {
  return (
    <div className="space-y-6">
      {/* Missing Transactions */}
      {results.missing_transactions.length > 0 && (
        <Card>
          <Card.Header className="bg-gray-50">
            <h3 className="font-semibold text-lg">Missing Transactions</h3>
          </Card.Header>
          <Card.Body>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                  <th>Missing From</th>
                </tr>
              </thead>
              <tbody>
                {results.missing_transactions.map((transaction) => (
                  <tr key={transaction.transaction_id}>
                    <td>{transaction.transaction_id}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>{transaction.currency}</td>
                    <td>{transaction.status}</td>
                    <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                    <td>{transaction.source_system === 'A' ? 'System B' : 'System A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Amount Discrepancies */}
      {results.amount_discrepancies.length > 0 && (
        <Card>
          <Card.Header className="bg-gray-50">
            <h3 className="font-semibold text-lg">Amount Discrepancies</h3>
          </Card.Header>
          <Card.Body>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount (System A)</th>
                  <th>Amount (System B)</th>
                  <th>Currency</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {results.amount_discrepancies.map((discrepancy) => (
                  <tr key={discrepancy.transaction_id}>
                    <td>{discrepancy.transaction_id}</td>
                    <td>${discrepancy.amount_a.toFixed(2)}</td>
                    <td>${discrepancy.amount_b.toFixed(2)}</td>
                    <td>{discrepancy.currency}</td>
                    <td>{new Date(discrepancy.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Status Discrepancies */}
      {results.status_discrepancies.length > 0 && (
        <Card>
          <Card.Header className="bg-gray-50">
            <h3 className="font-semibold text-lg">Status Discrepancies</h3>
          </Card.Header>
          <Card.Body>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Status (System A)</th>
                  <th>Status (System B)</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {results.status_discrepancies.map((discrepancy) => (
                  <tr key={discrepancy.transaction_id}>
                    <td>{discrepancy.transaction_id}</td>
                    <td>{discrepancy.status_a}</td>
                    <td>{discrepancy.status_b}</td>
                    <td>${discrepancy.amount.toFixed(2)}</td>
                    <td>{discrepancy.currency}</td>
                    <td>{new Date(discrepancy.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* No Results Found */}
      {Object.values(results).every((array) => array.length === 0) && (
        <Card>
          <Card.Body className="text-center py-8">
            <p className="text-gray-600">No discrepancies found between the systems</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
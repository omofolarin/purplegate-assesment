import React from 'react';
import { Table } from 'react-bootstrap';

interface FraudResultsTableProps {
  results: {
    flagged_transactions: Array<{
      transactionId: string;
      userId: string;
      amount: number;
      timestamp: string;
      merchant: string;
      location: string;
      reason: string;
    }>;
    missing_in_a: Array<{
      transactionId: string;
      amount: number;
      timestamp: string;
    }>;
    missing_in_b: Array<{
      transactionId: string;
      amount: number;
      timestamp: string;
    }>;
    amount_mismatches: Array<{
      transactionId: string;
      systemA_amount: number;
      systemB_amount: number;
    }>;
    status_mismatches: Array<{
      transactionId: string;
      systemA_status: string;
      systemB_status: string;
    }>;
  };
}

export const FraudResultsTable: React.FC<FraudResultsTableProps> = ({ results }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Fraud Detection Results</h2>
        <p className="text-gray-600">Identified discrepancies and suspicious transactions</p>
      </div>

      <div className="bg-gray-50 rounded-lg mb-6">
        <Table striped bordered hover responsive className="mb-0">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Merchant
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
            </tr>
          </thead>
          <tbody>
            {results.flagged_transactions?.map((transaction) => (
              <tr key={transaction.transactionId} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-left text-xs font-medium text-gray-900">
                  {transaction.transactionId}
                </td>
                <td className="px-4 py-3 text-left text-xs font-medium text-gray-900">
                  {transaction.userId}
                </td>
                <td className="px-4 py-3 text-left text-xs font-medium text-gray-900">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-left text-xs font-medium text-gray-900">
                  {new Date(transaction.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-left text-xs font-medium text-gray-900">
                  {transaction.merchant}
                </td>
                <td>{transaction.location}</td>
                <td className="font-medium">
                  <span className="px-2 py-1 rounded-full text-sm" style={{
                    backgroundColor: transaction.reason === 'Fraud Detected' ? '#f87171' :
                      transaction.reason === 'Suspicious Pattern' ? '#fbbf24' : '#34d399'
                  }}>
                    {transaction.reason}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {results.missing_in_a?.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Missing in System A</h3>
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {results.missing_in_a.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td>{transaction.transactionId}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {results.missing_in_b?.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Missing in System B</h3>
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {results.missing_in_b.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td>{transaction.transactionId}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {results.amount_mismatches?.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Amount Mismatches</h3>
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>System A Amount</th>
                <th>System B Amount</th>
              </tr>
            </thead>
            <tbody>
              {results.amount_mismatches.map((mismatch) => (
                <tr key={mismatch.transactionId}>
                  <td>{mismatch.transactionId}</td>
                  <td>${mismatch.systemA_amount.toFixed(2)}</td>
                  <td>${mismatch.systemB_amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {results.status_mismatches?.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Mismatches</h3>
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>System A Status</th>
                <th>System B Status</th>
              </tr>
            </thead>
            <tbody>
              {results.status_mismatches.map((mismatch) => (
                <tr key={mismatch.transactionId}>
                  <td>{mismatch.transactionId}</td>
                  <td>{mismatch.systemA_status}</td>
                  <td>{mismatch.systemB_status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

interface TransactionFormProps {
  onSubmit: (transaction: {
    transactionId: string;
    userId: string;
    amount: number;
    timestamp: string;
    merchant: string;
    location: string;
  }) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [transactionId, setTransactionId] = useState('');
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [merchant, setMerchant] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      transactionId,
      userId,
      amount: Number(amount),
      timestamp,
      merchant,
      location,
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <Card.Body className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">New Transaction</h2>
          <p className="text-gray-600">Enter transaction details to process</p>
        </div>
        <Form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Form.Label className="block text-sm font-medium text-gray-700">Transaction ID</Form.Label>
            <Form.Control
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400 transition-colors duration-200"
            />
          </div>

          <div className="space-y-1">
            <Form.Label className="block text-sm font-medium text-gray-700">User ID</Form.Label>
            <Form.Control
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400 transition-colors duration-200"
            />
          </div>

          <div className="space-y-1">
            <Form.Label className="block text-sm font-medium text-gray-700">Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400 transition-colors duration-200"
            />
          </div>

          <div className="space-y-1">
            <Form.Label className="block text-sm font-medium text-gray-700">Timestamp</Form.Label>
            <Form.Control
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400 transition-colors duration-200"
            />
          </div>

          <div className="space-y-1">
            <Form.Label className="block text-sm font-medium text-gray-700">Merchant</Form.Label>
            <Form.Control
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400 transition-colors duration-200"
            />
          </div>

          <div className="space-y-1">
            <Form.Label className="block text-sm font-medium text-gray-700">Location</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400 transition-colors duration-200"
            />
          </div>

          <Button variant="primary" type="submit" className="w-full justify-center py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Submit Transaction
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

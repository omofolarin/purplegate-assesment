"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TransactionForm } from '@/components/TransactionForm';
import { Statistics } from '@/components/Statistics';
import { SuspiciousPatterns } from '@/components/SuspiciousPatterns';
import { FraudResultsTable } from '@/components/FraudResultsTable';

interface StatsData {
  totalFlagged: number;
  byReason: Record<string, number>;
  byUser: Record<string, number>;
}

interface PatternsData {
  highVolumeUsers: Array<{
    _id: string;
    count: number;
  }>;
  highAmountUsers: Array<{
    _id: string;
    totalAmount: number;
  }>;
  locationChanges: Array<{
    transactionId: string;
    userId: string;
    amount: number;
    location: string;
  }>;
}

interface ResultsData {
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
}

export default function FraudDetectionPage() {
  const [stats, setStats] = useState<StatsData>({
    totalFlagged: 0,
    byReason: {},
    byUser: {}
  });
  const [patterns, setPatterns] = useState<PatternsData>({
    highVolumeUsers: [],
    highAmountUsers: [],
    locationChanges: []
  });
  const [results, setResults] = useState<ResultsData>({
    flagged_transactions: [],
    missing_in_a: [],
    missing_in_b: [],
    amount_mismatches: [],
    status_mismatches: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get<StatsData>("http://localhost:3001/fraud/statistics");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchPatterns = async () => {
    try {
      const response = await axios.get<PatternsData>("http://localhost:3001/fraud/patterns");
      setPatterns(response.data);
    } catch (error) {
      console.error("Error fetching patterns:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get<ResultsData>("http://localhost:3001/fraud/flagged");
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching flagged transactions:", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchStats(), fetchPatterns(), fetchResults()])
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleTransactionSubmit = async (transaction: any) => {
    try {
      const response = await axios.post("http://localhost:3001/fraud/process", transaction);
      if (response.data.flagged) {
        setResults(prev => ({
          ...prev,
          flagged_transactions: [...prev.flagged_transactions, response.data.transaction]
        }));
      }

      // Refresh all data after successful transaction
      Promise.all([fetchStats(), fetchPatterns(), fetchResults()])
        .catch((error) => console.error("Error refreshing data:", error));
    } catch (error) {
      console.error("Error processing transaction:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto p-4 bg-white">
      <h1 className="text-3xl font-bold mb-8">Fraud Detection System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Submit New Transaction</h2>
          <TransactionForm onSubmit={handleTransactionSubmit} />
        </div>

        <div>
          <Statistics stats={stats} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <div>
          <FraudResultsTable results={results} />
        </div>
        <div>
          <SuspiciousPatterns patterns={patterns} />
        </div>

      </div>
    </main>
  );
}

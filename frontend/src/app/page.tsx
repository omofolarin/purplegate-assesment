"use client";
import { UploadForm } from '../components/UploadForm';
import { ReconciliationResultsTable } from '../components/ReconciliationResultsTable';
import { useState } from "react";

export default function Home() {
  const [results, setResults] = useState(null);

  return (
    <main className="container mx-auto p-4 bg-white">
      <h1 className="text-3xl font-bold mb-8">Transaction Ledger Reconciliation</h1>

      <div className="space-y-6">
        <UploadForm onResults={setResults} />

        {results && (
          <ReconciliationResultsTable results={results} />
        )}
      </div>
    </main>
  );
}

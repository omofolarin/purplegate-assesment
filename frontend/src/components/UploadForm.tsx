import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

interface UploadFormProps {
  onResults: (results: any) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onResults }) => {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'A' | 'B') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError('File size exceeds 100MB limit');
        return;
      }
      setError(null);
    }

    if (type === 'A') {
      setFileA(file || null);
    } else {
      setFileB(file || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileA || !fileB) {
      setError('Please upload both files');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('fileA', fileA as File);
      formData.append('fileB', fileB as File);

      const response = await fetch(`http://localhost:3001/reconcile`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to reconcile files');
      }

      const results = await response.json();
      onResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <Card.Body className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Upload Transaction Files</h3>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="space-y-4">
          <Form.Group controlId="fileA" className="mb-4">
            <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
              Source System A CSV
            </Form.Label>
            <input
              type="file"
              accept=".csv"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'A')}
              required
              disabled={loading}
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400 transition-colors duration-200 p-2 bg-white"
            />
          </Form.Group>

          <Form.Group controlId="fileB" className="mb-4">
            <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
              Source System B CSV
            </Form.Label>
            <input
              type="file"
              accept=".csv"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'B')}
              required
              disabled={loading}
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-gray-400 transition-colors duration-200 p-2 bg-white"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading || !fileA || !fileB}
            className="w-full"
          >
            {loading ? 'Processing...' : 'Reconcile Files'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

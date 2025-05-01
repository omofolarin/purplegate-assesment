import React from 'react';

interface SuspiciousPatternsProps {
  patterns: {
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
  };
}

export const SuspiciousPatterns: React.FC<SuspiciousPatternsProps> = ({ patterns }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Suspicious Patterns</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">High Volume Users</h3>
          <div className="space-y-2">
            {patterns.highVolumeUsers.map((user) => (
              <div key={user._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">User ID: {user._id}</span>
                <span className="text-sm font-medium text-indigo-600">{user.count} transactions</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">High Amount Users</h3>
          <div className="space-y-2">
            {patterns.highAmountUsers.map((user) => (
              <div key={user._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">User ID: {user._id}</span>
                <span className="text-sm font-medium text-indigo-600">${user.totalAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Location Changes</h3>
          <div className="space-y-2">
            {patterns.locationChanges.map((change) => (
              <div key={change.transactionId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="text-sm text-gray-700">Transaction ID: {change.transactionId}</div>
                  <div className="text-xs text-gray-500">Amount: ${change.amount.toFixed(2)}</div>
                </div>
                <span className="text-sm font-medium text-indigo-600">{change.location}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

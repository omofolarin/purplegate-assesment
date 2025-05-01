import { Card, ListGroup } from 'react-bootstrap';

interface StatisticsProps {
  stats: {
    totalFlagged: number;
    byReason: Record<string, number>;
    byUser: Record<string, number>;
  };
}

export function Statistics({ stats }: StatisticsProps) {
  const { totalFlagged, byReason, byUser } = stats;

  return (
    <Card>
      <Card.Body>
        <h3 className="mb-3">Total Flagged Transactions: {totalFlagged}</h3>
        <h4 className="mb-3">By Reason</h4>
        <ListGroup>
          {Object.entries(byReason).map(([reason, count]) => (
            <ListGroup.Item key={reason}>
              <strong>{reason}</strong>: {count}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <h4 className="mt-3 mb-3">Top Users</h4>
        <ListGroup>
          {Object.entries(byUser)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([userId, count]) => (
              <ListGroup.Item key={userId}>
                <strong>User {userId}</strong>: {count} flagged transactions
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

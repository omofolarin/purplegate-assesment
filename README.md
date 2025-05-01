# Fraud Detection System

A comprehensive fraud detection system that analyzes financial transactions in real-time and identifies suspicious patterns and discrepancies between two transaction processing systems.

## Features

### 1. Transaction Processing
- Real-time transaction submission
- Automatic fraud detection and analysis
- Immediate feedback on transaction status

### 2. Fraud Detection
- Identifies flagged transactions based on various criteria
- Detects discrepancies between System A and System B
- Categorizes transactions by reason for flagging

### 3. Analytics & Statistics
- Real-time statistics dashboard
- Visualizations of flagged transactions
- Breakdown of flagged transactions by reason and user
- High volume user detection
- High amount transaction analysis
- Location-based pattern analysis

### 4. Pattern Recognition
- Identifies users with high transaction volumes
- Detects users with high transaction amounts
- Tracks location changes between transactions
- Analyzes transaction patterns and anomalies

### 5. Results Display
- Comprehensive table view of flagged transactions
- Detailed information about each transaction
- Clear visualization of discrepancies
- Easy-to-read reason categorization

## Technical Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- Bootstrap React Components
- Axios for API communication

### Backend
- Node.js
- Express.js
- TypeScript
- In-memory data storage
- Mongoose

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm run dev
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Usage

1. Submit a new transaction using the form
2. View real-time analytics and statistics
3. Monitor flagged transactions in the results table
4. Analyze suspicious patterns and discrepancies

## API Endpoints

### Transaction Processing
- POST `/fraud/process`: Submit a new transaction for analysis

### Data Retrieval
- GET `/fraud/statistics`: Get fraud statistics
- GET `/fraud/patterns`: Get suspicious patterns
- GET `/fraud/flagged`: Get flagged transactions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

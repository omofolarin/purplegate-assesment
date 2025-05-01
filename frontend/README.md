# Transaction Ledger Reconciliation System

A web application for reconciling financial transaction records between two systems.

## Features

- Upload CSV files from two source systems
- Detect and display:
  - Missing transactions in either system
  - Amount mismatches
  - Status mismatches
- Clean and responsive UI
- Efficient file handling for large datasets

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. The application will be available at `http://localhost:3000`

## Usage

1. Click on "Choose File" to select the CSV file from Source System A
2. Click on "Choose File" to select the CSV file from Source System B
3. Click "Reconcile Files" to process the files and view the results

## CSV File Format

The CSV files should contain the following columns:
- transaction_id (string)
- amount (number)
- currency (string)
- status (string)
- timestamp (ISO 8601 format)

## API Endpoints

- POST `/reconcile` - Process and reconcile transaction files
  - Accepts multipart form data with two files: fileA and fileB
  - Returns JSON with reconciliation results

## Error Handling

- File size limit: 100MB
- File type validation: Only CSV files are accepted
- Comprehensive error messages for invalid uploads

## Technology Stack

- React + TypeScript
- Next.js
- Tailwind CSS
- React Bootstrap
- Axios

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

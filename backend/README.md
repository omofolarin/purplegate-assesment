# Transaction Ledger Reconciliation System Backend

This is a NestJS backend service for reconciling and reporting discrepancies between two financial transaction CSV files (SourceSystemA and SourceSystemB).

## Features
- Efficient streaming/processing of large CSVs (1M+ rows) via `fast-csv`
- REST API endpoint `/reconcile` for uploading two CSV files and returning reconciliation results
- Detects:
  - Transactions present in one system but missing in the other
  - Amount mismatches
  - Status mismatches
- Robust error handling and validation

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Install Dependencies
```
cd backend
npm install
```

### Run the Server
```
npm run start:dev
```
The server will start on [http://localhost:3001](http://localhost:3001).

### API Usage
- **Endpoint:** `POST /reconcile`
- **Request:** `multipart/form-data` with two files (systemA.csv, systemB.csv)
  - Both files must have headers: `transactionId,amount,status,timestamp,currency`
- **Response:**
```json
{
  "missing_in_a": ["id1", "id2"],
  "missing_in_b": ["id3"],
  "amount_mismatches": [{ "id": "id4", "systemA_amount": 100, "systemB_amount": 90 }],
  "status_mismatches": [{ "id": "id5", "systemA_status": "SUCCESS", "systemB_status": "FAILED" }]
}
```

### Notes
- Uploaded files are temporarily stored in the `uploads/` directory.
- Max file size: 50MB per file.
- Only `.csv` files are allowed.

## License
MIT

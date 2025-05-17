import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import approveHandlerImport from './api/review/approve.js';

dotenv.config();

const approveHandler = approveHandlerImport.default || approveHandlerImport;

const app = express();
app.use(cors()); // Allow all origins for local testing
app.use(bodyParser.json());

// Route for approving reviews
app.post('/api/review/approve', approveHandler);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
}); 
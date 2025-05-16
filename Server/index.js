// Basic Express server setup
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Log environment variables for debugging
console.log('Environment Variables:', {
    PORT,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? '***' : undefined,
    TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID ? '***' : undefined,
    NODE_ENV: process.env.NODE_ENV
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

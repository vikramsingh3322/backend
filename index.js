const express = require('express');
const app = express();

// Define an API endpoint
app.get('/api/data', (req, res) => {
  const data = {
    message: 'Hello, API!',
    timestamp: new Date().toISOString()
  };

  res.json(data);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

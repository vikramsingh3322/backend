const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Define an API endpoint
app.get('/api/data', (req, res) => {
  const data = {
    message: 'Hello, API!',
    timestamp: new Date().toISOString()
  };

  res.json(data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


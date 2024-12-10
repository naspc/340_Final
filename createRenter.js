// createRenter.js
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./config'); // Import the database connection

const app = express();
app.use(bodyParser.json());

// POST route for creating a renter
app.post('/api/createRenter', (req, res) => {
  const { renter_id, name, movie_id } = req.body;

  // Validate input
  if (!name || !renter_id || !movie_id) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  // Prepare the query
  const query = 'INSERT INTO Renter (renter_id, name, movie_id) VALUES (?, ?, ?)';
  connection.query(query, [renter_id, name, movie_id], (err, result) => {
    if (err) {
      console.error('Error inserting renter: ', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Renter created successfully', renter_id: result.insertId });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

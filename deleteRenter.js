// deleteRenter.js
const express = require('express');
const connection = require('./config'); // Import the database connection

const app = express();
app.use(express.json());

// DELETE route for deleting a renter
app.delete('/api/deleteRenter/:renter_id', (req, res) => {
  const { renter_id } = req.params;

  // Prepare the query
  const query = 'DELETE FROM Renter WHERE renter_id = ?';
  connection.query(query, [renter_id], (err, result) => {
    if (err) {
      console.error('Error deleting renter: ', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Renter not found' });
    }
    res.status(200).json({ message: 'Renter deleted successfully' });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

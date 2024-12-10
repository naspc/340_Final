const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;

// Database connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Use your database user
  password: '', // Use your database password
  database: 'your_database_name' // Use your database name
});

// Connect to the database
db.connect(err => {
  if (err) throw err;
  console.log('Connected to the database!');
});

// API endpoint to get cast for a movie
app.get('/api/cast', (req, res) => {
  const movieId = req.query.movie_id;
  if (movieId) {
    const sql = `
      SELECT m.title, d.name AS director, a.name AS actor
      FROM Movies m
      LEFT JOIN Directs di ON m.movie_id = di.movie_id
      LEFT JOIN Directors d ON di.director_id = d.director_id
      LEFT JOIN Acts_in ai ON m.movie_id = ai.movie_id
      LEFT JOIN Actors a ON ai.actor_id = a.actor_id
      WHERE m.movie_id = ?;
    `;
    db.query(sql, [movieId], (err, results) => {
      if (err) return res.status(500).send('Server error');
      res.json(results);
    });
  } else {
    res.status(400).send('Movie ID is required');
  }
});

// API endpoint to get renters for a movie
app.get('/api/renters', (req, res) => {
  const movieId = req.query.movie_id;
  if (movieId) {
    const sql = `
      SELECT r.renter_id, r.name, m.title
      FROM Renter r
      INNER JOIN Movies m ON r.movie_id = m.movie_id
      WHERE r.movie_id = ?;
    `;
    db.query(sql, [movieId], (err, results) => {
      if (err) return res.status(500).send('Server error');
      res.json(results);
    });
  } else {
    res.status(400).send('Movie ID is required');
  }
});

// Serve static files (HTML files)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');


// Serve static files from the 'public' directory
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Other routes
app.get('/viewRenter', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewRenter.html'));
});

// Database connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'cs340_reedyai', // Your DB username
  password: '9249', // Your DB password
  database: 'cs340_rothq' // Your actual DB name
});

// Establish the connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + db.threadId);
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// API endpoint to create a new renter
app.post('/api/renters', (req, res) => {
  const { name, movie_id } = req.body; // Destructure the body

  if (!name || !movie_id) {
      return res.status(400).json({ error: 'Name and Movie ID are required' });
  }

  const sql = 'INSERT INTO Renter (name, movie_id) VALUES (?, ?)';
  db.query(sql, [name, movie_id], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to create renter' });
      }
      res.status(201).json({ id: results.insertId, name, movie_id });
  });
});
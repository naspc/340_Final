// config.js
const mysql = require('mysql');

// Database configuration
const dbConfig = {
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_reedyai',
  password: '9249',
  database: 'cs340_reedyai'
};

// Create a connection to the MySQL database
const connection = mysql.createConnection(dbConfig);

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

module.exports = connection;

const express = require('express');
const app = express(); // importing the CORS library to allow Cross-origin resource sharing
const cors = require('cors');
const path = require("path"); // Crucial for app.use
const bodyParser = require('body-parser');
const Client = require('pg'); // PostgreSQL
require("dotenv").config(); // for .env
const PORT = process.env.PORT || 4002;

const db = new Client({
    connectionString: process.env.DATABASE_URL, // Heroku addons
    ssl: {
        rejectUnauthorized: false
    }
});
db.connect;

// Middleware
app.use(cors());
app.use(express.json()); // Recognize Request Objects as JSON objects
app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // express.urlencoded in old version

// ROUTES
app.get('/getting', (req, res) => {
    const sql2 = `SELECT * FROM visits`;
    db.query(sql2, (err, data) => {
        if (!err) {
            let visitsDb = data.rows;
            res.status(200).json(visitsDb);
        } else {
            console.log(err.message);
        }
        db.end;
    });
});

// The routes used by Table components
app.post('/posting', (req, res, next) => {
    // Inserting into a database
     const sql = 'INSERT INTO visits (name, surname, phone_number, SSN, day, time) VALUES ($1, $2, $3, $4, $5, $6)';
    db.query(sql, [
        req.body[0],
        req.body[1],
        req.body[2],
        req.body[3],
        req.body[4],
        req.body[5]
    ], function(err) {
        if (err) {
            console.log("Error while inserting into a database: ", err);
            return res.sendStatus(500);
        } else {
            return res.sendStatus(201);
        }
    });
});

app.put('/change', (req, res, next) => {
    // Updating a database
    const sql = 'UPDATE visits SET name = $1, surname = $2, phone_number = $3, SSN = $4 WHERE day = $5 AND time = $6';
    db.query(sql, [
        req.body[0],
        req.body[1],
        req.body[2],
        req.body[3],
        req.body[4],
        req.body[5]
    ], function(err) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            return res.sendStatus(201);
        }
    });
});

app.delete('/day/:day/time/:time', (req, res) => {
    // Deleting data inside of the database
    const sql = 'DELETE FROM visits WHERE day = $1 AND time = $2';
    db.query(sql, [
        req.params.day,
        req.params.time
    ], function(err) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            return res.sendStatus(204);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
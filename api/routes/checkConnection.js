const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();
const con = new Pool({
    user: `${process.env.DB_USER}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`,
    password: `${process.env.DB_PASS}`,
    port: `${process.env.DB_PORT}`,
})

try {
    router.get('/', (req, res, next) => {
        res.json({
            statusCode: 201,
            connected: true
        })
    });
} catch{
    console.log('Error');
}

module.exports = router;
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

router.post('/', (req, res, next) => {

    userId = req.body.userId;

    sqlQuery = `DELETE FROM tmporders where userid = ${userId} and isconfirmed = false`;
    try {
        con.query(sqlQuery, function (err, rows) {
            if (!err) {
                res.sendStatus(201);
                console.log('Deleted');
            } else {
                console.error("Failure in tmpOrdersDelete.js");
                console.log(err);
                res.sendStatus(202);
            }
        });
    } catch{
        console.log('Error in tmpOrdersDelete.js');
    }
});

router.patch('/', (req, res, next) => {

    userId = req.body.userId;

    sqlQuery = `UPDATE tmporders SET isconfirmed = true where userid = ${userId}`;
    try {
        con.query(sqlQuery, function (err, rows) {
            if (!err) {
                res.sendStatus(201);
                console.log('Confirmed');
            } else {
                console.error("Failure Patching in tmpOrdersDelete.js");
                console.log(err);
                res.sendStatus(202);
            }
        });
    } catch{
        console.log('Error Patching in tmpOrdersDelete.js');
    }
});

module.exports = router;
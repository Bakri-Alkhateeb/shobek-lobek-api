const express = require('express');
const router = express.Router();
var crypto = require('crypto');
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
    username = req.body.username;
    firstName = req.body.firstName;
    lastName = req.body.lastName;
    phoneNumber = req.body.phoneNumber;
    password = crypto.createHash('sha256').update(req.body.password).digest('hex');

    sqlQuery = `insert into users (username, phone_number, password, first_name, last_name) VALUES ('${username}', '${phoneNumber}', '${password}', '${firstName}', '${lastName}')`;
    try {
        con.query(sqlQuery, function (err, result) {
            if (err) {
                res.sendStatus(202);
                console.log(err);
            } else {
                console.log("1 user added");
                res.sendStatus(201);
            }
        });
    } catch{
        console.log('Error in signup.js');
    }
});


module.exports = router;
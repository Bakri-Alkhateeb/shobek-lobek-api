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
    
    username = req.body.username;

    const sqlQuery = `SELECT id FROM users WHERE username = '${username}'`;

    con.query(sqlQuery, function (err, row) {

        var userId;
        
        try {
            if (row['rows'].length > 0) {
                
                row['rows'].forEach((intRow) => {
                    userId = intRow.id;
                });

                res.json({
                    statusCode: 201,
                    userId: userId,
                })
                console.log('userId sent');
                
            } else {
                console.error("Failure in getUserId.js");
                console.log(err);
                res.sendStatus(202);
            }
        } catch{
            console.log('Error in getUserId.js');
        }
    });
});

module.exports = router;
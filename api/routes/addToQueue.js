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
    router.post('/', (req, res, next) => {

        queueId = req.body.queueId;
        resId = req.body.resId;
        timeinmin = req.body.timeinmin;
        userId = req.body.userId;
        var orderId;        

        sqlQuery = `SELECT id FROM orders where userid = ${userId} and isdone = false`;

        con.query(sqlQuery, (err, rows) => {
            try {
                lastIndex = rows['rows'].length - 1;
                orderId = rows['rows'][lastIndex]['id'];
            } catch{
                console.log('something wrong with setting orderId or lastIndex value in addToQueue.js');
            }

            if (!err) {
                sqlQuery2 = `SELECT name FROM queues where id = ${queueId}`;
                try {
                    con.query(sqlQuery2, function (err, rows) {
                        try {
                            queueName = rows['rows'][0]['name'];
                        } catch{
                            console.log('something wrong with setting queueName value in addToQueue.js');

                        }

                        if (!err) {

                            sqlQuery2 = `INSERT INTO ${queueName} (timeinmin, resid, orderid) VALUES(${timeinmin}, ${resId}, ${orderId})`;

                            try {
                                con.query(sqlQuery2, function (err, rows) {

                                    if (!err) {
                                        res.sendStatus(201);
                                        console.log('added to queue');
                                        console.log(`added ${timeinmin} to queue ${queueId}`);
                                    } else {
                                        console.error("Failed to add to queue");
                                        console.log(err);
                                        res.sendStatus(202);
                                    }
                                });
                            } catch{
                                console.log('Something went down.');
                            }
                        } else {
                            console.error("Failure");
                            console.log(err);
                            res.sendStatus(202);
                        }
                    });
                } catch{
                    console.log('Something went down.');
                }
            } else {
                console.log(err);
                res.sendStatus(202);
            }
        })
    });
} catch{
    console.log('Error');
}

module.exports = router;
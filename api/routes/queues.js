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
        var time = 0;

        sqlQuery = `SELECT name FROM queues where id = ${queueId}`;
        try {
            con.query(sqlQuery, function (err, rows) {
                try {
                    queueName = rows['rows'][0]['name'];
                } catch{
                    console.log('something wrong with setting queueName value in queues.js');
                }

                if (!err) {

                    sqlQuery2 = `SELECT timeinmin FROM ${queueName} where resid = ${resId}`;

                    try {
                        con.query(sqlQuery2, function (err, rows) {

                            try {
                                queuesArray = rows['rows'];
                            } catch{
                                console.log('something wrong with setting queuesArray value in queues.js');
                            }
                            if (!err) {

                                queuesArray.forEach((row) => {
                                    time += row['timeinmin']
                                });

                                console.log("time is ========== ");
                                console.log(time);

                                res.json({
                                    statusCode: 201,
                                    time: time,
                                });

                            } else {
                                console.error("Failure in queues.js");
                                console.log(err);
                                res.sendStatus(202);
                            }
                        });
                    } catch{
                        console.log('Something went down in queues.js');
                    }
                } else {
                    console.error("Failure in queues.js");
                    console.log(err);
                    res.sendStatus(202);
                }
            });
        } catch{
            console.log('Something went down in queues.js');
        }
    });
} catch{
    console.log('Error in queues.js');
}

module.exports = router;
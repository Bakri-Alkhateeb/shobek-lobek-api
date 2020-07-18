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
        var queue_id;

        sqlQuery = `SELECT id, name FROM queues where id = ${queueId}`;
        try {
            con.query(sqlQuery, function (err, rows) {
                try {
                    queueName = rows['rows'][0]['name'];
                    queue_id = rows['rows'][0]['id'];
                } catch{
                    console.log('something wrong with setting queueName value or queue_id value in multiQueueTime.js');
                }


                if (!err) {

                    sqlQuery2 = `SELECT timeinmin FROM ${queueName} where resid = ${resId}`;

                    try {
                        con.query(sqlQuery2, function (err, rows) {

                            queuesArray = rows['rows'];

                            if (!err) {
                                console.log(queuesArray);

                                queuesArray.forEach((row) => {
                                    time += row['timeinmin']
                                });

                                res.status(201).json({
                                    time: time,
                                    queue_id: queue_id
                                });

                            } else {
                                console.error("Failure in multiQueueTime.js");
                                console.log(err);
                                res.sendStatus(202);
                            }
                        });
                    } catch{
                        console.log('Something went down in multiQueueTime.js');
                    }
                } else {
                    console.error("Failure in multiQueueTime.js");
                    console.log(err);
                    res.sendStatus(202);
                }
            });
        } catch{
            console.log('Something went down in multiQueueTime.js');
        }
    });
} catch{
    console.log('Error in multiQueueTime.js');
}

module.exports = router;
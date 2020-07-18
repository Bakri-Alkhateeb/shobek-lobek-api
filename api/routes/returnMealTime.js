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

        mealId = req.body.mealId;

        sqlQuery = `SELECT timeinmin, queueid FROM meals where id = ${mealId}`;
        try {
            con.query(sqlQuery, function (err, rows) {

                if (!err) {
                    res.status(201).json({
                        TimeInMin: rows['rows'][0]['timeinmin'],
                        QueueId: rows['rows'][0]['queueid'],
                    })

                } else {
                    console.error("Failure in returnMealTime.js");
                    console.log(err);
                    res.sendStatus(202);
                }
            });
        } catch{
            console.log('Something went down in returnMealTime.js');
        }
    });
} catch{
    console.log('Error in returnMealTime.js');
}

module.exports = router;
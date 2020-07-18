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
        resId = req.body.resId;
        var time = 0;

        sqlQuery = `SELECT queueid, timeinmin FROM meals where id = ${mealId} and refresid = ${resId}`;
        try {
            con.query(sqlQuery, function (err, rows) {

                if (!err) {                    
                    res.status(201).json({
                        queueId: rows['rows'][0]['queueid'],
                        timeInMin: rows['rows'][0]['timeinmin']
                    })
                } else {
                    console.error("Failure in separateQueues.js");
                    console.log(err);
                    res.sendStatus(202);
                }
            });
        } catch{
            console.log('Something went down in separateQueues.js');
        }
    });
} catch{
    console.log('Error in separateQueues.js');
}

module.exports = router;
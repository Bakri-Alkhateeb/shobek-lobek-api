const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool
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
    var mealsIds = req.body.mealsIds;
    var userId = req.body.userId;
    var time = new Date();
    var mins = time.getMinutes();
    if (mins < 10) {
        mins = "0" + mins.toString();
    }
    var myTime = `${time.getHours()}:${mins}`;
    var myDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getUTCDate()}`;

    sqlQuery = `insert into tmporders (orderdate, userid, mealsids, ordertime) VALUES('${myDate}', ${userId}, ARRAY${mealsIds}, '${myTime}');`;

    try {
        con.query(sqlQuery, function (err, row) {
            if (err) {
                res.sendStatus(202);
                console.log(err);
            } else {
                console.log("1 temporary order inserted");
                res.sendStatus(201);

                sqlQuery2 = `SELECT * FROM tmporders`;

                con.query(sqlQuery2, function (err, row) {
                    if (err) {
                        res.sendStatus(202);
                        console.log('Failure in ordersInsert.js');
                    } else {
                        console.log('success');
                    }
                });
            }
        });
    } catch{
        console.log('Error in ordersInsert.js');
    }
});

module.exports = router;
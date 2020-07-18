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
    var mealId = req.body.mealId;

    sqlQuery = `Select name, image, price, timeinmin, queueid from meals where id = ${mealId}`;

    try {
        con.query(sqlQuery, function (err, rows) {
            if (err) {
                res.sendStatus(202);
                console.log(err);
            } else {
                res.status(201).json({
                    mealName: rows['rows'][0]['name'],
                    mealImage: rows['rows'][0]['image'],
                    mealPrice: rows['rows'][0]['price'],
                    mealTime: rows['rows'][0]['timeinmin'],
                    mealQueue: rows['rows'][0]['queueid'],
                });
            }
        });
    } catch{
        console.log('Error in cart.js');
    }
});


module.exports = router;
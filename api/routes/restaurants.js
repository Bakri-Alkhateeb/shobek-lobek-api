const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();
const con = new Pool({
    user: `${process.env.DB_USER}`,
    host: `${process.env.DATABASE_URL}`,
    database: `${process.env.DB_NAME}`,
    password: `${process.env.DB_PASS}`,
    port: `${process.env.DB_PORT}`,
})

router.get('/', (req, res, next) => {

    sqlQuery = 'SELECT * FROM restaurants ORDER BY id ASC';
    try {
        con.query(sqlQuery, function (err, rows) {
            var ress = [];
            var ressImgs = [];
            var ressId = [];
            var ressDelivery = [];

            if (rows['rows'].length > 0) {

                rows['rows'].forEach((row) => {
                    ress.push(row.name);
                    ressImgs.push(row.image);
                    ressId.push(row.id);
                    ressDelivery.push(row.has_delivery_service)
                });

                res.status(201).json({
                    count: rows['rows'].length,
                    ressNames: ress,
                    ressImages: ressImgs,
                    ressId: ressId,
                    ressDelivery: ressDelivery
                })

            } else {
                console.error("Failure in restaurants.js");
                console.log(err);
                res.sendStatus(202);
            }
        });
    } catch{
        console.log('Error in restaurants.js');
    }
});

module.exports = router;
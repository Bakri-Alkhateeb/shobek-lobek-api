const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const Pool = require('pg').Pool;
const con = new Pool({
    user: `${process.env.DB_USER}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`,
    password: `${process.env.DB_PASS}`,
    port: `${process.env.DB_PORT}`,
})

try {
    router.post('/', (req, res, next) => {

        resId = req.body.resId;
        catId = req.body.catId;

        sqlQuery = `SELECT * FROM meals where refResId = ${resId} and catid = ${catId} and is_meal_available = true ORDER BY id ASC`;
        try {
            con.query(sqlQuery, function (err, rows) {

                var meals = [];
                var mealsImgs = [];
                var mealsId = [];
                var mealsDesc = [];
                var mealsPrice = [];
                var mealsTimes = [];

                try {
                    mealsArray = rows['rows'];
                } catch{
                    console.log('Don\'t Mind This Error');
                }

                if (!err) {
                    mealsArray.forEach((row) => {
                        meals.push(row.name);
                        mealsImgs.push(row.image);
                        mealsId.push(row.id);
                        mealsDesc.push(row.description);
                        mealsPrice.push(row.price);
                        mealsTimes.push(row.timeinmin);
                    });

                    res.json({
                        statusCode: 201,
                        count: rows['rows'].length,
                        mealsNames: meals,
                        mealsImages: mealsImgs,
                        mealsId: mealsId,
                        mealsDesc: mealsDesc,
                        mealsPrice: mealsPrice,
                        mealsTimes: mealsTimes
                    })

                } else {
                    console.error("Failure in meals.js");
                    console.log(err);
                    res.sendStatus(202);
                }
            });
        } catch{
            console.log('Something went down in meals.js');
        }
    });
} catch{
    console.log('Error in meals.js');
}

module.exports = router;
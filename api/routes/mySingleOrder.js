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

const Query = conn => query => new Promise((resolve, reject) => {
    try {
        conn.query(query, (err, res) => {
            if (err) return reject(err)
            resolve(res.rows)
        })
    } catch (er) {
        reject(er)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const query = Query(con);

        orderId = req.body.orderId;        

        const rows = await query(`SELECT mealsids, quantities, orderprice, single_meal_prices FROM orders WHERE id = ${orderId}`)

        if (!rows.length) {
            return res.status(202).json({
                message: '0 rows'
            })
        }
        try {
            mealsIds = rows[0]['mealsids'];
            quantities = rows[0]['quantities'];
            orderPrice = rows[0]['orderprice'];
            singleMealPrices = rows[0]['single_meal_prices'];
        } catch{
            console.log('something wrong with setting mealsIds value or quantities value');
        }

        const meals = await mealsIds.reduce((promise, id) => promise.then(async acc => {

            const currentResult = await query(`SELECT id, name, image, timeinmin, queueid, refresid FROM meals WHERE id = ${id}`)

            return acc.concat(currentResult)
        }), Promise.resolve([]))

        res.status(201).json({
            mealsArray: meals,
            mealsArrayLength: meals.length,
            mealsQuantities: quantities,
            orderPrice: orderPrice,
            singleMealPrices: singleMealPrices
        })

    } catch (err) {
        res.status(202);
        console.log(err);
    }
});

module.exports = router;
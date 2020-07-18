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

        userId = req.body.userId;

        const rows = await query(`SELECT id, mealsids FROM tmporders WHERE userid = ${userId} and isconfirmed = false`)

        if (!rows.length) {
            return res.status(202).json({
                message: '0 rows'
            })
        }
        try {
            mealsIds = rows[0]['mealsids'];
            orderId = rows[0]['id'];
        } catch{
            console.log('something wrong with setting mealsIds value or orderId value in tmpOrders.js');
        }

        const meals = await mealsIds.reduce((promise, id) => promise.then(async acc => {

            const currentResult = await query(`SELECT id, name, image, price, timeinmin, queueid FROM meals WHERE id = ${id}`)

            return acc.concat(currentResult)
        }), Promise.resolve([]))

        res.status(200).json({
            mealsArray: meals,
            mealsArrayLength: meals.length,
            orderId: orderId
        })

    } catch (err) {
        res.status(202).json(err)
    }
});

router.patch('/', async (req, res, next) => {

    userId = req.body.userId
    mealsIds = req.body.mealsIds

    try {

        sqlQuery = `UPDATE tmporders SET mealsids = ${mealsIds} WHERE userid = ${userId} and isconfirmed = false`;

        con.query(sqlQuery, (err, rows) => {

            if (!err) {
                res.sendStatus(201);
                console.log('Successfully Patched');
            } else {
                res.sendStatus(202);
                console.log('Error Patching in tmpOrders.js');
                console.log(err);

            }
        })

    } catch{
        console.log('Something went down in tmpOrders.js');
    }
})

module.exports = router;
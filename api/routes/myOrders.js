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

        const myOrders = await query(`SELECT id, orderdate, ordertime FROM orders WHERE userid = ${userId}`)

        res.status(200).json({
            myOrders: myOrders,
            ordersArrayLength: myOrders.length,
        })

    } catch (err) {
        res.status(202);
        console.log(err);
    }
});

router.patch('/', (req, res, next) => {

    userId = req.body.userId
    quantities = req.body.quantities

    try {

        sqlQuery = `UPDATE tmporders SET quantities = ARRAY${quantities} WHERE userid = ${userId} and isconfirmed = false`;

        con.query(sqlQuery, (err, rows) => {

            if (!err) {
                res.sendStatus(201);
                console.log('Successfully Patched');
            } else {
                res.sendStatus(202);
                console.log('Error Patching in myOrders.js');
                console.log(err);
            }
        })

    } catch{
        console.log('Something went down in myOrders.js');
    }
});

module.exports = router;
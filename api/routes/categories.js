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

        resId = req.body.resId;

        const rows = await query(`SELECT catsids FROM restaurants WHERE id = ${resId}`)

        if (!rows.length) {
            return res.status(202).json({
                message: '0 rows'
            })
        }
        try {
            catsIds = rows[0]['catsids'];
        } catch{
            console.log('something wrong with categories');
        }

        const cats = await catsIds.reduce((promise, id) => promise.then(async acc => {

            const currentResult = await query(`SELECT id, name, image FROM categories WHERE id = ${id} and is_cat_available = true ORDER BY id ASC`)

            return acc.concat(currentResult)
        }), Promise.resolve([]))

        res.status(200).json({
            catsArray: cats,
            catsArrayLength: cats.length
        })

    } catch (err) {
        res.status(202);
        console.log(err);
    }
});

module.exports = router;
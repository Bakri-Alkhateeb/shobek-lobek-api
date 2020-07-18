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

        resId = req.body.resId;
        var time = 0;

        sqlQuery = `SELECT name FROM restaurants where id = ${resId}`;

        try {
            con.query(sqlQuery, function (err, rows) {
                try {
                    resName = rows['rows'][0]['name'];
                } catch{
                    console.log('something wrong with setting resName in fetchResName.js');
                }

                if (!err) {
                    res.status(201).json({
                        resName: resName
                    });
                } else {
                    console.error("Failure in fetchResName.js");
                    console.log(err);
                    res.sendStatus(202);
                }
            });
        } catch{
            console.log('Something went down.');
        }
    });
} catch{
    console.log('Error in fetchResName.js');
}

module.exports = router;
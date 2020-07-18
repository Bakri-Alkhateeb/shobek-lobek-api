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
    var mealsPrices = req.body.mealsPrices;
    var userId = req.body.userId;
    var resId = req.body.resId;
    var orderPrice = req.body.orderPrice;
    var orderTime = req.body.orderTime;
    var orderLocation = req.body.orderLocation;
    var quantities = req.body.quantities;
    var extraInfo = req.body.extraInfo;
    var time = new Date();
    var will_user_get_it = req.body.willUserGetIt;
    var goToDeliveryService = req.body.goToDeliveryService;
    var timeChosen = req.body.timeChosen;
    if (timeChosen == null) {
        timeChosen = 0
    }
    var mins = time.getMinutes();
    if (mins < 10) {
        mins = "0" + mins.toString();
    }
    var myDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getUTCDate()}`;
    var myTime = `${time.getHours()}:${mins}`;

    sqlQuery = `insert into orders (orderdate, userid, mealsids, resid, orderprice, timeinmin, location, quantities, will_user_get_it, ordertime, go_to_delivery_service, timechosen, single_meal_prices, extra_info) VALUES('${myDate}', ${userId}, ARRAY${mealsIds}, ${resId}, ${orderPrice}, ${orderTime}, '${orderLocation}', ARRAY${quantities}, '${will_user_get_it}', '${myTime}', '${goToDeliveryService}', '${timeChosen}', ARRAY${mealsPrices}, '${extraInfo}');`;

    try {
        con.query(sqlQuery, function (err, row) {
            if (err) {
                res.sendStatus(202);
                console.log(err);
            } else {
                console.log("1 order inserted");
                res.sendStatus(201);

                sqlQuery2 = `SELECT * FROM tmporders`;

                con.query(sqlQuery2, function (err, row) {

                    if (err) {
                        res.sendStatus(202);
                        console.log('Failure in orders.js');

                    } else {
                        console.log('success');
                    }
                });
            }
        });
    } catch{
        console.log('Error in orders.js');
    }
});


module.exports = router;
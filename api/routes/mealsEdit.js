const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool;
const multer = require('multer');
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './mealsImages');
    },
    filename: function (req, file, callback) {
        callback(null, makeid(10) + "-" + file.originalname)
    }
});
const upload = multer({ storage: storage });

const dotenv = require('dotenv');
dotenv.config();
const con = new Pool({
    user: `${process.env.DB_USER}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`,
    password: `${process.env.DB_PASS}`,
    port: `${process.env.DB_PORT}`,
})

router.post('/', upload.single('mealImage'), (req, res, next) => {

    imageName = req.file.path.substring(11);    
    mealName = req.body.mealName;
    mealDesc = req.body.mealDesc;
    mealPrice = req.body.mealPrice;
    mealRes = req.body.mealRes;
    mealCat = req.body.mealCat;
    mealTime = req.body.mealTime;
    mealQueue = req.body.mealQueue;  
    mealId = req.body.mealId;
    mealAvailability = req.body.mealAvailability;    

    sqlQuery = `UPDATE meals SET name = '${mealName}', image = '${imageName}', description = '${mealDesc}', price = '${mealPrice}', refresid = '${mealRes}', catid = '${mealCat}', timeinmin = '${mealTime}', queueid = '${mealQueue}', is_meal_available = '${mealAvailability}' where id = '${mealId}';`;
    try {
        con.query(sqlQuery, function (err, result) {
            if (err) {
                res.sendStatus(202);
                console.log(err);
            } else {
                console.log("1 meal edited");
                res.sendStatus(201);
            }
        });
    } catch{
        console.log('Error in mealsEdit.js');
    }
});


module.exports = router;
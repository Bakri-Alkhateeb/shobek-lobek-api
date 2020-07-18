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
        callback(null, './resImages');
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

router.post('/', upload.single('resImage'), (req, res, next) => {
    imageName = req.file.path.substring(9);
    sqlQuery = `insert into restaurants (name, image) VALUES ('${makeid(3)}', '${imageName}')`;
    try {
        con.query(sqlQuery, function (err, result) {
            if (err) {
                res.sendStatus(202);
                console.log(req.file.path);
            } else {
                console.log("1 restaurant inserted");
                console.log(req.file.path);
                res.sendStatus(201);
            }
        });
    } catch{
        console.log('Error in resInsert.js');
    }
});


module.exports = router;
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mealsRoutes = require('./api/routes/meals');
const tmpOrderRoutes = require('./api/routes/tmpOrders');
const loginRoutes = require('./api/routes/login');
const signupRoutes = require('./api/routes/signup');
const restaurantsRoutes = require('./api/routes/restaurants');
const categoriesRoutes = require('./api/routes/categories');
const resInsertRoutes = require('./api/routes/resInsert');
const catsInsertRoutes = require('./api/routes/catsInsert');
const mealsInsertRoutes = require('./api/routes/mealsInsert');
const ordersInsertRoutes = require('./api/routes/ordersInsert');
const tmpOrdersDeleteRoutes = require('./api/routes/tmpOrdersDelete');
const timeCalcRoutes = require('./api/routes/timeRoute');
const ordersRoutes = require('./api/routes/orders');
const multiQueueTimeRoutes = require('./api/routes/multiQueueTime');
const queuesRoutes = require('./api/routes/queues');
const myOrdersRoutes = require('./api/routes/myOrders');
const getUserIdRoutes = require('./api/routes/getUserId');
const mySingleOrderRoutes = require('./api/routes/mySingleOrder');
const fetchResNameRoutes = require('./api/routes/fetchResName');
const addToQueueRoutes = require('./api/routes/addToQueue');
const checkConnectionRoutes = require('./api/routes/checkConnection');
const separateQueuesRoutes = require('./api/routes/separateQueues');
const mealsEditRoutes = require('./api/routes/mealsEdit');
const cartRoutes = require('./api/routes/Cart');
const returnMealTimeRoutes = require('./api/routes/returnMealTime');
const catsEditRoutes = require('./api/routes/catsEdit');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', '*')
        return res.status(200).json({})
    }
    next();
})

app.use('/meals', mealsRoutes);
app.use('/restaurants', restaurantsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/tmpOrders', tmpOrderRoutes);
app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);
app.use('/resInsert', resInsertRoutes);
app.use('/catsInsert', catsInsertRoutes);
app.use('/ordersInsert', ordersInsertRoutes);
app.use('/mealsInsert', mealsInsertRoutes);
app.use('/tmpOrdersDelete', tmpOrdersDeleteRoutes);
app.use('/timeRoute', timeCalcRoutes);
app.use('/orders', ordersRoutes);
app.use('/multiQueueTime', multiQueueTimeRoutes);
app.use('/myOrders', myOrdersRoutes);
app.use('/queues', queuesRoutes);
app.use('/getUserId', getUserIdRoutes);
app.use('/mySingleOrder', mySingleOrderRoutes);
app.use('/fetchResName', fetchResNameRoutes);
app.use('/addToQueue', addToQueueRoutes);
app.use('/checkConnection', checkConnectionRoutes);
app.use('/separateQueues', separateQueuesRoutes);
app.use('/mealsEdit', mealsEditRoutes);
app.use('/cart', cartRoutes);
app.use('/returnMealTime', returnMealTimeRoutes);
app.use('/catsEdit', catsEditRoutes);
app.use('/resImages', express.static('resImages'));
app.use('/mealsImages', express.static('mealsImages'));
app.use('/catsImages', express.static('catsImages'));

app.use('/', (req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use('/', (error, req, res, next) => {
    res.status(error.status || 500);    
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;
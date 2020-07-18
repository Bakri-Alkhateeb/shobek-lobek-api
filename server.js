const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
const server = http.createServer(app);
console.log(`Connected To Port: ${port}`);
server.listen(port);
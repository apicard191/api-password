const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'mysql',
    user:'root',
    password: null,
    database: 'nodejs'
});

connection.connect();

module.exports = connection;

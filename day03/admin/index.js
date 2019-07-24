/*
	nodejs 数据库查询mysql 数据库
*/
const express = require('express');
const mysql = require('mysql');

// 连接数据库
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});
connection.connect();


const app = express();

app.use(express.static('./src'));

app.get('/test', (req, res) => {
    connection.query('select * from goods', (err, results, fields) => {
        if (err) throw err;
        res.send({
        	data: results,
        	num: results.length
        })
    })
});

app.listen(8000, '127.0.0.1');
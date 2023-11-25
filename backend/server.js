var express = require('express')
const { read } = require('fs')
var mysql = require('mysql')
var app = express()

var con = mysql.createConnection({
    host: 'localhost',
    user: 'broker',
    password: 'changeMe!',
    database: 'hackathon'
})
/**
 *
 *
 * const connection = mysql.createPool({
 *   connectionLimit: 10,
 *   host: process.env.MYSQL_HOST || "localhost",
 *   user: process.env.MYSQL_USER || "root",
 *   password: process.env.MYSQL_PASSWORD || "password",
 *   database: process.env.MYSQL_DATABASE || "test",
 * });
 */

con.connect((err) => {
    if (err) throw err;
    console.log("Connected to DB!")
})

app.get('/healthCheck', function (req, res) {   
    res.end( JSON.stringify('All services are running!'))
})

app.get('/getClientByLicencePlate', function (req, res) {   
    if(!req.query['licence_plate']){
        res.json({state: 'no_valid_plate_no'})
    }else{
        con.query('SELECT * FROM clients WHERE licence_plate = ?', [req.query['licence_plate']], (error, results, fields) => {
            if(error) res.json({state: 'error'})
            
            if(results.length !== 0){
                res.json({state: 'client_found', client: results[0]})
            }else{
                res.json({state: 'no_client_found'})
            }
            
        })
    }
})

var server = app.listen(8080, function () {
    console.log("Server is up running!")
})

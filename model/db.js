require("dotenv").config();
const mysql = require("mysql2");
const dbConfig = require("../config/db_config.js");

//Creating connection to local the database
// const mysqlConnect = mysql.createConnection({
//     host: dbConfig.HOST,
//     user: dbConfig.USER,
//     password: dbConfig.PASSWORD,
//     //database: dbConfig.DB
//     port: '3306'
// });

//Creating connection to the database
const mysqlConnect = mysql.createConnection({
    host: process.env.HOSTNAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    port: '3306'
});

console.log("Hostname: "+process.env.HOSTNAME);


//Opening the MySql connection
mysqlConnect.connect((err) => {
    if(!err){
        console.log('Connected'); 
        mysqlConnect.query("CREATE DATABASE IF NOT EXISTS mysqluserdb", function (err, result) {
            if (err) throw err;
            console.log("Database created");
          });
        mysqlConnect.query("CREATE TABLE IF NOT EXISTS mysqluserdb.account (id VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL,last_name VARCHAR(255) NOT NULL,password VARCHAR(255) NOT NULL,username VARCHAR(255) NOT NULL,account_created VARCHAR(255) NULL,account_updated VARCHAR(255) NULL,PRIMARY KEY (id))", function (err, result) {
            if (err) throw err;
            console.log("Account Table created");
        });
        mysqlConnect.query("CREATE TABLE IF NOT EXISTS mysqluserdb.document (doc_id VARCHAR(255) NOT NULL, user_id VARCHAR(255) NOT NULL,name VARCHAR(255) NOT NULL,date_created VARCHAR(255) NOT NULL,s3_bucket_path VARCHAR(255) NOT NULL,PRIMARY KEY (doc_id))", function (err, result) {
            if (err) throw err;
            console.log("Document Table created");
        });
    }else{
        console.log('Database connection is failed \n Error : ' + JSON.stringify(err, undefined, 2));
    }
});

module.exports = mysqlConnect;  


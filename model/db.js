const mysql = require("mysql2");
const dbConfig = require("../config/db_config.js");

//Creating connection to the database
const mysqlConnect = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD
    //database: dbConfig.DB
});


//Opening the MySql connection
mysqlConnect.connect((err) => {
    if(!err){
        console.log('Connected'); 
        mysqlConnect.query("CREATE DATABASE IF NOT EXISTS mysqluserdb", function (err, result) {
            if (err) throw err;
            console.log("Database created");
          });
        mysqlConnect.query("CREATE TABLE IF NOT EXISTS mysqluserdb.account (id VARCHAR(45) NOT NULL, first_name VARCHAR(45) NOT NULL,last_name VARCHAR(45) NOT NULL,password VARCHAR(45) NOT NULL,username VARCHAR(45) NOT NULL,account_created VARCHAR(45) NULL,account_updated VARCHAR(45) NULL,PRIMARY KEY (id))", function (err, result) {
            if (err) throw err;
            console.log("Table created");
        });
    }else{
        console.log('Database connection is failed \n Error : ' + JSON.stringify(err, undefined, 2));
    }
});

module.exports = mysqlConnect;  


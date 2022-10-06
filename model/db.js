const mysql = require("mysql2");
const dbConfig = require("../config/db_config.js");

//Creating connection to the database
const mysqlConnect = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});


//Opening the MySql connection
mysqlConnect.connect((err) => {
    if(!err){
        console.log('Database connection is successful'); 
    }else{
        console.log('Database connection is failed \n Error : ' + JSON.stringify(err, undefined, 2));
    }
});

module.exports = mysqlConnect;  


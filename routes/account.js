const express = require("express");
const router = express.Router();
const logger = require('../logger.js');
const {v4 : uuidv4} = require('uuid')
const mysqlConnect = require("../model/db.js")
const mBasicAuth = require("../service/basic_auth.js")
const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var sns = new AWS.SNS({});

var StatsD = require('node-statsd'),
      client = new StatsD();



router.post('/', async (req,res)=>{
        try{
        logger.info("POST API Call");
        client.increment('Post User Info');    
        var emailValid =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const plainPassword = req.body.password;
        const user_email = req.body.username;
        const user_firstname = req.body.first_name;
        const user_lastname = req.body.last_name;
        logger.info("validation for user email, user firstname, user lastname and user password required");
        if(user_email == null || user_firstname == null || user_lastname == null || plainPassword==null){
            logger.info("All Fields Required Validation");
            res.status(400).send({
                "Message" : "Please submit all the required fields"
            })
            return;
        }
        logger.info("Creating Unique user Id");
        const user_id = uuidv4();
        logger.info("Encrypting password");
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const user_password = hashedPassword;
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+'T'+time;
        const account_created = dateTime;
        const account_updated = "";
        logger.info("Unique email validation");
        if(user_email.match(emailValid)){
            mysqlConnect.query(`INSERT INTO mysqluserdb.account (id, first_name, last_name, password, username, account_created, account_updated) 
            VALUES ('${user_id}', '${user_firstname}', '${user_lastname}', '${user_password}','${user_email}', '${account_created}', '${account_updated}')`, async (err, rows, fields)=>{
                if(!err){
                    logger.info("New UsserCreated");
                    res.status(201).send({
                        "id" : user_id,
                        "first_name": user_firstname,
                        "last_name": user_lastname,
                        "username": user_email,
                        "account_created": account_created,
                        "account_updated": account_updated
                    });

                    const userToken = uuidv4();
                    const timeToLive = new Date().getTime();

                    var message = {
                        'username' : user_email,
                        'token' : userToken,
                        'type' : "Information"
                    };

                    const params = {
                        Message: JSON.stringify(message), 
                        TopicArn: 'arn:aws:sns:us-east-1:987729257471:SNSTopicLambda'
                      };

                    // Create promise and SNS service object
                    var publishTextPromise = await sns.publish(params).promise();

                    publishTextPromise.then(function(data) {
                            console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                            console.log("MessageID is " + data.MessageId);
                                }).catch(
                                    function(err) {
                                 console.error(err, err.stack);
                             });  
                }else{
                    logger.info("Server error");
                    res.status(400).send({
                        "Message" : "Server not started"
                    });
                    return;
                }
            })
        }else{
            logger.info("401 status Add Vaild Email Adddress");
            res.status(401).send({
                "Message" : "Please add valid email address"
            });
            return;
        }
     
    }
    catch(err){
       logger.info(`Error ${err}`);
    }
  
});

router.get('/:id', mBasicAuth.mBasicAuth, (req,res)=>{
        logger.info("GET API Call");
        client.increment('GET User Info');
        mysqlConnect.query('SELECT * FROM mysqluserdb.account WHERE id = ?', [req.params.id], (err, rows)=>{
        if(!err){
            logger.info("Getting User data");
            res.status(200).send({
                "id" : rows[0].id,
                "first_name": rows[0].first_name,
                "last_name": rows[0].last_name,
                "username": rows[0].username,
                "account_created": rows[0].account_created,
                "account_updated": rows[0].account_updated
            });
        }else{
            logger.info("400 Bad Inavalid User Id");
            res.status(400).send('Bad Request');
        }
    })
});


router.put('/:id', mBasicAuth.mBasicAuth, (req,res)=>{
    logger.info("PUT API Call");
    client.increment('PUT User Info');
    const user_id = req.params.id;
    let user_firstname = req.body.first_name;
    let user_lastname = req.body.last_name;
    let user_password = req.body.password;
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date+'T'+time;
    const account_updated = dateTime;
    logger.info("validation for user firstname, user lastname and user password required");
    if(user_firstname == null || user_lastname == null || user_password==null){
        res.status(400).send({
            "Message" : "Please submit all the required fields"
        })
        return;
    }
    mysqlConnect.query(`SELECT password, first_name, last_name FROM mysqluserdb.account WHERE id='${user_id}'`,async (err, rows, fields)=>{
        if(!err){
            if(user_password == null){
                 user_password = rows[0].password;
            }else{
                const hashedPassword = await bcrypt.hash(user_password, 10);
                user_password = hashedPassword;
            }
            if(user_firstname == null){
                user_firstname = rows[0].first_name;
            }
            if(user_lastname == null){
                user_lastname = rows[0].last_name;
            }
            mysqlConnect.query(`UPDATE mysqluserdb.account SET password='${user_password}', 
            first_name='${user_firstname}', last_name='${user_lastname}', account_updated='${account_updated}' WHERE id='${user_id}'`, (err, rows, fields)=>{
                if(!err){
                    logger.info("204 Successfully Data Updated");
                    res.status(204).send('No content');
                }else{
                    logger.info("400 Bad Request");
                    res.status(400).send('Bad Request');
                    return;
                }
            })
        }else{
            logger.info("400 Bad Request");
            res.status(400).send('Bad Request');
            return;
        }
    })
   
});


module.exports = router;
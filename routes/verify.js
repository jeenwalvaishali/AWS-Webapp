const express = require("express");
const router = express.Router();
const aws = require('aws-sdk');
const logger = require('../logger.js');
const mysqlConnect = require("../model/db.js")
const dynamoDb = new aws.DynamoDB({
    region : 'us-east-1'
});

router.get('/',(req,res)=>{
    const email = req.query.email;
    const token = req.query.token;
    var params = {
        TableName : 'dynamodbTable',
        Key : {
            'Email' : {
                S : email
            },
            'Token' : {
                S : token
            }
        }
    }

    dynamoDb.getItem(params, function(err,data){
        if(err){
            console.log(err);
            res.status(400).send({
                "Message" : "Unable to Get Account Details"
            });
        }else{
            console.log(data.Item);
            let experationTime = data.Item.TimeToLive.N;
            let currentTime = new Date().getTime();
            let timeDuration = (experationTime - currentTime)/60000
            if(timeDuration>0){
                const status = 'verified';
                mysqlConnect.query(`UPDATE mysqluserdb.account SET account_status='${status}'WHERE username='${email}'`, (err, rows, fields)=>{
                if(!err){
                    logger.info("204 Successfully Data Updated");
                    res.status(200).send({
                        "Email" : email,
                        "Status" : "Verified"
                    });
                    return
                }else{
                    logger.info("400 Bad Request");
                    logger.info(err);
                    res.status(400).send('Bad Request');
                    return;
                }
            })
            }else{
                res.status(400).send({
                    "Message" : "Account verification link expired"
                }); 
            }
        }
    })
});

module.exports = router;
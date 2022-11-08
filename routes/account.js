const express = require("express");
const router = express.Router();
const logger = require('../logger.js');
const {v4 : uuidv4} = require('uuid')
const mysqlConnect = require("../model/db.js")
const mBasicAuth = require("../service/basic_auth.js")
const bcrypt = require('bcrypt');



router.post('/', async (req,res)=>{
        try{
        var emailValid =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const plainPassword = req.body.password;
        const user_email = req.body.username;
        const user_firstname = req.body.first_name;
        const user_lastname = req.body.last_name;
        if(user_email == null || user_firstname == null || user_lastname == null || plainPassword==null){
            logger.info("All Fields Submission Required")
            res.status(400).send({
                "Message" : "Please submit all the required fields"
            })
            return;
        }
        const user_id = uuidv4();
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const user_password = hashedPassword;
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+'T'+time;
        const account_created = dateTime;
        const account_updated = "";
        if(user_email.match(emailValid)){
            mysqlConnect.query(`INSERT INTO mysqluserdb.account (id, first_name, last_name, password, username, account_created, account_updated) 
            VALUES ('${user_id}', '${user_firstname}', '${user_lastname}', '${user_password}','${user_email}', '${account_created}', '${account_updated}')`, (err, rows, fields)=>{
                if(!err){
                    logger.info("User Created")
                    res.status(201).send({
                        "id" : user_id,
                        "first_name": user_firstname,
                        "last_name": user_lastname,
                        "username": user_email,
                        "account_created": account_created,
                        "account_updated": account_updated
                    });
                }else{
                    logger.info("400 Status Email Already exists")
                    res.status(400).send({
                        "Message" : "Email address already exist!"
                    });
                    return;
                }
            })
        }else{
            logger.info("401 status Add Vaild Email Adddress")
            res.status(401).send({
                "Message" : "Please add valid email address"
            });
            return;
        }
     
    }
    catch(err){
       logger.info(`Error ${err}`)
       console.log(err)
    }
  
});

router.get('/:id', mBasicAuth.mBasicAuth, (req,res)=>{
        mysqlConnect.query('SELECT * FROM mysqluserdb.account WHERE id = ?', [req.params.id], (err, rows)=>{
        if(!err){
            logger.info("200 Get User data")
            res.status(200).send({
                "id" : rows[0].id,
                "first_name": rows[0].first_name,
                "last_name": rows[0].last_name,
                "username": rows[0].username,
                "account_created": rows[0].account_created,
                "account_updated": rows[0].account_updated
            });
        }else{
            logger.info("400 Bad Request")
            res.status(400).send('Bad Request');
        }
    })
});


router.put('/:id', mBasicAuth.mBasicAuth, (req,res)=>{
    const user_id = req.params.id;
    let user_firstname = req.body.first_name;
    let user_lastname = req.body.last_name;
    let user_password = req.body.password;
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date+'T'+time;
    const account_updated = dateTime;
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
                    logger.info("204 Successfully Data Updated")
                    res.status(204).send('No content');
                }else{
                    logger.info("400 Bad Request")
                    res.status(400).send('Bad Request');
                    return;
                }
            })
        }else{
            logger.info("400 Bad Request")
            res.status(400).send('Bad Request');
            return;
        }
    })
   
});


module.exports = router;
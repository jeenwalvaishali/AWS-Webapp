require("dotenv").config();
const express = require("express");
const logger = require('../logger.js');
const router = express.Router();
const aws = require("aws-sdk");
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");
const BUCKETNAME = process.env.S3BUCKETNAME;
const mBasicAuth = require("../service/docuser_auth.js")
const basicAuth = require('basic-auth');
const mysqlConnect = require("../model/db.js")
const s3 = new aws.S3();
var StatsD = require('node-statsd'),
      client = new StatsD();

aws.config.update({
  region: process.env.REGION,
});

var storage = multer.memoryStorage();
const newUpload = multer({ storage }).single('file');


router.post("/", mBasicAuth.mBasicAuth, async (req, res, next) => {
  logger.info("POST Document API Call");
  client.increment('Post Add Document to s3 bucket'); 
  const doc_id = uuidv4();
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + "T" + time;
  const date_created = dateTime;
  try {
    logger.info("Basic User Authentication");
    const user =  basicAuth(req);

    mysqlConnect.query(`SELECT id FROM mysqluserdb.account WHERE username='${user.name}'`, async (err, rows)=>{
      if(!err){
          if(rows.length == 0){
              logger.info("Bad Request User name not found");
              res.status(401).send({
                  "Message" : "User name not found! Please enter correct username"
              });   
              return;
          }else{  
                newUpload(req, res, function(err) {
                    if(req.file == null || req.file == undefined){
                      logger.info("Upload valid document");
                      return res.status(401).send({
                        "Message": "Please send the file"
                      })
                    }
                    if (err instanceof multer.MulterError || err)
                        {
                          logger.info("500 Internal Server Error");
                          return res.status(500).json(err);
                        }
               
                    fileNameParts = req.file.originalname.split('.');
                    const newFileName = fileNameParts[0]+"-"+doc_id+"."+fileNameParts[1];
                    const uploadParams = {
                      Bucket: BUCKETNAME,
                      Key: newFileName,
                      ACL: 'public-read',
                      Body: req.file.buffer
                    };
      
                    s3.upload(uploadParams, (err, data) => {
                        if(err){ 
                          logger.info("500 Internal Server Error");
                          res.status(500).json({ error: 'Error -> ' + err });
                        }
                  
                        const id = rows[0].id;
                        mysqlConnect.query(`INSERT INTO mysqluserdb.document (doc_id, user_id, name, date_created, s3_bucket_path) VALUES ('${doc_id}', '${id}', '${newFileName}', '${date_created}','${data.Location}')`, (err, rows, fields)=>{
                            if(!err){
                                logger.info("Document uploaded");
                                res.status(201).send({
                                  "doc_id": doc_id,
                                  "user_id": id,
                                  "name": newFileName,
                                  "date_created": date_created,
                                  "s3_bucket_path": data.Location,
                                });
                                return;
                            }else{
                                logger.info("Email validation");
                                res.status(400).send({
                                    "Message" : "Email address already exist!"
                                });
                            return;
                          }
                        })
                      });
                });
              }
        }else{
          logger.info("Error" + err);
        }
     })
  } catch (error) {
    logger.info("Unauthorized Error" + err);
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});



router.get("/",mBasicAuth.mBasicAuth, async (req, res) => {
  try {
    logger.info("GET API Call");
    client.increment('Get document from s3 bucket');
    const user =  basicAuth(req);
    mysqlConnect.query(`SELECT id FROM mysqluserdb.account WHERE username='${user.name}'`, async (err, rows)=>{
      if(rows.length == 0){
        logger.info("User name not found Validation");
        res.status(401).send({
            "Message" : "User name not found! Please enter correct username"
        });   
        return;
    }else{
        const id = rows[0].id;
        mysqlConnect.query(`SELECT * FROM mysqluserdb.document WHERE user_id='${id}'`, async (err, rows)=>{
        logger.info("Get document of all user");
        res.send(rows);
      });
      }
    });
  } catch (error) {
    logger.info("Unauthorized Error");
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});

router.get("/:id",mBasicAuth.mBasicAuth, async (req, res) => {
  try {
    logger.info("GET ALL API");
    client.increment('Get all Document from s3 bucket');
    const user =  basicAuth(req);;
    const doc_id = req.params.id;
    mysqlConnect.query(`SELECT * FROM mysqluserdb.document WHERE doc_id='${doc_id}'`, async (err, rows)=>{
      logger.info("Get document by User Id");
      res.send(rows);
    });
  } catch (error) {
    logger.info("Unauthorized Error");
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});

router.delete("/:id",mBasicAuth.mBasicAuth, async (req, res) => {
  try {
    logger.info("DELETE API");
    client.increment('Delete document from s3 bucket');
    const doc_id = req.params.id;
    const user =  basicAuth(req);;
    mysqlConnect.query(`SELECT id FROM mysqluserdb.account WHERE username='${user.name}'`, async (err, rows)=>{
      if(rows.length == 0){
        logger.info("User name not found! Please enter correct username");
        res.status(401).send({
            "Message" : "User name not found! Please enter correct username"
        });   
        return;
    }else{
      const user_id = rows[0].id;
      mysqlConnect.query(`SELECT * FROM mysqluserdb.document WHERE doc_id='${doc_id}' and user_id='${user_id}'`, async (err, rows)=>{
        if(rows.length == 0){
          logger.info("Unauthorized to Delete the Document");
          res.status(401).send({
            "Message" : "Unauthorized to Delete the Document"
          });
        }else{
          const file_name = rows[0].name;
          await s3.deleteObject({ Bucket: BUCKETNAME, Key: file_name }).promise();
          mysqlConnect.query(`DELETE FROM mysqluserdb.document WHERE doc_id='${doc_id}'`, async (err, rows)=>{
          logger.info("Document Deleted succcessfully");
          res.status(204).send("File Deleted Successfully");
          });
        }
      });
    }
    });     
  } catch (error) {
    logger.info("Unauthorized Error");
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});

module.exports = router;
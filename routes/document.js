require("dotenv").config();
const express = require("express");
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

let uploads3 = new S3Client({
  region: process.env.REGION,
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
})

aws.config.update({
  region: process.env.REGION,
});

const upload = multer({
  storage: multerS3({
    s3: uploads3,
    acl: "private",
    bucket: BUCKETNAME,
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.post("/", mBasicAuth.mBasicAuth, upload.single("file"), async (req, res, next) => {
  const doc_id = uuidv4();
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + "T" + time;
  const date_created = dateTime;
  try {

    const user =  basicAuth(req);

    mysqlConnect.query(`SELECT id FROM mysqluserdb.account WHERE username='${user.name}'`, async (err, rows)=>{
      if(!err){
          if(rows.length == 0){
              res.status(401).send({
                  "Message" : "User name not found! Please enter correct username"
              });   
              return;
          }else{
              const id = rows[0].id;
              mysqlConnect.query(`INSERT INTO mysqluserdb.document (doc_id, user_id, name, date_created, s3_bucket_path) 
            VALUES ('${doc_id}', '${id}', '${req.file.key}', '${date_created}','${req.file.location}')`, (err, rows, fields)=>{
                if(!err){
                    res.status(201).send({
                      "doc_id": doc_id,
                      "user_id": id,
                      "name": req.file.key,
                      "date_created": date_created,
                      "s3_bucket_path": req.file.location,
                    });
                    return;
                }else{
                    res.status(400).send({
                        "Message" : "Email address already exist!"
                    });
                    return;
                }
            })
          }
      }else{
          console.log(err);
      }
     })
  } catch (error) {
    console.log(error);
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});

router.get("/",mBasicAuth.mBasicAuth, async (req, res) => {
  try {
    const user =  basicAuth(req);
    mysqlConnect.query(`SELECT id FROM mysqluserdb.account WHERE username='${user.name}'`, async (err, rows)=>{
      if(rows.length == 0){
        res.status(401).send({
            "Message" : "User name not found! Please enter correct username"
        });   
        return;
    }else{
        const id = rows[0].id;
        mysqlConnect.query(`SELECT * FROM mysqluserdb.document WHERE user_id='${id}'`, async (err, rows)=>{
          console.log(rows);
          res.send(rows);
      });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});

router.get("/:id",mBasicAuth.mBasicAuth, async (req, res) => {
  try {
    const user =  basicAuth(req);;
    const doc_id = req.params.id;
    mysqlConnect.query(`SELECT * FROM mysqluserdb.document WHERE doc_id='${doc_id}'`, async (err, rows)=>{
        console.log(rows);
        res.send(rows);
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});

router.delete("/:id",mBasicAuth.mBasicAuth, async (req, res) => {
  try {
    const doc_id = req.params.id;
    const user =  basicAuth(req);;
    mysqlConnect.query(`SELECT id FROM mysqluserdb.account WHERE username='${user.name}'`, async (err, rows)=>{
      if(rows.length == 0){
        res.status(401).send({
            "Message" : "User name not found! Please enter correct username"
        });   
        return;
    }else{
      const user_id = rows[0].id;
      mysqlConnect.query(`SELECT * FROM mysqluserdb.document WHERE doc_id='${doc_id}' and user_id='${user_id}'`, async (err, rows)=>{
        if(rows.length == 0){
          res.status(401).send({
            "Message" : "Unauthorized to Delete the Document"
          });
        }else{
          const file_name = rows[0].name;
          await s3.deleteObject({ Bucket: BUCKETNAME, Key: file_name }).promise();
          mysqlConnect.query(`DELETE FROM mysqluserdb.document WHERE doc_id='${doc_id}'`, async (err, rows)=>{
            res.status(204).send("File Deleted Successfully");
          });
        }
      });
    }
    });     
  } catch (error) {
    console.log(error);
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});

module.exports = router;
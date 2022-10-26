import * as dotenv from "dotenv";
dotenv.config();

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const BUCKETNAME = process.env.BUCKET;
const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "private",
    bucket: BUCKETNAME,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
});

router.post("/v1/documents", upload.single("file"), async (req, res, next) => {
  const doc_id = uuidv4();
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + "T" + time;
  const date_created = dateTime;
  try {
    res.status(201).send({
      doc_id: doc_id,
      user_id: user_id,
      name: req.file,
      date_created: date_created,
      s3_bucket_path: req.file.path,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});

router.get("/v1/documents", async (req, res) => {
  try {
    let listOfFiless = await s3.listObjectsV2({ Bucket: BUCKETNAME }).promise();
    let files = listOfFiless.Contents.map((item) => item.Key);
    res.status(200).send(files);
  } catch (error) {
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});

router.get("/v1/documents/:id", async (req, res) => {
  try {
    const doc_id = req.params.id;
    let file = await s3.getObject({ Bucket: BUCKETNAME, Key: doc_id }).promise();
    res.status(200).send(file.Body);
  } catch (error) {
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});

router.delete("/v1/documents/:id", async (req, res) => {
  try {
    const doc_id = req.params.id;
    await s3.deleteObject({ Bucket: BUCKETNAME, Key: doc_id }).promise();
    res.status(204).send("File Deleted Successfully");
  } catch (error) {
    res.status(401).send({
      Message: "Unauthorized",
    });
    return;
  }
});

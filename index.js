const express = require("express");
const logger = require('./logger.js');
const app = express();
const accountRoute = require("./routes/account.js");
const documentRoute = require("./routes/document.js");
const verifyRoute = require("./routes/verify.js");
var bodyParser = require('body-parser');
const port = 3000;

var StatsD = require('node-statsd'),
      client = new StatsD();

// Increment: Increments a stat by a value (default is 1)
client.increment('my_counter');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get("/health", (req, res) =>{
    client.increment('Healthy!');
    logger.info("Healtnz called")
    res.status(200).send({message: "Healthy!"})
});

app.use('/v1/account/',accountRoute);
app.use('/v1/documents/',documentRoute);
app.use('/v1/verifyUserEmail',verifyRoute);

app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
});

module.exports = app;


const express = require("express");
const app = express();
const accountRoute = require("./routes/account.js");
var bodyParser = require('body-parser');
const port = 3000;



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get("/healthz", (req, res) =>{
    res.status(200).send({message: "Healthy!"})
});

app.use('/v1/account/',accountRoute);

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

module.exports = app;


const basicAuth = require('basic-auth');
const bcrypt = require('bcrypt');
const mysqlConnect = require("../model/db.js");


const mBasicAuth = (req , res, next) => {
       const user =  basicAuth(req);
       if(!user || !user.name || !user.pass){
            res.status(401).send({
                "Message" : "Please enter username and password"
            });
            return;
        }
       mysqlConnect.query(`SELECT password, id, account_status FROM mysqluserdb.account WHERE username='${user.name}'`, async (err, rows)=>{
        if(!err){
            if(rows.length == 0){
                res.status(401).send({
                    "Message" : "User name not found! Please enter correct username"
                });   
                return;
            }else{
                const password = rows[0].password;
                const id = rows[0].id;
                const validPass = await bcrypt.compare(user.pass,password);
                const accountStatus = rows[0].account_status;
                if(accountStatus === "unverified"){
                    res.status(401).send({
                        "Message" : "Account in Unverified. Please verify your account"
                    });
                }
                if (validPass) {
                    if(id == req.params.id){
                        next();
                    }
                    else{
                        res.status(401).send({
                            "Message" : "Incorrect Id send in request! Please send the correct Id"
                        });
                    }
                } else {
                    res.status(401).send({
                        "Message" : "Incorrect Password! Please enter correct password"
                    }); 
                }
            }
        }else{
            console.log(err);
        }
       })        
}

module.exports = {
    mBasicAuth : mBasicAuth
} ;

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
// provide the path of static files, then we should be able to refer to these static files by a relative URL
// this is relative to the public folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
// create a new javascript object
    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LANME: lName
                }
            }
        ]
    };

// turn the data into a string in the format of JSON
    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/e71b83d028"

    const options = {
        method: "POST",
        auth: "chen:715539ff447d1cdbbe0ce08e25309751-us14"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    // request.write(jsonData);
    request.end();
});

    //when click "try again" button, take back to signup page
    app.post("/failure", function(req, res){
        res.redirect("/")
    })

    //dynamic port number on heroku or local host 3000
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});

// mailchimp
// API key
// 715539ff447d1cdbbe0ce08e25309751-us14
// list ID
// e71b83d028
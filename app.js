const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https");

const app = express();



//using bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//making a folder static now we will be able to address the static files using relative address
app.use(express.static("public"));



//setting up home route
app.get("/", function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

//programming the post route
app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;


  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  //converting json to string
  var jsonData = JSON.stringify(data);

  //url - mail chimp base urlencoded
  const url = "https://us20.api.mailchimp.com/3.0/lists/4ae6b1a260";

  //creatting options
  const options = {
    method: "POST",
    auth: "aumaid:0898db721ccdf89eaa474a8808987adb-us20"

  };

  //creating a request
const request =  https.request(url, options, function(response){

    response.on("data", function(data){

        //checking status code
        if (response.statusCode === 200){
          res.sendFile(__dirname+"/success.html");
        }else {
          res.sendFile(__dirname+"/failure.html");
        }

    });

  });

  request.write(jsonData);
  request.end();

});


//post route for failure page
app.post("/failure", function(req,res){

  //redirection handler
  res.redirect("/");

});


//since we are deploying it now on heroku we will let heroku specify its port
// we change 3000 with process.env.PORT
app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server is running on port 3000");
});




//api key
// 0898db721ccdf89eaa474a8808987adb-us20

//list idea
// 4ae6b1a260

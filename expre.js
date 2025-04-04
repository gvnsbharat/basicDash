/*var express = require('express') 
 var app = require('express');
var app = express()
const admin = require("firebase-admin");

const serviceAccount = require("./key.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://console.firebase.google.com/project/hi-bha/overview" // replace with your Firebase DB URL
  });


  const db = admin.firestore();

  app.use(express.static('public'));

//app.get('/', function (req, res) {  
//res.send('<h1>Hello World!</h1>')  
//})  
//app.get('/signup', function (req, res) {  
  //  res.send('Hello ggggg World!')  
//    })  
app.get('/login', function (req, res) {  
res.sendFile( __dirname + "/public/" + "kl.html" );

  
})  
app.get('/login', function (req, res) {  
    res.sendFile( __dirname + "/public/" + "kl.html" );
    
      
    })  
app.get("/dashboard",function(req,res){
    console.log("thanks")
    db.collection("usersDemo")
    .add({
        FullName:req.query.Fullname,
        Email:req.query.Email,
        Password:req.query.Password,
    })
    .then(()=>{
        res.send("signup Succesfull");
    })
})
    
  
  
app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
})*/
/*
const express = require("express");
const app = express();
const admin = require("firebase-admin");

const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // Enables form data parsing

// Serve Login Page
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/public/" + "kl.html");
});

// Signup Route (Using GET or POST)
app.get("/dashboard", function (req, res) {
  console.log("Signup request received");

  const { Fullname, Email, Password } = req.query; // If using GET

  if (!Fullname || !Email || !Password) {
    return res.send("All fields are required!");
  }

  db.collection("usersDemo")
    .add({
      FullName: Fullname,
      Email: Email,
      Password: Password,
    })
    .then(() => {
      res.send("Signup Successful!");
    })
    .catch((error) => {
      console.error("Error saving data:", error);
      res.send("Error signing up.");
    });
});

// Start the Server
app.listen(3000, function () {
  console.log("Server running on port 3000!");
});*/

 var app = require('express');
 var express = require('express')  
 var app = express()
 app.use(express.urlencoded({ extended: true }));
 const path = require("path");

 const admin = require("firebase-admin");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));
const serviceAccount = require("./key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/project/hi-bha/overview" // replace with your Firebase DB URL
});

  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
app.use(express.static('public'));

  
app.get('/signup', function (req, res) {  
res.sendFile( __dirname + "/public/" + "signup.html" );

  
}) 
app.get('/login', function (req, res) {  
  res.sendFile( __dirname + "/public/" + "login.html" );
    
  }) 
app.get("/signupSuck",function(req,res){
    console.log("thanks")
    db.collection("usersDemo")
    .add({
        FullName:req.query.FullName,
        Email:req.query.Email,
        Password:req.query.Password,
    })
    .then(()=>{
        res.send("signup Succesfull");
    })
})
app.get("/dashboard", function (req, res) {
  const { Email, Password } = req.query; // Extract email and password

  if (!Email || !Password) {
    return res.send("Email and Password are required!");
  }

  db.collection("usersDemo")
    .where("Email", "==", Email)
    .where("Password", "==", Password)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        return res.send("Invalid email or password!");
      }

      let userData;
      querySnapshot.forEach((doc) => {
        userData = doc.data(); // Store user data
      });

      // Render dashboard.ejs and pass user data
      res.render("dashboard", { user: userData });
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      res.send("Error logging in.");
    });
});
app.post("/logout", (req, res) => {

  res.redirect("/login");
});

app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
})

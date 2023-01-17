const exp = require("express");
const userApp = exp.Router();
const mongoClient = require("mongodb").MongoClient;
require('dotenv').config();
const dbConnectionString = process.env.DATABASEURL
let userCollectionObject;
let dataCollectionObject;


mongoClient.connect(dbConnectionString)
  .then(client => {
    //create DB object
    const dbObj = client.db("portfolio");
    //get collection object
    
    dataCollectionObject = dbObj.collection("messageData")
    //share userCollectionObj
    console.log("Connected to messageDB ")
  })
  .catch(err => console.log("err in connecting to DB ", err))



  mongoClient.connect(dbConnectionString)
  .then(client => {
    //create DB object
    const dbObj = client.db("portfolio");
    //get collection object
    
    userCollectionObject = dbObj.collection("track")
    //share userCollectionObj
    console.log("Connected to dataDB ")
  })
  .catch(err => console.log("err in connecting to DB ", err))


//middleware to parse  body of req
userApp.use(exp.json());


//route for POST req
userApp.post("/create-user", async (request, response) => {
  //get usercollectionobj
  //get userObj from client
  let userObj = await request.body;

  //verify existing user
  let userOfDB = await dataCollectionObject.findOne({
    username: userObj.username,
  });


  //if user existed
  if (userOfDB !== null) {
    response.send({ message: "Duplicate Data" });
  }
  //if user not existed
  else {
    await dataCollectionObject.insertOne(userObj);
    response.send({ message: "Message Sent" });
  }
});





userApp.post("/track", async (request, response) => {

  //get userObj from client
  let userObj = await request.body;

  //verify existing date
  let userOfDB = await userCollectionObject.findOne({
    currentDate: userObj.currentDate
  });

  //if date existed update
  if (userOfDB !== null) {

    console.log(userObj)
    userObj = { ...userObj, count: userOfDB.count + 1 }
    console.log(userObj)
    let res = await userCollectionObject.updateOne(
      { currentDate: userObj.currentDate },
      { $set: { ...userObj } }
    );
  }
  //if user not existed add new
  else {
    await userCollectionObject.insertOne(userObj);
    //send res
  }
});


//export userApp
module.exports = userApp;
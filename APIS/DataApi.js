const exp = require("express");
const userApp = exp.Router();
const  ObjectId = require('mongodb').ObjectId;


//middleware to parse  body of req
userApp.use(exp.json());

//define routes
//route for GET req for all users
userApp.get("/get-users", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get data
  let users = await userCollectionObject.find().toArray();
  //send res
  response.send({ message: "users data", payload: users });
});



//route for POST req
userApp.post("/create-user", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get userObj from client
  let userObj = request.body;

  //verify existing user
  let userOfDB = await userCollectionObject.findOne({
    username: userObj.username,
  });

  
  //if user existed
  if (userOfDB !== null) {
    response.send({ message: "Duplicate Data" });
  }
  //if user not existed
  else {
    await userCollectionObject.insertOne(userObj);
    //send res
    response.send({ message: "Post Request Successful" });
  }
});

//route for PUT req
userApp.put("/update-user", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get userObj from client
  let userObj = request.body;
  //update user by id
  let res= await userCollectionObject.updateOne(
    { username: userObj.username },
    { $set: { ...userObj } }
  );
  
  //send res
  if(res.modifiedCount===1)
  response.send({ message: "Put Request Successful" });
  else
  response.send({message:"put request failed"});
});

//route for DELETE req
userApp.delete("/remove-user/:id", async (request, response) => {
  //get usercollectionobj
  
  let userCollectionObject = request.app.get("userCollectionObject");
  //get url param
  
  let userId = request.params.id;
  //delete user
  let res =await userCollectionObject.deleteOne( {"_id": ObjectId(userId)});
  //send res
  if(res.deletedCount===1)
  response.send({ message: "Data deleted" });
  else
  response.send({message:"deletion unsuccessful"})
});

//export userApp
module.exports = userApp;
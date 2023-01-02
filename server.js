const exp=require("express");
const mongoClient=require("mongodb").MongoClient;
const path=require("path")
const app=exp()
const cors = require('cors')
app.use(cors({
    origin: ["https://crud-practice-app.onrender.com"]
}
))
//connecting react build with express server
//app.use(exp.static(path.join(__dirname, "./build")));
app.get("/", (req, res) => {
    res.send("Home page");
  });
  

const dbConnectionString="mongodb+srv://madhu:madhu@clusterbackend.szevd.mongodb.net/myfirstdb?retryWrites=true&w=majority"

//connect to DB
mongoClient.connect(dbConnectionString)
.then(client=>{
  //create DB object
  const dbObj=client.db("crudpractice");
  //get collection object
  const userCollectionObject=dbObj.collection("data")
  //share userCollectionObj
  app.set("userCollectionObject",userCollectionObject)
  

  console.log("Connected to DB successfully")
})
.catch(err=>console.log("err in connecting to DB ",err))



//import userApp&productApp
const dataApi=require("./APIS/DataApi");

//execute routes based on path
app.use("/user",dataApi)

//assign port
const port=5000;
app.listen(port,()=>console.log("server on port 4000..."))
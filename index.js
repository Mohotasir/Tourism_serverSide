const express = require('express');
const cors = require('cors');
const app  = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.port || 5000;

app.use(express.json())
app.use(cors());

/////////////////////////////////////


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ey9o5hx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();
    const databaseCollection = client.db("tourismDB").collection("spot");
    app.post('/spots',async(req,res)=>{
        const user = req.body;
         //console.log("new user",user)
         const result = await databaseCollection.insertOne(user);
         res.send(result);
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    //await client.close();
  }
}
run().catch(console.dir);






app.listen(port,()=>{
    console.log(`app listening on port  ${port}`)
})
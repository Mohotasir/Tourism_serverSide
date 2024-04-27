const express = require('express');
const cors = require('cors');
const app  = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
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

    app.get("/spots",async(req,res)=>{
        const cursor = databaseCollection.find();
        const result = await  cursor.toArray();
        res.send(result);
    })
    app.get('/spots/:id',async(req,res)=>{
          const id = req.params.id;
          console.log(id);
          const query = {_id : new ObjectId(id)};
          const spot = await databaseCollection.findOne(query);
          res.send(spot);
    })
    app.post('/spots',async(req,res)=>{
        const spot = req.body;
         //console.log("new user",user)
         const result = await databaseCollection.insertOne(spot);
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
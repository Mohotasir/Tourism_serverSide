const express = require('express');
const cors = require('cors');
const app  = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors(//{
 // origin:[" http://localhost:5173/","https://tourism-3cbc5.firebaseapp.com/"]
//}
));

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
    
    //await client.connect();
    const databaseCollection = client.db("tourismDB").collection("spot");
    const  countryCollection= client.db("tourismDB").collection("country");
    app.get("/",(req,res)=>{
      res.send("server is running")
    })
    app.get("/spots",async(req,res)=>{
        const cursor = databaseCollection.find();
        const result = await  cursor.toArray();
        res.send(result);
    })
    // get country ..........
    app.get("/country",async(req,res)=>{
      const cursor =  countryCollection.find();
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
    app.get('/spots', async (req, res) => {
        const email = req.query.email; 
        const query = email ? { email: email } : {}; 
        const cursor = databaseCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    });
    

    app.post('/spots',async(req,res)=>{
        const spot = req.body;
         const result = await databaseCollection.insertOne(spot);
         res.send(result);
    })
    app.post('/country',async(req,res)=>{
        const cntry = req.body;
         const result = await countryCollection.insertOne(cntry);
         res.send(result);
    })
    app.put("/spots/:id",async(req,res)=>{
        const id  = req.params.id;
        const spot = req.body;
        console.log(id,spot)
        const filter = {_id : new ObjectId(id)}
        const options = {upsert: true}
        const updateData = {
            $set: {
                img: spot.img,
                spotName: spot.spotName,
                country_name: spot.country_name,
                location: spot.location,
                sd:spot.sd,
                ac: spot.ac,
                seasonality: spot.seasonality,
                tt: spot.tt,
                vr: spot.vr,
                
                
            }
        };
        
        const result = await databaseCollection.updateOne(filter,updateData,options);
        res.send(result);
    })
    app.delete('/spots/:id',async(req,res)=>{
           const id = req.params.id;
           console.log("deleted id is:",id)
           const query = {_id : new ObjectId(id)};
           const result = await databaseCollection.deleteOne(query);
           res.send(result)
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
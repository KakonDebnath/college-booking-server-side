const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9m7cjb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to college booking system');
});
async function run() {
    try {
        // all collections
        const usersCollection = client.db("college-booking").collection("users");
        const allCollegeCollection = client.db("college-booking").collection("allCollege");
        const selectedCollegeCollection = client.db("college-booking").collection("selectedCollege");

        // Connect the client to the server	(optional starting in v4.7)
        client.connect();


        // Save user email and role in DB all
        app.put('/users', async (req, res) => {
            const user = req.body
            // console.log(user);
            const email = user.email
            const query = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await usersCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

        // get Profile
        app.get('/userProfile', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            res.send(result);
        })
        // get all college
        app.get('/allCollege', async (req, res) => {

            const result = await allCollegeCollection.find().toArray();
            res.send(result);
        })
        // get college for details
        app.get("/collegeDetails/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allCollegeCollection.findOne(query);
            res.send(result);
        })
        // get all selected college
        app.get("/myCollege", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await selectedCollegeCollection.find(query).toArray();
            res.send(result);
        })
        // Add College to my college
        app.post("/addCollege", async (req, res) => {
            const college = req.body;
            const result = await selectedCollegeCollection.insertOne(college)
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.listen(port, (req, res) => {
    console.log(`app is listening on port ${port}`);
});






const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i3vn5zp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toyCollection = client.db('toyStore').collection('toys');

        // toy collection
        app.get('/toys', async (req, res) => {
            console.log(req.query.seller_email);
            let query = {};
            if (req.query?.seller_email) {
                query = { seller_email: req.query.seller_email }
            }
            const cursor = toyCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        // toy collection

        app.post('/toys', async (req, res) => {
            const addToys = req.body;
            console.log(addToys);
            const result = await toyCollection.insertOne(addToys);
            res.send(result)
        })

        // delete operation
        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result)
        })
        // delete operation

        // update operation
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result)
        })
        // update operation

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// mongodb


app.get('/', (req, res) => {
    res.send('Toylandia server is running')
})

app.listen(port, () => {
    console.log(`toulandia server is running on port ${port}`);
})
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3010;
require('dotenv').config();

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.egzybej.mongodb.net/?retryWrites=true&w=majority`;


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
    const collegeCollection = client.db('College-Navigator').collection('Colleges');
    const userCollection = client.db('College-Navigator').collection('Users');
    const bookingCollection = client.db('College-Navigator').collection('My-Bookings');
    const reviewCollection = client.db('College-Navigator').collection('Reviews');

    // GET ------ GET ------ GET -------- GET
    // Getting all the colleges info
    app.get('/colleges', async(req, res) => {
        const colleges = await collegeCollection.find().toArray();
        res.send(colleges);
    });

    // Searching colleges based on name
    app.get('/college/:name', async(req, res) => {
      const name = req.params.name;
      const query = {name : {$regex: name, $options: 'i'}};
      const colleges = await collegeCollection.find(query).toArray();
      res.send(colleges);
    })

    // Getting specific college details
    app.get('/college-details/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const college = await collegeCollection.findOne(query);
      res.send(college);
    })

    // Getting bookings based on user email
    app.get('/my-bookings/:email', async (req, res) => {
      const email = req.params.email;
      const query = {email: email};
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    })

    // getting all reviews
    app.get('/reviews', async(req, res) => {
      const reviews = await reviewCollection.find().toArray();
      res.send(reviews);
    });

    // Getting user details
    app.get('/user/:email', async(req, res) => {
      const email = req.params.email;
      const query = {email: email};
      const user = await userCollection.findOne(query);
      res.send(user);
    })

    // POST --------- POST --------- POST ---------- POST
    app.post('/upload-booking', async (req, res) => {
      const data = req.body;
      const doc = {...data};
      const result = await bookingCollection.insertOne(doc);
      res.send(result);
    });

    // Add review
    app.post('/add-review', async(req, res) => {
      const data = req.body;
      const doc = {...data};
      const result = await reviewCollection.insertOne(doc);
      res.send(result);
    });


    // PUT --------- PUT --------- PUT ---------- PUT
    app.put('/save-user/:email', async(req, res) => {
      const email = req.params.email;
      const userInfo = req.body;
      const query = {email : email};
      const updatedDoc = {
        $set: {...userInfo}
      };
      const options = {upsert : true};
      const result = await userCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    })

    // PATCH --------- PATCH --------- PATCH ---------- PATCH
    // app.patch('/update-user/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const data = req.body;
    //   const query = {email: email};
    //   const doc = {
    //     $set: {...data}
    //   };
    //   const options = { upsert : true };
    //   const result = await userCollection.updateOne( query, doc, options );
    //   res.send(result);
    // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Welcome to College Navigator Server');
})

app.listen(port, () => {
    console.log('Server is running on port 3010');
});
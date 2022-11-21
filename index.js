const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Use Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.fgazbky.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const shoescollection = client.db("shoesDeal").collection("shoes");
    await client.connect();

    // Get All products
    app.get("/shoes", async (req, res) => {
      const query = {};
      const cursor = shoescollection.find(query);
      const shoes = await cursor.toArray();
      res.send(shoes);
    });

    // Get Single Product
    app.get("/shoe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await shoescollection.findOne(query);
      res.send(product);
    });

    // Add new stock Product
    app.put("/shoe/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: updateUser,
      };

      const result = await shoescollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Decrease Stock
    app.put("/shoeStockDecrease/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: updateUser,
      };

      const result = await shoescollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Delete One
    app.delete("/manageInventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await shoescollection.deleteOne(query);
      res.send(result)
    });

    // Post Data
    app.post("/shoes", async (req, res) => {
      const product = req.body;
      const result = await shoescollection.insertOne(product);
      res.send(result);
    });

    // Find Specific Product
    app.get('/myItems', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      console.log(query)
      const cursor =  shoescollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Crud is running on port ${port}`);
});

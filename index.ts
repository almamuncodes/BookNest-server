import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
dotenv.config();
const mongodb_1 = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing in the .env file");
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    // await client.connect();
    const db = client.db("booknest");
    const itemCollection = db.collection("book");
    const bookmarkCollection = db.collection("bookmark");


    // items get
    app.get('/api/items', async (req, res) => {
      const result = await itemCollection.find().toArray();
      res.send(result);
    })
    // Single item get
    app.get("/api/items/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid ID",
        });
      }

      const query = {
        _id: new ObjectId(id),
      };

      const result = await itemCollection.findOne(query);

      if (!result) {
        return res.status(404).send({
          message: "Book not found",
        });
      }

      res.send(result);
    });

    // items added
    app.post('/api/items', async (req, res) => {
      const items = req.body;
      const result = await itemCollection.insertOne(items);
      res.send(result);
    })
  // toggle bookmark
app.post('/api/bookmarks', async (req, res) => {
  const { userId, bookId } = req.body;
  const query = { userId, bookId };
  
  const existing = await bookmarkCollection.findOne(query);
  if (existing) {
    await bookmarkCollection.deleteOne(query);
    res.send({ bookmarked: false });
  } else {
    await bookmarkCollection.insertOne({ userId, bookId, createdAt: new Date() });
    res.send({ bookmarked: true });
  }
});

// get user bookmark
app.get('/api/bookmarks/:userId', async (req, res) => {
  const { userId } = req.params;
  const bookmarks = await bookmarkCollection.find({ userId }).toArray();
  res.send(bookmarks);
});


// Get all items posted by a specific user 
app.get('/api/items/user/:email', async (req, res) => {
    const { email } = req.params;
    const result = await itemCollection.find({ createdBy: email }).toArray();
    res.send(result);
});

// Update (edit) an item
app.patch('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongodb_1.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    const { requesterEmail, ...updatedData } = req.body;
    if (!requesterEmail) {
        return res.status(400).send({ message: "requesterEmail is required" });
    }

    const query = { _id: new mongodb_1.ObjectId(id) };
    const book = await itemCollection.findOne(query);

    if (!book) {
        return res.status(404).send({ message: "Book not found" });
    }
    if (book.createdBy !== requesterEmail) {
        return res.status(403).send({ message: "You don't have permission to edit this book" });
    }

    const updateDoc = { $set: updatedData };
    const result = await itemCollection.updateOne(query, updateDoc);
    res.send(result);
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongodb_1.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    const { requesterEmail } = req.body;
    if (!requesterEmail) {
        return res.status(400).send({ message: "requesterEmail is required" });
    }

    const query = { _id: new mongodb_1.ObjectId(id) };
    const book = await itemCollection.findOne(query);

    if (!book) {
        return res.status(404).send({ message: "Book not found" });
    }
    if (book.createdBy !== requesterEmail) {
        return res.status(403).send({ message: "You don't have permission to delete this book" });
    }

    const result = await itemCollection.deleteOne(query);
    res.send(result);
});









    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close(); ,,
  }
};

run().catch(console.dir);

app.get("/", (_req, res) => {
  res.send("booknest Server is running on 5000...");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});     
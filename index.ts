import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
dotenv.config();

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
  // বুকমার্ক করা বা রিমুভ করা (Toggle)
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

// ইউজারের সব বুকমার্ক পাওয়া
app.get('/api/bookmarks/:userId', async (req, res) => {
  const { userId } = req.params;
  const bookmarks = await bookmarkCollection.find({ userId }).toArray();
  res.send(bookmarks);
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
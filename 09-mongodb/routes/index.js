var express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "test";

const client = new MongoClient(url);

let db;

async function connectDB()
{
    if (db) return db;

    try
    {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db(dbName);
        return db;
    }
    catch (err)
    {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
}

connectDB();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello World!', condition: true, anyArray: [1, 2, 3] });
});

router.get('/get-data', async function(req, res, next) {
    try
    {
        const result = await db
            .collection("user-data")
            .find()
            .toArray();

        console.log(result.length);

        res.render('index', { items: result });
    }
    catch (err)
    {
        next(err);
    }
});

router.post('/insert', async function(req, res, next) {
    try
    {
        const item = {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
        };

        await db.collection("user-data").insertOne(item);

        console.log('Inserted successfully');
        res.redirect('/');
    }
    catch (err)
    {
        next(err);
    }
});

router.post('/update', async function(req, res, next) {
    try
    {
        const item = {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
        };

        const id = req.body.id;

        await db.collection("user-data").updateOne({ _id: new ObjectId(id) }, { $set: item });

        console.log('Updated successfully');
        res.redirect('/');
    }
    catch (err)
    {
        next(err);
    }
});

router.post('/delete', async function(req, res, next) {
    try
    {
        const id = req.body.id;
        await db.collection("user-data").deleteOne({ _id: new ObjectId(id) });

        console.log('Deleted successfully');
        res.redirect('/');
    }
    catch (err)
    {
        next(err);
    }
});

module.exports = router;

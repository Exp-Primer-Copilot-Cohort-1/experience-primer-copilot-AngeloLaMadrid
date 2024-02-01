// Create web server
// Use express.js
const express = require('express');
const app = express();

// Use body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Use cors
const cors = require('cors');
app.use(cors());

// Use morgan
const morgan = require('morgan');
app.use(morgan('dev'));

// Use mongodb
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = 'mongodb://localhost:27017';
const dbName = 'blog';
let db;

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err);
  db = client.db(dbName);
  console.log(`Connected MongoDB: ${url}`);
  console.log(`Database: ${dbName}`);
});

// GET /comments
app.get('/comments', (req, res) => {
  db.collection('comments').find().toArray((err, result) => {
    if (err) return console.log(err);
    res.json(result);
  });
});

// GET /comments/:id
app.get('/comments/:id', (req, res) => {
  const id = req.params.id;
  db.collection('comments').findOne({ _id: ObjectId(id) }, (err, result) => {
    if (err) return console.log(err);
    res.json(result);
  });
});

// POST /comments
app.post('/comments', (req, res) => {
  const comment = req.body;
  db.collection('comments').insertOne(comment, (err, result) => {
    if (err) return console.log(err);
    console.log('Saved to database');
    res.json(result.ops[0]);
  });
});

// PUT /comments/:id
app.put('/comments/:id', (req, res) => {
  const id = req.params.id;
  const newValues = { $set: req.body };
  db.collection('comments').updateOne({ _id: ObjectId(id) }, newValues, (err, result) => {
    if (err) return console.log(err);
    console.log('Updated in database');
    res.json(result);
  });
});

// DELETE /comments/:id
app.delete('/comments/:id', (req, res) => {
   const id = req.params.id;
   db.collection('comments').deleteOne({ _id: ObjectId(id) }, (err, result) => {
      if (err) return console.log(err);
      console.log('Deleted in database');
      res.json(result);
   }); // Agregar una coma (',') al final de esta línea
}); // Cerrar el paréntesis ')' en esta línea
